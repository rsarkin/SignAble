'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { getHandLandmarker, closeHandLandmarker, getActiveDelegate } from '../vision/handLandmarker';
import { CameraService, mapCameraError, type CameraError } from '../vision/camera';
import { loadOpenCV, preprocessFrame } from '../vision/preprocess';
import { evaluate } from '../recognizer/evaluate';
import { HELLO_CONFIG, type SignConfig } from '../recognizer/config';
import type { Checks, Evaluation, SignState, TimedFrame } from '../recognizer/types';

export interface UrlTestingFlags {
  debug: boolean;
  cv: 'on' | 'off';
  delegate: 'gpu' | 'cpu';
  res: '360' | '480' | '720';
  overlay: 'on' | 'off';
  fps: '12' | '24' | 'max';
}

export const DEFAULT_TESTING_FLAGS: UrlTestingFlags = {
  debug: false,
  cv: 'off', // Default OFF for immediate, zero-lag initialization
  delegate: 'gpu',
  res: '480', // C1: default to lightweight 640x480 for responsive execution
  overlay: 'on',
  fps: '12',
};

export interface DebugHudData {
  detectionTimeAvg: number;
  detectionTimeP95: number;
  drawTime: number;
  evaluateTime: number;
  loopFps: number;
  detectionFps: number;
  longTaskCount: number;
  jsHeapUsedMB: string;
  timeSinceLastLandmarkMs: number;
  delegate: 'GPU' | 'CPU';
  flags: UrlTestingFlags;
}

export interface PracticeSessionOptions {
  config?: SignConfig;
  onSuccess?: () => void;
  flags?: Partial<UrlTestingFlags>;
}

