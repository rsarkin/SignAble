import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

let instance: HandLandmarker | null = null;
let currentDelegate: 'GPU' | 'CPU' = 'GPU';
let loadingPromise: Promise<HandLandmarker> | null = null;

export function getActiveDelegate(): 'GPU' | 'CPU' {
  return currentDelegate;
}

export async function getHandLandmarker(preferredDelegate: 'GPU' | 'CPU' = 'GPU'): Promise<HandLandmarker> {
  if (instance && currentDelegate === preferredDelegate) return instance;
  if (instance && currentDelegate !== preferredDelegate) {
    closeHandLandmarker();
  }

  if (!loadingPromise) {
    loadingPromise = (async () => {
      // Local WASM folder copied to /public/mediapipe/wasm
      const vision = await FilesetResolver.forVisionTasks('/mediapipe/wasm');

      const create = (delegate: 'GPU' | 'CPU') =>
        HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: '/models/hand_landmarker.task',
            delegate,
          },
          runningMode: 'VIDEO',
          numHands: 1,
          minHandDetectionConfidence: 0.35,
          minHandPresenceConfidence: 0.35,
          minTrackingConfidence: 0.35,
        });

      let landmarker: HandLandmarker;
      if (preferredDelegate === 'CPU') {
        landmarker = await create('CPU');
        currentDelegate = 'CPU';
      } else {
        try {
          landmarker = await create('GPU');
          currentDelegate = 'GPU';
        } catch (gpuError) {
          console.warn('MediaPipe GPU delegate initialization failed, falling back to CPU:', gpuError);
          try {
            landmarker = await create('CPU');
            currentDelegate = 'CPU';
          } catch (cpuError) {
            loadingPromise = null;
            throw cpuError;
          }
        }
      }

      instance = landmarker;
      return instance;
    })().catch((err) => {
      loadingPromise = null;
      throw err;
    });
  }

  return loadingPromise;
}

export function closeHandLandmarker(): void {
  if (instance) {
    try {
      instance.close();
    } catch (e) {
      console.warn('Error closing HandLandmarker instance:', e);
    }
    instance = null;
  }
  loadingPromise = null;
}
