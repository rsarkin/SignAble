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
  private pendingStart: Promise<MediaStream> | null = null;
  private cancelled = false;
  private activeVideoElement: HTMLVideoElement | null = null;

  async start(
    videoElement: HTMLVideoElement,
    resolution: '360' | '480' | '720' = '480'
  ): Promise<MediaStream> {
    this.activeVideoElement = videoElement;
    this.cancelled = false;

    // Fast-path: If an existing stream is already active and healthy, reuse it immediately
    if (this.stream && this.isActive()) {
      await this.attachToVideo(videoElement, this.stream);
      return this.stream;
    }

    // If getUserMedia is already in flight, await it and attach to current videoElement
    if (this.pendingStart) {
      const stream = await this.pendingStart;
      if (!this.cancelled && this.activeVideoElement) {
        await this.attachToVideo(this.activeVideoElement, stream);
      }
      return stream;
    }

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      throw { name: 'UnsupportedError', message: 'Camera API not supported in this environment' };
    }

    const videoDimensions =
      resolution === '360'
        ? { width: { ideal: 640 }, height: { ideal: 360 } }
        : resolution === '480'
        ? { width: { ideal: 640 }, height: { ideal: 480 } }
        : { width: { ideal: 1280 }, height: { ideal: 720 } };

    this.pendingStart = (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            ...videoDimensions,
          },
          audio: false, // Never request audio
        });

        // If stopped/cancelled while getUserMedia was acquiring the device, terminate tracks immediately
        if (this.cancelled) {
          stream.getTracks().forEach((track) => {
            try {
              track.stop();
            } catch {
              /* ignore */
            }
          });
          throw { name: 'AbortError', message: 'Camera start cancelled' };
        }

        this.stream = stream;

        if (this.activeVideoElement) {
          await this.attachToVideo(this.activeVideoElement, stream);
        }

        return stream;
      } finally {
        this.pendingStart = null;
      }
    })();

    return this.pendingStart;
  }

  private async attachToVideo(videoElement: HTMLVideoElement, stream: MediaStream): Promise<void> {
    videoElement.muted = true;
    videoElement.defaultMuted = true;
    videoElement.playsInline = true;
    videoElement.setAttribute('muted', '');
    videoElement.setAttribute('playsinline', '');
    videoElement.setAttribute('autoplay', '');

    if (videoElement.srcObject !== stream) {
      videoElement.srcObject = stream;
    }

    try {
      await videoElement.play();
    } catch (e: any) {
      videoElement.muted = true;
      try {
        await videoElement.play();
      } catch (err) {
        console.warn('Video play was prevented:', err);
      }
    }

    if (videoElement.readyState < 2) {
      await new Promise<void>((resolve) => {
        let timeoutId: any;
        const onReady = () => {
          clearTimeout(timeoutId);
          videoElement.removeEventListener('loadeddata', onReady);
          videoElement.removeEventListener('canplay', onReady);
          videoElement.removeEventListener('playing', onReady);
          resolve();
        };
        videoElement.addEventListener('loadeddata', onReady, { once: true });
        videoElement.addEventListener('canplay', onReady, { once: true });
        videoElement.addEventListener('playing', onReady, { once: true });
        timeoutId = setTimeout(onReady, 1200);
      });
    }

    // Final sanity check: if video paused after loadeddata, restart playback
    if (videoElement.paused && videoElement.readyState >= 2) {
      try {
        await videoElement.play();
      } catch {
        /* ignore */
      }
    }
  }

  stop(videoElement?: HTMLVideoElement | null): void {
    this.cancelled = true;
    this.activeVideoElement = null;

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
        if (videoElement.srcObject instanceof MediaStream) {
          videoElement.srcObject.getTracks().forEach((track) => {
            try {
              track.stop();
            } catch {
              /* ignore */
            }
          });
        }
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

