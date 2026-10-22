import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

let instance: HandLandmarker | null = null;
let loadingPromise: Promise<HandLandmarker> | null = null;

export async function getHandLandmarker(): Promise<HandLandmarker> {
  if (instance) return instance;

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
        });

      try {
        instance = await create('GPU');
      } catch (gpuError) {
        console.warn('MediaPipe GPU delegate initialization failed, falling back to CPU:', gpuError);
        instance = await create('CPU');
      }

      return instance;
    })();
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
