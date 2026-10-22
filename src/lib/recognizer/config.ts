export type FingerName = 'index' | 'middle' | 'ring' | 'pinky';

export const FINGER_JOINTS: Record<FingerName, { tip: number; pip: number }> = {
  index: { tip: 8, pip: 6 },
  middle: { tip: 12, pip: 10 },
  ring: { tip: 16, pip: 14 },
  pinky: { tip: 20, pip: 18 },
};

export interface SignConfig {
  id: string;
  label: string;
  provisional: boolean; // true until validated by a qualified signer
  windowMs: number; // sliding evaluation window in ms
  minFramesInWindow: number; // minimum valid frames in window required to judge
  requiredExtended: FingerName[];
  extendedRatio: number; // tip-to-wrist must exceed pip-to-wrist * ratio
  raisedMaxWristY: number; // wrist.y must be <= this (0 = top of normalized frame)
  minTravel: number; // wrist travel in hand-size units
  minPoseRatio: number; // fraction of window frames where shape+position hold
  attemptTimeoutMs: number; // session timeout in ms before triggering 'try-again'
}

/**
 * PROVISIONAL starting values for ASL "Hello".
 * Tuned for desktop webcam framing.
 * All thresholds live here; no magic numbers elsewhere.
 */
export const HELLO_CONFIG: SignConfig = {
  id: 'hello',
  label: 'Hello',
  provisional: true,
  windowMs: 1500,
  minFramesInWindow: 8,
  requiredExtended: ['index', 'middle', 'ring', 'pinky'],
  extendedRatio: 1.1,
  raisedMaxWristY: 0.65,
  minTravel: 0.7,
  minPoseRatio: 0.65,
  attemptTimeoutMs: 10000,
};
