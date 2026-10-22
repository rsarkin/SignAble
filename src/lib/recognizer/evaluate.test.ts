import { describe, it, expect } from 'vitest';
import { evaluate } from './evaluate';
import { HELLO_CONFIG } from './config';
import type { Landmark, TimedFrame } from './types';

/**
 * Helper to build a synthetic 21-landmark hand.
 *
 * @param wristX Wrist X coordinate (0-1)
 * @param wristY Wrist Y coordinate (0-1)
 * @param open Whether fingers are extended
 * @param scale Hand size scale multiplier (1.0 = standard ~0.2)
 */
function createHand(
  wristX = 0.5,
  wristY = 0.4,
  open = true,
  scale = 1.0
): Landmark[] {
  const lm: Landmark[] = new Array(21);
  const baseSize = 0.2 * scale;

  // 0: Wrist
  lm[0] = { x: wristX, y: wristY, z: 0 };

  // 1-4: Thumb
  lm[1] = { x: wristX - 0.05 * scale, y: wristY - 0.05 * scale, z: 0 };
  lm[2] = { x: wristX - 0.08 * scale, y: wristY - 0.08 * scale, z: 0 };
  lm[3] = { x: wristX - 0.11 * scale, y: wristY - 0.11 * scale, z: 0 };
  lm[4] = { x: wristX - 0.14 * scale, y: wristY - 0.14 * scale, z: 0 };

  // 5-8: Index
  lm[5] = { x: wristX - 0.03 * scale, y: wristY - baseSize * 0.5, z: 0 };
  lm[6] = { x: wristX - 0.03 * scale, y: wristY - baseSize * 0.7, z: 0 }; // PIP
  lm[7] = { x: wristX - 0.03 * scale, y: wristY - baseSize * 0.9, z: 0 };
  lm[8] = open
    ? { x: wristX - 0.03 * scale, y: wristY - baseSize * 1.3, z: 0 } // extended tip
    : { x: wristX - 0.03 * scale, y: wristY - baseSize * 0.55, z: 0 }; // curled tip

  // 9-12: Middle
  lm[9] = { x: wristX, y: wristY - baseSize, z: 0 }; // MCP (handSize anchor)
  lm[10] = { x: wristX, y: wristY - baseSize * 1.2, z: 0 }; // PIP
  lm[11] = { x: wristX, y: wristY - baseSize * 1.4, z: 0 };
  lm[12] = open
    ? { x: wristX, y: wristY - baseSize * 1.7, z: 0 }
    : { x: wristX, y: wristY - baseSize * 0.6, z: 0 };

  // 13-16: Ring
  lm[13] = { x: wristX + 0.03 * scale, y: wristY - baseSize * 0.9, z: 0 };
  lm[14] = { x: wristX + 0.03 * scale, y: wristY - baseSize * 1.1, z: 0 }; // PIP
  lm[15] = { x: wristX + 0.03 * scale, y: wristY - baseSize * 1.3, z: 0 };
  lm[16] = open
    ? { x: wristX + 0.03 * scale, y: wristY - baseSize * 1.6, z: 0 }
    : { x: wristX + 0.03 * scale, y: wristY - baseSize * 0.6, z: 0 };

  // 17-20: Pinky
  lm[17] = { x: wristX + 0.06 * scale, y: wristY - baseSize * 0.7, z: 0 };
  lm[18] = { x: wristX + 0.06 * scale, y: wristY - baseSize * 0.9, z: 0 }; // PIP
  lm[19] = { x: wristX + 0.06 * scale, y: wristY - baseSize * 1.1, z: 0 };
  lm[20] = open
    ? { x: wristX + 0.06 * scale, y: wristY - baseSize * 1.4, z: 0 }
    : { x: wristX + 0.06 * scale, y: wristY - baseSize * 0.55, z: 0 };

  return lm;
}

/**
 * Generate a sequence of N timed frames simulating wrist motion from startX to endX.
 */
function createTrajectory(
  count = 12,
  startX = 0.4,
  endX = 0.6,
  y = 0.4,
  open = true,
  scale = 1.0,
  windowOffset = 1000
): TimedFrame[] {
  const frames: TimedFrame[] = [];
  const baseTime = 10000;
  for (let i = 0; i < count; i++) {
    const fraction = i / (count - 1);
    const x = startX + (endX - startX) * fraction;
    const t = baseTime - windowOffset + (windowOffset * fraction);
    frames.push({
      t,
      lm: createHand(x, y, open, scale),
    });
  }
  return frames;
}

