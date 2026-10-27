/**
 * OpenCV.js lazy preprocessing wrapper with safe runtime fallback and strict memory management.
 */
declare global {
  interface Window {
    cv?: any;
  }
}

let cvLoadingPromise: Promise<any | null> | null = null;
let cvLoaded = false;
let cvFailed = false;

/**
 * Lazily loads OpenCV.js from the local /opencv/opencv.js endpoint.
 * Returns null if loading fails or times out, allowing seamless fallback.
 */
export async function loadOpenCV(): Promise<any | null> {
  if (cvLoaded && typeof window !== 'undefined' && window.cv && window.cv.Mat) {
    return window.cv;
  }
  if (cvFailed) {
    return null;
  }
  if (typeof window === 'undefined') {
    return null;
  }

  if (!cvLoadingPromise) {
    cvLoadingPromise = new Promise((resolve) => {
      // 1. Check if already in window and initialized
      if (window.cv && window.cv.Mat) {
        cvLoaded = true;
        resolve(window.cv);
        return;
      }

      let isSettled = false;
      const finishSuccess = (cvObj: any) => {
        if (isSettled) return;
        isSettled = true;
        clearTimeout(timeoutId);
        cvLoaded = true;
        resolve(cvObj);
      };

      const finishFailure = (reason: string) => {
        if (isSettled) return;
        isSettled = true;
        clearTimeout(timeoutId);
        console.warn(`OpenCV.js notice: ${reason}. Continuing with raw video fallback.`);
        cvFailed = true;
        resolve(null);
      };

      const timeoutId = setTimeout(() => {
        finishFailure('Initialization timed out');
      }, 10000);

      const checkReady = (): boolean => {
        if (window.cv && window.cv.Mat) {
          finishSuccess(window.cv);
          return true;
        }
        return false;
      };

      // Check immediately
      if (checkReady()) return;

      // 2. Attach callbacks if window.cv already exists
      const attachListeners = () => {
        if (!window.cv) return;

        // Hook Emscripten onRuntimeInitialized
        const prevInit = window.cv.onRuntimeInitialized;
        window.cv.onRuntimeInitialized = () => {
          if (typeof prevInit === 'function') {
            try {
              prevInit();
            } catch {
              /* ignore */
            }
          }
          if (window.cv && window.cv.Mat) {
            finishSuccess(window.cv);
          }
        };

        // If window.cv is Promise-like
        if (typeof window.cv.then === 'function') {
          try {
            const ret = window.cv.then((readyCv: any) => {
              finishSuccess(readyCv || window.cv);
            });
            // Some Emscripten versions return custom objects without .catch
            if (ret && typeof ret.catch === 'function') {
              ret.catch((err: any) => {
                finishFailure(err?.message || 'Promise rejected');
              });
            }
          } catch (e: any) {
            console.warn('Error invoking cv.then:', e);
          }
        }
      };

      attachListeners();

      // 3. Inject script tag if not present
      let script = document.querySelector('script[src="/opencv/opencv.js"]') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.src = '/opencv/opencv.js';
        script.async = true;
        document.body.appendChild(script);
      }

      script.onload = () => {
        if (checkReady()) return;
        attachListeners();

        // Poll for Mat readiness in case callbacks are bypassed by build
        const pollInterval = setInterval(() => {
          if (checkReady()) {
            clearInterval(pollInterval);
          }
        }, 50);

        setTimeout(() => {
          clearInterval(pollInterval);
          if (!cvLoaded && !isSettled) {
            finishFailure('Mat not ready after script load');
          }
        }, 6000);
      };

      script.onerror = () => {
        finishFailure('Script download failed');
      };
    });
  }

  return cvLoadingPromise;
}

/**
 * Preprocesses a frame using OpenCV.js with brightness normalization.
 * Validates dimensions strictly to avoid any WebAssembly assertion crashes.
 * Every created cv.Mat is strictly deleted in a finally block to prevent memory leaks.
 */
export function preprocessFrame(
  cv: any,
  srcCanvas: HTMLCanvasElement,
  dstCanvas: HTMLCanvasElement
): boolean {
  if (!cv || !cv.imread || !cv.Mat || !cv.cvtColor) return false;
  if (!srcCanvas || srcCanvas.width < 16 || srcCanvas.height < 16) return false;
  if (!dstCanvas || dstCanvas.width < 16 || dstCanvas.height < 16) return false;

  let src: any = null;
  let dst: any = null;
  let gray: any = null;

  try {
    src = cv.imread(srcCanvas);
    if (!src || src.empty() || src.rows < 16 || src.cols < 16) {
      if (src) {
        try { src.delete(); } catch { /* ignore */ }
      }
      return false;
    }

    dst = new cv.Mat();
    gray = new cv.Mat();

    // Convert to grayscale to measure mean frame brightness
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    if (!gray || gray.empty()) return false;

    let meanBrightness = 128;
    if (typeof cv.mean === 'function') {
      try {
        const m = cv.mean(gray);
        if (Array.isArray(m) && typeof m[0] === 'number') {
          meanBrightness = m[0];
        } else if (m && typeof m.val !== 'undefined' && typeof m.val[0] === 'number') {
          meanBrightness = m.val[0];
        } else if (m && typeof m[0] === 'number') {
          meanBrightness = m[0];
        }
      } catch {
        meanBrightness = 128;
      }
    }

    if (isNaN(meanBrightness)) meanBrightness = 128;

    // Gentle auto-brightness adjustment
    const beta = Math.max(-40, Math.min(40, 110 - meanBrightness));

    if (typeof cv.convertScaleAbs === 'function') {
      cv.convertScaleAbs(src, dst, 1.0, beta);
    } else if (typeof src.convertTo === 'function') {
      src.convertTo(dst, -1, 1.0, beta);
    } else if (typeof src.copyTo === 'function') {
      src.copyTo(dst);
    } else {
      return false;
    }

    cv.imshow(dstCanvas, dst);
    return true;
  } catch (_err) {
    // Suppress per-frame console warning to prevent console flood
    return false;
  } finally {
    if (src) {
      try { src.delete(); } catch { /* ignore */ }
    }
    if (dst) {
      try { dst.delete(); } catch { /* ignore */ }
    }
    if (gray) {
      try { gray.delete(); } catch { /* ignore */ }
    }
  }
}
