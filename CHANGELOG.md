# CHANGELOG — SignAble Prototype

## [0.1.0] - 2026-10-23

### Phase 0: Discovery & Architecture Review
- Reviewed `AGENTS.md`, `PRD.md`, `IMPLEMENTATION.md`, product brief, design tokens, and all 5 Stitch screens (`screens/`).
- Resolved discrepancies: Screen 4 redesigned HTML previously lacked a prototype transparency label; added explicit badge `"⚠️ Prototype: recognizes 1 sign (Hello)"`.
- Mapped full user flow: Learning Path (1) → Lesson Intro (2) → Watch the Sign (3) → Practice Studio (4) → Lesson Complete (5) → Learning Path (1).

### Phase 1: Project Scaffolding, Tokens & Assets
- Initialized Next.js 14 App Router with strictly pinned dependency versions:
  - `next`: `14.2.35`
  - `react`: `18.3.1`
  - `react-dom`: `18.3.1`
  - `@mediapipe/tasks-vision`: `0.10.21`
  - `vitest`: `2.1.9`
  - `tailwindcss`: `3.4.17`
  - `typescript`: `5.7.3`
- Downloaded official MediaPipe `hand_landmarker.task` model to `/public/models/hand_landmarker.task` (7.8 MB).
- Copied MediaPipe WASM binaries to `/public/mediapipe/wasm/` for full offline runtime operation.
- Downloaded OpenCV.js to `/public/opencv/opencv.js` (9.9 MB).
- Extracted design tokens into `tailwind.config.ts` matching the Stitch color palette, border radii, and spacing grid.
- Configured self-hosted Nunito Sans via `next/font/google` and Google Material Symbols.

### Phase 2: Screen Porting & Linear Navigation
- **Screen 1 (`/`):** Learning Path with active "Hello" node, bouncing start badge, featured action card, unit progress, daily target, and streak.
- **Screen 2 (`/lesson/hello/intro`):** Lesson Intro with 3-step breakdown (Watch → Try → Practice), on-device privacy guarantee, and navigation to Watch Sign.
- **Screen 3 (`/lesson/hello/watch`):** Watch the Sign with video demonstration player, scrub progress, 1.0x / 0.5x speed control, mirror toggle, angle switch, 3 checkpoint cards, and replay control.
- **Screen 5 (`/lesson/hello/complete`):** Lesson Complete with unlocked sign trophy, academic progress summary (signs learned, attempts, time spent, recognition status), and return to path.

### Phase 3 & 4: Vision Layer, Pure TS Recognizer & Vitest Suite
- Implemented `lib/vision/camera.ts` with strict privacy (audio: false, frames in browser memory only), user-friendly error mapping (permission denied, not found, busy), and guaranteed track cleanup.
- Implemented `lib/vision/handLandmarker.ts` singleton with GPU delegate and CPU fallback, loading from local `/public/mediapipe/wasm`.
- Implemented `lib/recognizer/types.ts` and `lib/recognizer/config.ts` isolating all thresholds and parameters.
- Implemented `lib/recognizer/evaluate.ts` without React/DOM dependencies:
  - Hand size normalization using wrist-to-MCP distance.
  - Orientation-independent finger extension check.
  - Wrist elevation threshold.
  - Normalized movement distance over a sliding ~1.5s window.
- Implemented `lib/recognizer/evaluate.test.ts` with synthetic 21-landmark generator:
  - Tested 9 required cases (recognized, stationary, closed fist, low hand, empty window, insufficient frames, expired frames, hand-size scale invariance, almost state).
  - All 9 unit tests passing (100%).

### Phase 5: Practice Studio Integration & State Machine
- Created `lib/session/usePracticeSession.ts` hook orchestrating:
  - Video stream and canvas overlay synchronization.
  - CSS mirroring via wrapper `transform: scaleX(-1)`.
  - Strictly monotonic timestamps passed to `detectForVideo`.
  - Session state machine: `idle` → `detecting` → `almost` → `recognized` (or `try-again` after 10s attempt timeout).
  - Dynamic mapping to the 3 visual checkpoints (Open Palm, Cheek/Temple Level, Gentle Outward Wave).
  - Accessible screen reader announcements via `aria-live="polite"`.
  - Conditional reveal of the success banner with "Continue →" routing to Screen 5 upon real recognition.

### Phase 6: OpenCV.js Preprocessing & Fallback
- Implemented `lib/vision/preprocess.ts`:
  - Lazy loading without blocking initial page render.
  - Offscreen 640px canvas buffer with aspect ratio preservation.
  - Grayscale conversion and gentle auto-brightness adjustment.
  - Strict `cv.Mat.delete()` lifecycle inside `finally` blocks to prevent WebAssembly memory leaks.
  - Seamless fallback to raw video frames if OpenCV is disabled or fails to load.
  - UI toggle button (`CV ON/OFF`) and live FPS counter.

### Phase 7: Accessibility & Verification
- Validated keyboard navigation, focus indicators, minimum 44px touch targets, and `prefers-reduced-motion`.
- Verified `npm run lint` passes with 0 errors/warnings.
- Verified `npm run test` passes with 9/9 tests.
- Verified `npm run build` succeeds with 100% static route generation.
