import { FINGER_JOINTS, type SignConfig } from './config';
import type { Checks, Evaluation, Landmark, TimedFrame } from './types';

export const dist = (a: Landmark, b: Landmark): number => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * Hand size reference: distance from wrist (landmark 0) to middle-finger MCP joint (landmark 9).
 * Normalizes all travel and displacement distances relative to hand scale on camera.
 */
export const handSize = (lm: Landmark[]): number => dist(lm[0], lm[9]) || 1e-6;

/**
 * Orientation-independent finger extension check:
 * A finger is considered extended if its tip is farther from the wrist than its PIP joint by the configured ratio.
 */
export const isExtended = (lm: Landmark[], tip: number, pip: number, ratio: number): boolean =>
  dist(lm[0], lm[tip]) > dist(lm[0], lm[pip]) * ratio;

const NONE_CHECKS: Checks = { handOpen: false, handRaised: false, movement: false };

export function evaluate(frames: TimedFrame[], now: number, cfg: SignConfig): Evaluation {
  const win = frames.filter((f) => now - f.t <= cfg.windowMs && f.lm && f.lm.length === 21);

  if (win.length === 0) {
    return {
      state: 'no-hand',
      checks: NONE_CHECKS,
      hint: 'Show your hand to the camera',
    };
  }

  if (win.length < cfg.minFramesInWindow) {
    return {
      state: 'detecting',
      checks: NONE_CHECKS,
      hint: null,
    };
  }

  // 1. Hand shape (open hand per frame)
  const openPerFrame = win.map((f) =>
    cfg.requiredExtended.every((name) => {
      const { tip, pip } = FINGER_JOINTS[name];
      return isExtended(f.lm, tip, pip, cfg.extendedRatio);
    })
  );

  // 2. Hand position (wrist raised in frame)
  const raisedPerFrame = win.map((f) => f.lm[0].y <= cfg.raisedMaxWristY);

  // Most recent frame status
  const latestFrame = win[win.length - 1];
  const handOpen = openPerFrame[openPerFrame.length - 1];
  const handRaised = raisedPerFrame[raisedPerFrame.length - 1];

  // Fraction of frames in the window where both shape and position hold
  const poseFrames = win.filter((_, i) => openPerFrame[i] && raisedPerFrame[i]).length;
  const poseRatio = poseFrames / win.length;

  // 3. Movement calculation normalized by average hand size
  const xs = win.map((f) => f.lm[0].x);
  const ys = win.map((f) => f.lm[0].y);
  const avgSize = win.reduce((sum, f) => sum + handSize(f.lm), 0) / win.length;
  const travel = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / avgSize;
  const movement = travel >= cfg.minTravel;

  const checks: Checks = { handOpen, handRaised, movement };
  const recognized = poseRatio >= cfg.minPoseRatio && movement;
  const passedCount = Object.values(checks).filter(Boolean).length;

  let hint: string | null = null;
  if (!recognized) {
    if (!handOpen) {
      hint = 'Open your hand with fingers straight';
    } else if (!handRaised) {
      hint = 'Raise your hand a little higher';
    } else if (!movement) {
      hint = 'Move your hand smoothly outward';
    }
  }

  return {
    state: recognized ? 'recognized' : passedCount >= 2 ? 'almost' : 'detecting',
    checks,
    hint,
    metrics: {
      avgSize,
      travel,
      poseRatio,
      wristY: latestFrame.lm[0].y,
    },
  };
}
