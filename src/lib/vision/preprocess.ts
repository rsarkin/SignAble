/**
 * OpenCV.js lazy preprocessing wrapper with safe runtime fallback and strict memory management.
 */
declare global {
  interface Window {
    cv?: any;
  }
}

let cvLoadingPromise: Promise<any> | null = null;
let cvLoaded = false;
let cvFailed = false;

/**
 * Lazily loads OpenCV.js from the local /opencv/opencv.js endpoint.
 * Returns null if loading fails or times out, allowing seamless fallback.
 */
export async function loadOpenCV(): Promise<any | null> {
  if (cvLoaded && typeof window !== 'undefined' && window.cv) {
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
      // Check if already in window
      if (window.cv && window.cv.Mat) {
        cvLoaded = true;
        resolve(window.cv);
        return;
      }

      const script = document.createElement('script');
      script.src = '/opencv/opencv.js';
      script.async = true;

      const timeout = setTimeout(() => {
        console.warn('OpenCV.js script load timed out. Continuing with raw video fallback.');
        cvFailed = true;
        resolve(null);
      }, 6000);

      script.onload = () => {
        clearTimeout(timeout);
        // OpenCV.js emits onRuntimeInitialized when WASM/ASM is ready
        if (window.cv && typeof window.cv.then === 'function') {
          window.cv.then((readyCv: any) => {
            cvLoaded = true;
            resolve(readyCv);
          }).catch((err: any) => {
            console.warn('OpenCV runtime initialization rejected:', err);
            cvFailed = true;
            resolve(null);
          });
        } else if (window.cv && window.cv.Mat) {
          cvLoaded = true;
          resolve(window.cv);
        } else {
          // Poll for onRuntimeInitialized if defined
          const checkReady = setInterval(() => {
            if (window.cv && window.cv.Mat) {
              clearInterval(checkReady);
              cvLoaded = true;
              resolve(window.cv);
            }
          }, 50);

          setTimeout(() => {
            clearInterval(checkReady);
            if (!cvLoaded) {
              console.warn('OpenCV.js did not initialize in time. Using fallback.');
              cvFailed = true;
              resolve(null);
            }
          }, 3000);
        }
      };

      script.onerror = () => {
        clearTimeout(timeout);
        console.warn('Failed to load opencv.js script. Continuing with raw video fallback.');
        cvFailed = true;
        resolve(null);
      };

      document.body.appendChild(script);
    });
  }

  return cvLoadingPromise;
}

/**
 * Preprocesses a frame using OpenCV.js with brightness normalization.
 * Every created cv.Mat is strictly deleted in a finally block to avoid memory leaks.
 */
export function preprocessFrame(
  cv: any,
  srcCanvas: HTMLCanvasElement,
  dstCanvas: HTMLCanvasElement
): boolean {
  if (!cv || !cv.imread || !cv.Mat) return false;

  let src: any = null;
  let dst: any = null;
  let gray: any = null;

  try {
    src = cv.imread(srcCanvas);
    dst = new cv.Mat();
    gray = new cv.Mat();

    // Convert to grayscale to measure mean frame brightness
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    const meanBrightness = cv.mean(gray)[0];

    // Gentle auto-brightness adjustment
    const beta = Math.max(-40, Math.min(40, 110 - meanBrightness));
    cv.convertScaleAbs(src, dst, 1.0, beta);

    cv.imshow(dstCanvas, dst);
    return true;
  } catch (err) {
    console.warn('OpenCV frame preprocessing error, falling back:', err);
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