export function usePracticeSession(options: PracticeSessionOptions = {}) {
  // Store options in ref to keep references stable and prevent infinite re-render loops
  const optionsRef = useRef<PracticeSessionOptions>(options);
  optionsRef.current = options;

  const activeFlags: UrlTestingFlags = {
    ...DEFAULT_TESTING_FLAGS,
    ...(options.flags || {}),
  };
  const flagsRef = useRef<UrlTestingFlags>(activeFlags);
  flagsRef.current = activeFlags;

  const cfg = options.config || HELLO_CONFIG;
  const cfgRef = useRef<SignConfig>(cfg);
  cfgRef.current = cfg;

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<CameraError | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const [sessionState, setSessionState] = useState<SignState>('no-hand');
  const [checks, setChecks] = useState<Checks>({ handOpen: false, handRaised: false, movement: false });
  const [hint, setHint] = useState<string | null>('Show your hand to the camera');
  const [ariaMessage, setAriaMessage] = useState<string>('');

  const [isVerifying, setIsVerifying] = useState(false);
  const [isRecognized, setIsRecognized] = useState(false);
  const isRecognizedRef = useRef(false);

  // Performance & OpenCV state - defaults to flag settings
  const [fps, setFps] = useState<number>(0);
  const [openCvEnabled, setOpenCvEnabledState] = useState<boolean>(activeFlags.cv === 'on');
  const openCvEnabledRef = useRef<boolean>(activeFlags.cv === 'on');
  const [openCvAvailable, setOpenCvAvailable] = useState<boolean>(false);

  const loadCvInstance = useCallback(() => {
    loadOpenCV().then((cv) => {
      if (cv && isMountedRef.current) {
        cvRef.current = cv;
        setOpenCvAvailable(true);
      }
    });
  }, []);

  const setOpenCvEnabled = useCallback((enabled: boolean) => {
    openCvEnabledRef.current = enabled;
    setOpenCvEnabledState(enabled);
    if (enabled && !cvRef.current) {
      loadCvInstance();
    }
  }, [loadCvInstance]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const preprocessedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const cameraServiceRef = useRef<CameraService>(new CameraService());
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const cvRef = useRef<any | null>(null);

  const framesRef = useRef<TimedFrame[]>([]);
  const lastTimestampRef = useRef<number>(0);
  const lastProcessTimeRef = useRef<number>(0);
  const lastVideoTimeRef = useRef<number>(-1);
  const lastResultRef = useRef<HandLandmarkerResult | null>(null);
  const isDetectingRef = useRef<boolean>(false);

  const rafIdRef = useRef<number | null>(null);
  const isLoopRunningRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  const attemptTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Performance & Debug HUD Metrics Refs
  const detectionHistoryRef = useRef<number[]>([]);
  const drawTimeRef = useRef<number>(0);
  const evaluateTimeRef = useRef<number>(0);
  const loopCountRef = useRef<number>(0);
  const detectionCountRef = useRef<number>(0);
  const calculatedLoopFpsRef = useRef<number>(0);
  const calculatedDetectionFpsRef = useRef<number>(0);
  const lastFpsCalcTimeRef = useRef<number>(0);
  const lastLandmarkTimestampRef = useRef<number>(-1);
  const longTaskCountRef = useRef<number>(0);

  // Long Task PerformanceObserver
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'longtask') {
            longTaskCountRef.current++;
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
      return () => observer.disconnect();
    } catch {
      // Ignore unsupported browsers
    }
  }, []);

  // Helper to compile live debug data for the HUD
  const getDebugData = useCallback((): DebugHudData => {
    const samples = detectionHistoryRef.current;
    let avg = 0;
    let p95 = 0;
    if (samples.length > 0) {
      avg = Math.round((samples.reduce((a, b) => a + b, 0) / samples.length) * 10) / 10;
      const sorted = [...samples].sort((a, b) => a - b);
      const p95Idx = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95));
      p95 = Math.round(sorted[p95Idx] * 10) / 10;
    }

    const mem =
      typeof window !== 'undefined' && (performance as any)?.memory
        ? (performance as any).memory
        : null;
    const jsHeapUsedMB = mem
      ? (mem.usedJSHeapSize / (1024 * 1024)).toFixed(1) + ' MB'
      : 'N/A';

    const timeSinceLast =
      lastLandmarkTimestampRef.current > 0
        ? Math.round(performance.now() - lastLandmarkTimestampRef.current)
        : -1;

    return {
      detectionTimeAvg: avg,
      detectionTimeP95: p95,
      drawTime: Math.round(drawTimeRef.current * 10) / 10,
      evaluateTime: Math.round(evaluateTimeRef.current * 10) / 10,
      loopFps: calculatedLoopFpsRef.current,
      detectionFps: calculatedDetectionFpsRef.current,
      longTaskCount: longTaskCountRef.current,
      jsHeapUsedMB,
      timeSinceLastLandmarkMs: timeSinceLast,
      delegate: getActiveDelegate(),
      flags: flagsRef.current,
    };
  }, []);

  // C2: Batched, blur-free canvas overlay drawing
  const drawOverlay = useCallback((result: HandLandmarkerResult, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (
      !result.landmarks ||
      result.landmarks.length === 0 ||
      !result.landmarks[0] ||
      result.landmarks[0].length < 21
    ) {
      return;
    }

    const landmarks = result.landmarks[0];
    const w = canvas.width;
    const h = canvas.height;

    // MediaPipe Hand Connections (standard 21 landmarks)
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // index
      [5, 9], [9, 10], [10, 11], [11, 12], // middle
      [9, 13], [13, 14], [14, 15], [15, 16], // ring
      [13, 17], [17, 18], [18, 19], [19, 20], // pinky
      [0, 17], // palm base
    ];

    // C2: Batched flat neon cyan skeleton lines (single path stroke, ZERO shadowBlur)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    for (let i = 0; i < connections.length; i++) {
      const [start, end] = connections[i];
      const p1 = landmarks[start];
      const p2 = landmarks[end];
      ctx.moveTo(p1.x * w, p1.y * h);
      ctx.lineTo(p2.x * w, p2.y * h);
    }
    ctx.stroke();

    // C2: Batched lime green landmark joints (non-tips in single fill)
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    for (let i = 0; i < landmarks.length; i++) {
      if (i !== 4 && i !== 8 && i !== 12 && i !== 16 && i !== 20) {
        const p = landmarks[i];
        ctx.moveTo(p.x * w + 4, p.y * h);
        ctx.arc(p.x * w, p.y * h, 4, 0, 2 * Math.PI);
      }
    }
    ctx.fill();

    // C2: Batched finger tips in single fill
    ctx.fillStyle = '#a5ed6e';
    ctx.beginPath();
    for (const idx of [4, 8, 12, 16, 20]) {
      const p = landmarks[idx];
      ctx.moveTo(p.x * w + 6, p.y * h);
      ctx.arc(p.x * w, p.y * h, 6, 0, 2 * Math.PI);
    }
    ctx.fill();
  }, []);

  const tickRef = useRef<() => void>(() => {});

  // C3: Decoupled Frame Processing Loop
  const tick = useCallback(() => {
    if (!isMountedRef.current) return;

    loopCountRef.current++;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;
    const currentFlags = flagsRef.current;

    // 1. Draw cached overlay at full display rate (C3 decouple loops)
    if (canvas && currentFlags.overlay === 'on') {
      if (lastResultRef.current) {
        const tDraw0 = performance.now();
        drawOverlay(lastResultRef.current, canvas);
        drawTimeRef.current = performance.now() - tDraw0;
      }
    } else if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      drawTimeRef.current = 0;
    }

    // 2. Detection loop: run only when interval has elapsed, video has a new frame, and previous detection is not running
    const targetFps = currentFlags.fps === 'max' ? 0 : currentFlags.fps === '24' ? 24 : 12;
    const frameIntervalMs = targetFps === 0 ? 0 : 1000 / targetFps;

    // Ensure video is playing if ready
    if (video && video.paused && video.readyState >= 2 && !video.ended) {
      video.play().catch(() => {});
    }

    if (
      video &&
      canvas &&
      landmarker &&
      video.readyState >= 2 &&
      video.videoWidth > 0 &&
      video.videoHeight > 0
    ) {
      // Synchronize canvas buffer dimensions with intrinsic video size
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const now = performance.now();
      const hasElapsed = frameIntervalMs === 0 || now - lastProcessTimeRef.current >= frameIntervalMs;
      const isNewFrame = video.currentTime !== lastVideoTimeRef.current || now - lastProcessTimeRef.current >= 150;

      // Skip if previous detection is still executing or not yet due (never queue work)
      if (hasElapsed && isNewFrame && !isDetectingRef.current) {
        isDetectingRef.current = true;
        lastProcessTimeRef.current = now;
        lastVideoTimeRef.current = video.currentTime;
        detectionCountRef.current++;

        const timestamp = Math.max(Math.round(now), lastTimestampRef.current + 1);
        lastTimestampRef.current = timestamp;

        let sourceElement: CanvasImageSource = video;

        if (openCvEnabledRef.current && cvRef.current) {
          if (!offscreenCanvasRef.current) {
            offscreenCanvasRef.current = document.createElement('canvas');
          }
          if (!preprocessedCanvasRef.current) {
            preprocessedCanvasRef.current = document.createElement('canvas');
          }

          const offCanvas = offscreenCanvasRef.current;
          const dstCanvas = preprocessedCanvasRef.current;

          const targetWidth = 320;
          const targetHeight = Math.max(
            16,
            Math.round((video.videoHeight / video.videoWidth) * targetWidth)
          );

          if (offCanvas.width !== targetWidth || offCanvas.height !== targetHeight) {
            offCanvas.width = targetWidth;
            offCanvas.height = targetHeight;
            dstCanvas.width = targetWidth;
            dstCanvas.height = targetHeight;
          }

          const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
          if (offCtx) {
            offCtx.drawImage(video, 0, 0, targetWidth, targetHeight);
            const success = preprocessFrame(cvRef.current, offCanvas, dstCanvas);
            if (success) {
              sourceElement = dstCanvas;
            }
          }
        }

        try {
          const tDet0 = performance.now();
          const result = landmarker.detectForVideo(sourceElement, timestamp);
          const detTime = performance.now() - tDet0;

          // Update cached landmark result for display-rate overlay rendering
          lastResultRef.current = result;

          detectionHistoryRef.current.push(detTime);
          if (detectionHistoryRef.current.length > 60) {
            detectionHistoryRef.current.shift();
          }

          const lm = result.landmarks?.[0];
          if (lm && lm.length === 21) {
            framesRef.current.push({ t: timestamp, lm });
            lastLandmarkTimestampRef.current = performance.now();
          }

          // Drop frames outside windowMs + margin
          const activeCfg = cfgRef.current;
          const cutoff = timestamp - activeCfg.windowMs - 400;
          while (framesRef.current.length && framesRef.current[0].t < cutoff) {
            framesRef.current.shift();
          }

          // If not already recognized, evaluate landmarks
          if (!isRecognizedRef.current) {
            const tEval0 = performance.now();
            const evaluation: Evaluation = evaluate(framesRef.current, timestamp, activeCfg);
            evaluateTimeRef.current = performance.now() - tEval0;

            // Update checks with shallow equality comparison to prevent unneeded re-renders
            setChecks((prev) => {
              if (
                prev.handOpen === evaluation.checks.handOpen &&
                prev.handRaised === evaluation.checks.handRaised &&
                prev.movement === evaluation.checks.movement
              ) {
                return prev;
              }
              return evaluation.checks;
            });

            // Update hint only when changed
            setHint((prev) => (prev === evaluation.hint ? prev : evaluation.hint));

            if (evaluation.state === 'recognized') {
              isRecognizedRef.current = true;
              setIsRecognized(true);
              setSessionState('recognized');
              setAriaMessage('Sign Recognized! Congratulations.');
              if (optionsRef.current.onSuccess) {
                optionsRef.current.onSuccess();
              }
            } else {
              setSessionState((prev) => (prev === evaluation.state ? prev : evaluation.state));
            }
          }
        } catch (_detectErr) {
          lastResultRef.current = null;
        } finally {
          isDetectingRef.current = false;
        }

        // Calculate Loop and Detection FPS every 1000ms
        if (now - lastFpsCalcTimeRef.current >= 1000) {
          const delta = now - lastFpsCalcTimeRef.current;
          calculatedLoopFpsRef.current = Math.round((loopCountRef.current * 1000) / delta);
          calculatedDetectionFpsRef.current = Math.round((detectionCountRef.current * 1000) / delta);
          setFps(calculatedDetectionFpsRef.current);

          loopCountRef.current = 0;
          detectionCountRef.current = 0;
          lastFpsCalcTimeRef.current = now;
        }
      }
    }

    if (isLoopRunningRef.current) {
      rafIdRef.current = requestAnimationFrame(tickRef.current);
    }
  }, [drawOverlay]);

  tickRef.current = tick;

  // Start attempt window ("Check my sign")
  const startVerification = useCallback(() => {
    setIsVerifying(true);
    setIsRecognized(false);
    isRecognizedRef.current = false;
    framesRef.current = [];
    setSessionState('detecting');
    setAriaMessage('Gesture verification active. Perform the Hello sign.');

    if (attemptTimerRef.current) clearTimeout(attemptTimerRef.current);

    const activeCfg = cfgRef.current;
    attemptTimerRef.current = setTimeout(() => {
      setIsVerifying(false);
      setSessionState((prev) => {
        if (prev !== 'recognized') {
          setAriaMessage('Time reached. Try again.');
          return 'try-again';
        }
        return prev;
      });
    }, activeCfg.attemptTimeoutMs);

    if (!isLoopRunningRef.current) {
      isLoopRunningRef.current = true;
      lastProcessTimeRef.current = 0;
      lastFpsCalcTimeRef.current = performance.now();
      rafIdRef.current = requestAnimationFrame(tickRef.current);
    }
  }, []);

  // Reset practice studio
  const resetSession = useCallback(() => {
    if (attemptTimerRef.current) clearTimeout(attemptTimerRef.current);
    framesRef.current = [];
    isRecognizedRef.current = false;
    setIsVerifying(false);
    setIsRecognized(false);
    lastResultRef.current = null;
    setSessionState('no-hand');
    setChecks({ handOpen: false, handRaised: false, movement: false });
    setHint('Show your hand to the camera');
    setAriaMessage('Studio reset. Ready for your sign.');

    // Clear canvas overlay on reset
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    if (!isLoopRunningRef.current) {
      isLoopRunningRef.current = true;
      lastProcessTimeRef.current = 0;
      lastFpsCalcTimeRef.current = performance.now();
      rafIdRef.current = requestAnimationFrame(tickRef.current);
    }
  }, []);

  // Initialize camera and model
  const init = useCallback(async () => {
    if (!isMountedRef.current) return;

    const currentFlags = flagsRef.current;
    setCameraError(null);
    setModelError(null);

    // 1. Initialize camera with requested resolution (C1 default: 480)
    const cameraPromise = (async () => {
      let retries = 0;
      while (!videoRef.current && retries < 15 && isMountedRef.current) {
        await new Promise((r) => setTimeout(r, 40));
        retries++;
      }
      if (!videoRef.current || !isMountedRef.current) return;
      try {
        await cameraServiceRef.current.start(videoRef.current, currentFlags.res);
        if (!isMountedRef.current) return;
        setCameraReady(true);
        setCameraError(null);
      } catch (err: any) {
        if (!isMountedRef.current) return;
        if (err?.name === 'AbortError') return;
        console.error('Camera init error:', err);
        setCameraError(mapCameraError(err));
        setCameraReady(false);
      }
    })();

    // 2. Initialize MediaPipe HandLandmarker concurrently with requested delegate
    const modelPromise = (async () => {
      try {
        const preferredDelegate = currentFlags.delegate === 'cpu' ? 'CPU' : 'GPU';
        const landmarker = await getHandLandmarker(preferredDelegate);
        if (!isMountedRef.current) return;
        landmarkerRef.current = landmarker;
        setModelReady(true);
        setModelError(null);
      } catch (mErr) {
        if (!isMountedRef.current) return;
        console.error('Model init error:', mErr);
        setModelError('Failed to load the hand landmark model. Please check network/offline files and reload.');
        setModelReady(false);
      }
    })();

    // 3. Load OpenCV when enabled
    if (currentFlags.cv === 'on' || openCvEnabledRef.current) {
      loadCvInstance();
    }

    await Promise.allSettled([cameraPromise, modelPromise]);

    // Start frame loop if not already running
    if (!isLoopRunningRef.current && isMountedRef.current) {
      lastFpsCalcTimeRef.current = performance.now();
      isLoopRunningRef.current = true;
      rafIdRef.current = requestAnimationFrame(tickRef.current);
    }
  }, [loadCvInstance]);

  // Mount/unmount lifecycle: runs init once, tears down on unmount
  useEffect(() => {
    isMountedRef.current = true;
    init();

    const cameraService = cameraServiceRef.current;
    const video = videoRef.current;

    return () => {
      isMountedRef.current = false;
      isLoopRunningRef.current = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (attemptTimerRef.current) {
        clearTimeout(attemptTimerRef.current);
        attemptTimerRef.current = null;
      }
      cameraService.stop(video);
      closeHandLandmarker();
    };
  }, [init]);

  return {
    videoRef,
    canvasRef,
    cameraReady,
    cameraError,
    modelReady,
    modelError,
    sessionState,
    checks,
    hint,
    ariaMessage,
    isVerifying,
    isRecognized,
    fps,
    openCvEnabled,
    openCvAvailable,
    setOpenCvEnabled,
    startVerification,
    resetSession,
    retryCamera: init,
    getDebugData,
    flags: activeFlags,
  };
}
