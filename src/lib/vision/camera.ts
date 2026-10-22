export type CameraErrorType = 'denied' | 'not-found' | 'busy' | 'unsupported' | 'unknown';

export interface CameraError {
  type: CameraErrorType;
  title: string;
  message: string;
  actionHint: string;
}

export function mapCameraError(error: unknown): CameraError {
  if (typeof error === 'object' && error !== null) {
    const err = error as { name?: string; message?: string };
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      return {
        type: 'denied',
        title: 'Camera Access Needed',
        message: 'Camera permission was not granted.',
        actionHint: 'Please click the camera icon in your browser address bar, allow access, and click Retry.',
      };
    }
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      return {
        type: 'not-found',
        title: 'No Camera Detected',
        message: 'No video input device could be found on your computer.',
        actionHint: 'Please connect a webcam or enable your camera device, then click Retry.',
      };
    }
    if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      return {
        type: 'busy',
        title: 'Camera In Use',
        message: 'The webcam is currently being used by another application.',
        actionHint: 'Please close Zoom, Teams, Meet, or any other camera app and click Retry.',
      };
    }
  }

  return {
    type: 'unknown',
    title: 'Camera Unavailable',
    message: 'Could not access the camera.',
    actionHint: 'Please check your browser permissions, reload the page, or verify HTTPS/localhost is active.',
  };
}

export class CameraService {
  private stream: MediaStream | null = null;

  async start(videoElement: HTMLVideoElement): Promise<MediaStream> {
    this.stop(videoElement);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      throw { name: 'UnsupportedError', message: 'Camera API not supported in this environment' };
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false, // Never request audio
    });

    this.stream = stream;
    videoElement.srcObject = stream;

    await new Promise<void>((resolve) => {
      if (videoElement.readyState >= 2) {
        resolve();
      } else {
        videoElement.onloadeddata = () => resolve();
      }
    });

    try {
      await videoElement.play();
    } catch (e) {
      console.warn('Video play was prevented:', e);
    }

    return stream;
  }

  stop(videoElement?: HTMLVideoElement | null): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping track:', e);
        }
      });
      this.stream = null;
    }

    if (videoElement) {
      try {
        videoElement.pause();
        videoElement.srcObject = null;
      } catch (e) {
        console.warn('Error clearing video srcObject:', e);
      }
    }
  }

  isActive(): boolean {
    return !!this.stream && this.stream.getVideoTracks().some((t) => t.readyState === 'live');
  }
}
