# IMPLEMENTATION.md — SignAble prototype technical spec

Read `AGENTS.md` and `PRD.md` first. This file explains **how** to build. Code below is a reference implementation: verify every library call against the installed version's types/docs before relying on it, and report any differences.

---

## 1. Architecture at a glance

```
Browser only (no backend)

Webcam → <video> ──► offscreen canvas (resize)
                        │
                        ▼
              OpenCV.js preprocess (optional, lazy)
                        │
                        ▼
        MediaPipe HandLandmarker.detectForVideo (VIDEO mode)
                        │  21 landmarks (normalized x, y, z)
                        ▼
        Frame buffer (last ~1.5 s, timestamped)
                        │
                        ▼
        Rule-based evaluator (pure TS, config-driven)
                        │  { state, checks, hint }
                        ▼
        Practice session state machine ──► Screen 4 UI feedback
                                         └► on `recognized` → enable path to Screen 5
```

## 2. Project structure

```
signable/
├─ public/
│  ├─ models/hand_landmarker.task        # downloaded once, served locally
│  ├─ mediapipe/wasm/…                   # copied from @mediapipe/tasks-vision/wasm
│  ├─ opencv/opencv.js                   # only if self-hosting OpenCV.js
│  └─ media/hello-reference.*            # reference video (see Open Decisions) or placeholder
├─ src/
│  ├─ app/                               # Next.js routes: one route per screen
│  │   ├─ page.tsx                       # Screen 1 Learning Path
│  │   ├─ lesson/hello/intro/page.tsx    # Screen 2
│  │   ├─ lesson/hello/watch/page.tsx    # Screen 3
│  │   ├─ lesson/hello/practice/page.tsx # Screen 4
│  │   └─ lesson/hello/complete/page.tsx # Screen 5
│  ├─ components/                        # ported from Stitch screens
│  ├─ lib/
│  │   ├─ recognizer/                    # PURE TS, no React/DOM
│  │   │   ├─ types.ts
│  │   │   ├─ config.ts                  # sign definition + thresholds
│  │   │   ├─ evaluate.ts
│  │   │   └─ evaluate.test.ts
│  │   ├─ vision/
│  │   │   ├─ handLandmarker.ts          # model singleton
│  │   │   ├─ camera.ts                  # getUserMedia + cleanup
│  │   │   └─ preprocess.ts              # OpenCV.js wrapper (optional)
│  │   └─ session/usePracticeSession.ts  # state machine hook
│  └─ styles/                            # tokens from design
├─ CHANGELOG.md
└─ README.md
```

Routes are suggestions: the screens, order, and navigation must match the PRD; route names may differ.

## 3. Setup

```bash
npx create-next-app@latest signable --ts --tailwind --app --eslint
cd signable
npm install @mediapipe/tasks-vision@<PINNED_VERSION>
npm install -D vitest
# OpenCV.js: choose ONE and pin it (see section 7)
```

Rules: pin exact versions in `package.json`; look up the current stable versions at install time; do not use `latest`.

Copy WASM assets so nothing loads from a CDN at runtime:

```bash
mkdir -p public/mediapipe && cp -r node_modules/@mediapipe/tasks-vision/wasm public/mediapipe/wasm
```

Model file: download the official Hand Landmarker model (`hand_landmarker.task`) from the MediaPipe documentation page for Hand Landmarker (the link in the "Models" section), save it to `public/models/hand_landmarker.task`, and note its source and licence in `README.md`. Verify the file opens/loads before moving on.

Camera access requires HTTPS or `localhost`.

## 4. Phases (each ends with a working build)

| Phase | Deliverable | Verify |
|---|---|---|
| 0 | Read all docs and `screens/`; write a short understanding + questions; **no code** | Owner answers |
| 1 | Scaffold, Tailwind tokens, font, lint/test setup | `lint`, `build` pass |
| 2 | Port 5 screens + navigation, static (no camera) | Visual compare with screenshots; flow clickable |
| 3 | Camera + model + overlay in Screen 4 | Overlay tracks hand; errors handled; camera stops |
| 4 | Recognizer + config + unit tests | Tests pass |
| 5 | Wire recognizer to Screen 4 feedback + session state machine | All five states reachable and displayed |
| 6 | OpenCV.js preprocessing (optional at runtime) | FPS compared on/off; fallback works |
| 7 | Hardening, accessibility, QA matrix, README | Matrix filled honestly |

## 5. Recognizer (pure TypeScript)

### 5.1 MediaPipe hand landmark indices

`0` wrist; thumb `1-4`; index `5-8`; middle `9-12`; ring `13-16`; pinky `17-20`. Coordinates are normalized to the image (`x`,`y` in 0–1, **y increases downward**); `z` is relative depth. The evaluator uses only 2D `x`,`y`.

