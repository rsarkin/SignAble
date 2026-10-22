'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { getHandLandmarker, closeHandLandmarker } from '../vision/handLandmarker';
import { CameraService, mapCameraError, type CameraError } from '../vision/camera';
import { loadOpenCV, preprocessFrame } from '../vision/preprocess';
import { evaluate } from '../recognizer/evaluate';
import { HELLO_CONFIG, type SignConfig } from '../recognizer/config';
import type { Checks, Evaluation, SignState, TimedFrame } from '../recognizer/types';

export interface PracticeSessionOptions {
  config?: SignConfig;
  onSuccess?: () => void;
}

export function usePracticeSession(options: PracticeSessionOptions = {}) {
  const cfg = options.config || HELLO_CONFIG;

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

  // Performance & OpenCV state
  const [fps, setFps] = useState<number>(0);
  const [openCvEnabled, setOpenCvEnabled] = useState<boolean>(true);
  const [openCvAvailable, setOpenCvAvailable] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const preprocessedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const cameraServiceRef = useRef<CameraService>(new CameraService());
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const cvRef = useRef<any | null>(null);

  const framesRef = useRef<TimedFrame[]>([]);
  const lastVideoTimeRef = useRef<number>(-1);
  const lastTimestampRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  const attemptTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fpsFramesRef = useRef<{ count: number; lastTime: number }>({ count: 0, lastTime: 0 });

  // Draw landmarks and neon skeleton on canvas overlay
  const drawOverlay = useCallback((result: HandLandmarkerResult, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!result.landmarks || result.landmarks.length === 0) return;

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

    // Neon cyan skeleton lines
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(56, 189, 248, 0.7)';
    ctx.shadowBlur = 8;

    for (const [start, end] of connections) {
      const p1 = landmarks[start];
      const p2 = landmarks[end];
      ctx.beginPath();
      ctx.moveTo(p1.x * w, p1.y * h);
      ctx.lineTo(p2.x * w, p2.y * h);
      ctx.stroke();
    }

    // Lime green landmark joints
    ctx.shadowBlur = 0;
    for (let i = 0; i < landmarks.length; i++) {
      const p = landmarks[i];
      const isTip = [4, 8, 12, 16, 20].includes(i);
      ctx.fillStyle = isTip ? '#a5ed6e' : '#4ade80';
      ctx.strokeStyle = '#065f46';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, isTip ? 6.5 : 4.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  }, []);

  // Frame processing loop
  const tick = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;

    if (video && canvas && landmarker && video.readyState >= 2) {
      // Synchronize canvas buffer dimensions with intrinsic video size
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
      }

      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;

        let now = performance.now();
        // Ensure strictly increasing timestamp
        if (now <= lastTimestampRef.current) {
          now = lastTimestampRef.current + 1;
        }
        lastTimestampRef.current = now;

        // Choose input source: preprocessed canvas or raw video
        let sourceElement: CanvasImageSource = video;

        if (openCvEnabled && cvRef.current) {
          if (!offscreenCanvasRef.current) {
            offscreenCanvasRef.current = document.createElement('canvas');
          }
          if (!preprocessedCanvasRef.current) {
            preprocessedCanvasRef.current = document.createElement('canvas');
          }

          const offCanvas = offscreenCanvasRef.current;
          const dstCanvas = preprocessedCanvasRef.current;

          const targetWidth = 640;
          const targetHeight = Math.round((video.videoHeight / (video.videoWidth || 1)) * targetWidth) || 480;

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

        // Run hand landmark detection in VIDEO mode
        try {
          const result = landmarker.detectForVideo(sourceElement, now);
          drawOverlay(result, canvas);

          const lm = result.landmarks?.[0];
          if (lm && lm.length === 21) {
            framesRef.current.push({ t: now, lm });
          }

          // Drop frames outside windowMs + margin
          const cutoff = now - cfg.windowMs - 400;
          while (framesRef.current.length && framesRef.current[0].t < cutoff) {
            framesRef.current.shift();
          }

          // Evaluate landmarks
          const evaluation: Evaluation = evaluate(framesRef.current, now, cfg);

          // Update checks & hint
          setChecks(evaluation.checks);
          setHint(evaluation.hint);

          if (evaluation.state === 'recognized') {
            setIsRecognized(true);
            setSessionState('recognized');
            setAriaMessage('Sign Recognized! Congratulations.');
            if (options.onSuccess) options.onSuccess();
          } else if (!isRecognized) {
            setSessionState(evaluation.state);
          }
        } catch (detectErr) {
          console.warn('detectForVideo warning:', detectErr);
        }

        // FPS meter
        const fpsData = fpsFramesRef.current;
        fpsData.count++;
        if (now - fpsData.lastTime >= 1000) {
          setFps(Math.round((fpsData.count * 1000) / (now - fpsData.lastTime)));
          fpsData.count = 0;
          fpsData.lastTime = now;
        }
      }
    }

    rafIdRef.current = requestAnimationFrame(tick);
  }, [cfg, drawOverlay, isRecognized, openCvEnabled, options]);

  // Start attempt window ("Check my sign")
  const startVerification = useCallback(() => {
    setIsVerifying(true);
    setIsRecognized(false);
    framesRef.current = [];
    setSessionState('detecting');
    setAriaMessage('Gesture verification active. Perform the Hello sign.');

    if (attemptTimerRef.current) clearTimeout(attemptTimerRef.current);

    attemptTimerRef.current = setTimeout(() => {
      setIsVerifying(false);
      setSessionState((prev) => {
        if (prev !== 'recognized') {
          setAriaMessage('Time reached. Try again.');
          return 'try-again';
        }
        return prev;
      });
    }, cfg.attemptTimeoutMs);
  }, [cfg.attemptTimeoutMs]);

  // Reset practice studio
  const resetSession = useCallback(() => {
    if (attemptTimerRef.current) clearTimeout(attemptTimerRef.current);
    framesRef.current = [];
    setIsVerifying(false);
    setIsRecognized(false);
    setSessionState('no-hand');
    setChecks({ handOpen: false, handRaised: false, movement: false });
    setHint('Show your hand to the camera');
    setAriaMessage('Studio reset. Ready for your sign.');
  }, []);

  // Initialize camera and model
  const init = useCallback(async () => {
    setCameraError(null);
    setModelError(null);

    // 1. Initialize camera
    if (videoRef.current) {
      try {
        await cameraServiceRef.current.start(videoRef.current);
        setCameraReady(true);
      } catch (err) {
        console.error('Camera init error:', err);
        setCameraError(mapCameraError(err));
        setCameraReady(false);
        return;
      }
    }

    // 2. Initialize MediaPipe HandLandmarker
    try {
      const landmarker = await getHandLandmarker();
      landmarkerRef.current = landmarker;
      setModelReady(true);
    } catch (mErr) {
      console.error('Model init error:', mErr);
      setModelError('Failed to load the hand landmark model. Please check network/offline files and reload.');
      setModelReady(false);
      return;
    }

    // 3. Lazily load OpenCV.js in background (non-blocking)
    loadOpenCV().then((cv) => {
      if (cv) {
        cvRef.current = cv;
        setOpenCvAvailable(true);
      }
    });

    // Start frame loop
    fpsFramesRef.current.lastTime = performance.now();
    rafIdRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // Cleanup on unmount or route exit
  useEffect(() => {
    init();

    const cameraService = cameraServiceRef.current;
    const video = videoRef.current;

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (attemptTimerRef.current) clearTimeout(attemptTimerRef.current);
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
  };
}