describe('lib/recognizer/evaluate (ASL Hello Rule-based Evaluator)', () => {
  const now = 10000;

  it('1. Recognizes an open, raised hand moving sufficiently across the window', () => {
    // Distance from x=0.35 to x=0.55 is 0.20. Standard handSize is 0.20, so travel = 1.0 >= 0.7
    const frames = createTrajectory(12, 0.35, 0.55, 0.4, true, 1.0, 1200);
    const result = evaluate(frames, now, HELLO_CONFIG);

    expect(result.checks.handOpen).toBe(true);
    expect(result.checks.handRaised).toBe(true);
    expect(result.checks.movement).toBe(true);
    expect(result.state).toBe('recognized');
    expect(result.hint).toBeNull();
  });

  it('2. Rejects stationary open hand (movement false with hint about moving)', () => {
    // Barely moves (0.45 to 0.455)
    const frames = createTrajectory(12, 0.45, 0.455, 0.4, true, 1.0, 1200);
    const result = evaluate(frames, now, HELLO_CONFIG);

    expect(result.checks.handOpen).toBe(true);
    expect(result.checks.handRaised).toBe(true);
    expect(result.checks.movement).toBe(false);
    expect(result.state).not.toBe('recognized');
    expect(result.hint).toContain('Move your hand');
  });

  it('3. Rejects closed fist with fingers curled inward', () => {
    const frames = createTrajectory(12, 0.35, 0.55, 0.4, false, 1.0, 1200);
    const result = evaluate(frames, now, HELLO_CONFIG);

    expect(result.checks.handOpen).toBe(false);
    expect(result.state).not.toBe('recognized');
    expect(result.hint).toContain('Open your hand');
  });

  it('4. Rejects hand low in the frame (wrist.y > raisedMaxWristY)', () => {
    // wrist at y=0.85 (lower frame)
    const frames = createTrajectory(12, 0.35, 0.55, 0.85, true, 1.0, 1200);
    const result = evaluate(frames, now, HELLO_CONFIG);

    expect(result.checks.handRaised).toBe(false);
    expect(result.state).not.toBe('recognized');
    expect(result.hint).toContain('Raise your hand');
  });

  it('5. Returns "no-hand" when no frames exist in the window', () => {
    const result = evaluate([], now, HELLO_CONFIG);
    expect(result.state).toBe('no-hand');
    expect(result.hint).toContain('Show your hand');
  });

  it('6. Returns "detecting" when fewer than minFramesInWindow exist', () => {
    const frames = createTrajectory(3, 0.4, 0.5, 0.4, true, 1.0, 500); // 3 frames < 8 minFrames
    const result = evaluate(frames, now, HELLO_CONFIG);
    expect(result.state).toBe('detecting');
  });

  it('7. Ignores frames older than windowMs', () => {
    // Frames occurred 3000ms ago, outside 1500ms window
    const oldFrames: TimedFrame[] = [
      { t: now - 3000, lm: createHand(0.4, 0.4, true) },
      { t: now - 2800, lm: createHand(0.5, 0.4, true) },
    ];
    const result = evaluate(oldFrames, now, HELLO_CONFIG);
    expect(result.state).toBe('no-hand');
  });

  it('8. Hand-size normalization yields consistent travel across near vs far hands', () => {
    // Hand near (scale 1.5, larger handSize) vs hand far (scale 0.75, smaller handSize)
    // Both move a physical distance proportional to their hand size (1.0x hand size)
    const nearHandSize = 0.2 * 1.5;
    const farHandSize = 0.2 * 0.75;

    const nearFrames = createTrajectory(12, 0.3, 0.3 + nearHandSize * 0.9, 0.4, true, 1.5, 1000);
    const farFrames = createTrajectory(12, 0.3, 0.3 + farHandSize * 0.9, 0.4, true, 0.75, 1000);

    const nearResult = evaluate(nearFrames, now, HELLO_CONFIG);
    const farResult = evaluate(farFrames, now, HELLO_CONFIG);

    expect(nearResult.checks.movement).toBe(true);
    expect(farResult.checks.movement).toBe(true);
    // Relative travel should be virtually identical
    expect(Math.abs((nearResult.metrics?.travel ?? 0) - (farResult.metrics?.travel ?? 0))).toBeLessThan(0.1);
  });

  it('9. Classifies state as "almost" when 2 of 3 checks pass', () => {
    // Hand is open and raised, but not moving (2 of 3)
    const frames = createTrajectory(12, 0.5, 0.505, 0.4, true, 1.0, 1200);
    const result = evaluate(frames, now, HELLO_CONFIG);

    expect(result.checks.handOpen).toBe(true);
    expect(result.checks.handRaised).toBe(true);
    expect(result.checks.movement).toBe(false);
    expect(result.state).toBe('almost');
  });
});