### 5.2 `types.ts`

```ts
export type Landmark = { x: number; y: number; z: number };
export type TimedFrame = { t: number; lm: Landmark[] }; // t = ms (performance.now())

export type SignState = 'no-hand' | 'detecting' | 'almost' | 'recognized' | 'try-again';

export type Checks = { handOpen: boolean; handRaised: boolean; movement: boolean };

export type Evaluation = {
  state: Exclude<SignState, 'try-again'>; // try-again is decided by the session (timeout)
  checks: Checks;
  hint: string | null;
};
```

### 5.3 `config.ts` (all tunables live here)

```ts
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
  provisional: boolean;          // true until validated by a qualified signer
  windowMs: number;              // evaluation window
  minFramesInWindow: number;     // need enough samples to judge
  requiredExtended: FingerName[];
  extendedRatio: number;         // tip-to-wrist must exceed pip-to-wrist * ratio
  raisedMaxWristY: number;       // wrist.y must be <= this (0 = top of frame)
  minTravel: number;             // wrist travel, in hand-size units
  minPoseRatio: number;          // fraction of window frames where shape+position hold
  attemptTimeoutMs: number;      // session gives up after this
}

// PROVISIONAL starting values. Tune with real testing. Validate the sign itself
// (shape, position, movement) with a qualified signer before presenting as correct.
export const HELLO: SignConfig = {
  id: 'hello',
  label: 'Hello',
  provisional: true,
  windowMs: 1500,
  minFramesInWindow: 8,
  requiredExtended: ['index', 'middle', 'ring', 'pinky'],
  extendedRatio: 1.1,
  raisedMaxWristY: 0.6,
  minTravel: 0.8,
  minPoseRatio: 0.7,
  attemptTimeoutMs: 10000,
};
```

### 5.4 `evaluate.ts`

```ts
import { FINGER_JOINTS, type SignConfig } from './config';
import type { Checks, Evaluation, Landmark, TimedFrame } from './types';

const dist = (a: Landmark, b: Landmark) => Math.hypot(a.x - b.x, a.y - b.y);

// Hand size reference: wrist (0) to middle-finger base (9). Makes distances camera-distance independent.
const handSize = (lm: Landmark[]) => dist(lm[0], lm[9]) || 1e-6;

// Orientation-independent: a finger is extended if its tip is farther from the wrist than its middle joint.
const isExtended = (lm: Landmark[], tip: number, pip: number, ratio: number) =>
  dist(lm[0], lm[tip]) > dist(lm[0], lm[pip]) * ratio;

const NONE: Checks = { handOpen: false, handRaised: false, movement: false };

export function evaluate(frames: TimedFrame[], now: number, cfg: SignConfig): Evaluation {
  const win = frames.filter((f) => now - f.t <= cfg.windowMs && f.lm.length === 21);

  if (win.length === 0) {
    return { state: 'no-hand', checks: NONE, hint: 'Show your hand to the camera' };
  }
  if (win.length < cfg.minFramesInWindow) {
    return { state: 'detecting', checks: NONE, hint: null };
  }

  const openPerFrame = win.map((f) =>
    cfg.requiredExtended.every((name) => {
      const { tip, pip } = FINGER_JOINTS[name];
      return isExtended(f.lm, tip, pip, cfg.extendedRatio);
    }),
  );
  const raisedPerFrame = win.map((f) => f.lm[0].y <= cfg.raisedMaxWristY);

  const handOpen = openPerFrame[openPerFrame.length - 1];
  const handRaised = raisedPerFrame[raisedPerFrame.length - 1];

  const poseFrames = win.filter((_, i) => openPerFrame[i] && raisedPerFrame[i]).length;
  const poseRatio = poseFrames / win.length;

  const xs = win.map((f) => f.lm[0].x);
  const ys = win.map((f) => f.lm[0].y);
  const avgSize = win.reduce((s, f) => s + handSize(f.lm), 0) / win.length;
  const travel = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / avgSize;
  const movement = travel >= cfg.minTravel;

  const checks: Checks = { handOpen, handRaised, movement };
  const recognized = poseRatio >= cfg.minPoseRatio && movement;
  const passed = Object.values(checks).filter(Boolean).length;

  let hint: string | null = null;
  if (!recognized) {
    if (!handOpen) hint = 'Open your hand with fingers straight';
    else if (!handRaised) hint = 'Raise your hand a little higher';
    else if (!movement) hint = 'Move your hand smoothly';
  }

  return {
    state: recognized ? 'recognized' : passed >= 2 ? 'almost' : 'detecting',
    checks,
    hint,
  };
}
```

