export type Landmark = { x: number; y: number; z: number };

export type TimedFrame = {
  t: number; // ms timestamp from performance.now()
  lm: Landmark[]; // exactly 21 hand landmarks
};

export type SignState = 'no-hand' | 'detecting' | 'almost' | 'recognized' | 'try-again';

export type Checks = {
  handOpen: boolean;
  handRaised: boolean;
  movement: boolean;
};

export type Evaluation = {
  state: Exclude<SignState, 'try-again'>; // try-again is handled at the session timer level
  checks: Checks;
  hint: string | null;
  metrics?: {
    avgSize: number;
    travel: number;
    poseRatio: number;
    wristY: number;
  };
};