Known limitations (document them in the README):
- "Raised" uses a frame-position threshold, not face/head landmarks, so it is rough. Camera framing affects it.
- Movement ignores direction (any travel counts). Direction rules can be added to the config later.
- Thresholds are starting points, not validated values.

### 5.5 Unit tests (`evaluate.test.ts`) — required cases

Build a helper that generates 21-landmark hands from a few parameters (wrist position, finger-extended flags, size). Cases:

1. Open hand, raised, wrist moving enough over the window → `recognized`.
2. Open hand, raised, **stationary** → not recognized; `movement` false; hint about moving.
3. Closed fist (fingertips closer to wrist than PIP joints), raised, moving → not recognized; `handOpen` false.
4. Open hand, **low** in frame, moving → not recognized; `handRaised` false; hint about raising.
5. No frames in window → `no-hand`.
6. Fewer than `minFramesInWindow` → `detecting`.
7. Frames older than `windowMs` are ignored.
8. Hand-size normalization: same motion at two hand sizes (near vs far) gives the same movement result.
9. Two of three checks pass → `almost`.

Tests must exercise real evaluator code, not mocks of it.

## 6. Vision layer

### 6.1 `handLandmarker.ts` (singleton)

```ts
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

let instance: HandLandmarker | null = null;
let loading: Promise<HandLandmarker> | null = null;

export function getHandLandmarker(): Promise<HandLandmarker> {
  if (instance) return Promise.resolve(instance);
  if (!loading) {
    loading = (async () => {
      const vision = await FilesetResolver.forVisionTasks('/mediapipe/wasm');
      const create = (delegate: 'GPU' | 'CPU') =>
        HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: '/models/hand_landmarker.task', delegate },
          runningMode: 'VIDEO',
          numHands: 1,
        });
      try {
        instance = await create('GPU');
      } catch {
        instance = await create('CPU'); // fallback
      }
      return instance;
    })();
  }
  return loading;
}

export function closeHandLandmarker() {
  instance?.close();
  instance = null;
  loading = null;
}
```

If model loading fails, show a friendly message with a retry button.

### 6.2 `camera.ts`

Requirements:
- `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })`. Never request audio.
- Map errors to friendly states: `NotAllowedError` (permission denied), `NotFoundError` (no camera), `NotReadableError` (camera in use), anything else (generic). Each has plain text and a retry action.
- `stop()` calls `track.stop()` on every track and clears `video.srcObject`.
- Call `stop()` on unmount, on route change, and when the tab is hidden for a long time (optional).

### 6.3 Frame loop (inside the practice session hook)

```ts
let lastVideoTime = -1;
const frames: TimedFrame[] = [];

function tick() {
  if (!running) return;
  const video = videoRef.current!;
  if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    const now = performance.now();
    const source = preprocessIfAvailable(video); // returns canvas or the video itself
    const result = landmarker.detectForVideo(source, now);
    const lm = result.landmarks[0];
    drawOverlay(result);                          // clears canvas each frame
    if (lm) frames.push({ t: now, lm });
    // drop frames older than windowMs + margin
    while (frames.length && now - frames[0].t > cfg.windowMs + 500) frames.shift();
  }
  const evaluation = evaluate(frames, performance.now(), cfg);
  updateSession(evaluation);                      // throttle React updates if needed
  rafId = requestAnimationFrame(tick);
}
```

Notes:
- Timestamps passed to `detectForVideo` must increase strictly.
- Avoid heavy React state updates every frame; keep frames in a ref, publish the evaluation to state at ≤ 15–30 Hz or when it changes.
- Overlay: use `DrawingUtils` from `@mediapipe/tasks-vision` with `HandLandmarker.HAND_CONNECTIONS` to draw landmarks and connections on a canvas that exactly overlays the video.
- Mirroring: wrap video and overlay canvas in one container with `transform: scaleX(-1)`. Landmarks stay in raw coordinates, so the overlay lines up automatically.
- When the hand is lost, push nothing; stale frames age out via `windowMs`.

## 7. OpenCV.js preprocessing (optional at runtime)

Purpose: a small, honest preprocessing step in the pipeline (resize and simple brightness normalization) before landmark detection. It is **not** doing recognition.

Rules:
- Load lazily when entering Screen 4; never block the first render.
- Choose one distribution (an npm build of OpenCV.js, or a self-hosted `opencv.js` in `/public`), pin it, and note which in the README. Verify the API names used below against that build.
- **If it fails to load or throws, continue with raw video frames.** The app must still work.
- Benchmark FPS with preprocessing on vs off. If it lowers FPS noticeably (below about 15), disable the brightness step or the whole stage, and record the result in `CHANGELOG.md`.

Reference wrapper (adapt to the installed build):

```ts
// preprocess.ts
export function preprocessFrame(cv: any, srcCanvas: HTMLCanvasElement, dstCanvas: HTMLCanvasElement) {
  const src = cv.imread(srcCanvas);
  const dst = new cv.Mat();
  const gray = new cv.Mat();
  try {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    const meanBrightness = cv.mean(gray)[0];
    const beta = Math.max(-40, Math.min(40, 110 - meanBrightness)); // gentle auto-brightness
    cv.convertScaleAbs(src, dst, 1.0, beta);
    cv.imshow(dstCanvas, dst);
  } finally {
    src.delete();
    dst.delete();
    gray.delete();
  }
}
```

Pipeline: draw the `<video>` frame to an offscreen canvas at about 640 px wide (preserving aspect ratio) → `preprocessFrame` → pass the destination canvas to `detectForVideo`. Because the canvas has the same aspect ratio as the video, normalized landmarks still align with the overlay.

## 8. Practice session state machine (`usePracticeSession`)

```
idle ──start──► active ──evaluation.recognized──► success
                  │
                  ├── attemptTimeout (cfg.attemptTimeoutMs) ──► try-again ──retry──► active
                  └── user leaves / unmounts ──► cleanup (stop camera, cancel rAF, clear buffers)
```

- `state` shown to the user = evaluator state while `active`, or `try-again` after timeout, or `recognized` on success.
- On success: stop the frame loop, keep the camera preview until navigation, enable the route to Screen 5.
- On retry: clear the frame buffer and restart the attempt timer.
- Live region: announce state changes through an `aria-live="polite"` element (e.g. "Recognized", "Almost there, raise your hand a little higher").
- Map evaluator output to whichever UI elements Screen 4 actually contains (status indicator, checklist items, hint text). Do not add UI that isn't in the design; ask the owner if a needed state has no place in the design.

## 9. Porting the Stitch screens

1. For each screen, open `screenshot.jpg` and `screen.html`. Rebuild as React components with Tailwind, matching spacing, radii, colours, and type.
2. Extract shared tokens (colours, radius, spacing, font) into Tailwind theme/CSS variables. Use a free rounded font that matches the design; do not use proprietary fonts.
3. Replace placeholder media/links with real routes and the real video element or an obviously labelled placeholder.
4. Check text contrast. Where the design's text colours fail contrast (muted grey and accent blue on pale blue are known risks), do not silently change the design; list the cases for the owner.
5. Verify at desktop width against screenshots, then check tablet and phone widths for usability.
6. Respect `prefers-reduced-motion` for any animation in the design.

## 10. Accessibility checklist

- Every interactive element is keyboard reachable with a visible focus ring; targets ≥ 44px.
- Video has captions or a text alternative; no audio-only information anywhere.
- Status changes use icon + text + colour, announced via `aria-live`.
- Camera permission explanation is plain text, visible before the prompt.
- Page titles and headings are sensible per screen.
- Test with keyboard only and with browser zoom at 200%.

## 11. QA matrix (record real results; do not pre-fill)

| Check | How | Result |
|---|---|---|
| Correct sign recognized | 10 attempts, good light | |
| Wrong shapes rejected (fist, pointing, static open hand) | 10 attempts each | |
| Dim lighting | Lamp off / evening | |
| Bright window behind user | Backlit | |
| Busy background | | |
| Camera height/angle variation | Low, eye-level, high | |
| Different people / hand sizes | At least 2 other people | |
| Left and right hand | | |
| Distance from camera | Near, medium, far | |
| Permission denied | Deny in prompt | |
| No camera available | Disable device | |
| Camera in use by another app | | |
| Tab hidden / route change | Camera light turns off | |
| Low-end laptop FPS | Check with preprocessing on/off | |
| Offline load | Disable network, reload | |
| Keyboard-only run-through | | |
| 200% zoom | | |

Write a short, honest summary of observed behaviour (including failures) into `README.md`. Do not state accuracy percentages.

## 12. Troubleshooting notes

- **Overlay misaligned:** video and canvas must share the same CSS size and aspect ratio; resize the canvas to the video's intrinsic size.
- **Black video:** wait for `loadedmetadata`, call `play()`, and check autoplay rules (`muted`, `playsInline`).
- **Detector errors about timestamps:** ensure strictly increasing `performance.now()` values; don't call `detectForVideo` twice for the same frame.
- **Low FPS:** use GPU delegate, lower the processing canvas size, disable preprocessing, throttle React updates.
- **Camera not available on a hosted URL:** ensure HTTPS.
- **Memory growth:** check for undeleted `cv.Mat` objects and un-closed landmarker instances.

## 13. README contents (required)

Setup and run commands; stack and pinned versions; model source and licence; how recognition works in plain language; limitations (section 5.4); the "prototype, one sign, not validated" statement; QA summary; open decisions from the PRD; credits for any assets.
