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

### Bugfix: Webcam Studio Unresponsiveness Resolved

- **Infinite Mount/Teardown Loop:** Stabilized `usePracticeSession` dependencies using `useRef` for options, config, and loop states; ensured `init` and `useEffect` execute strictly once on mount rather than constantly restarting `getUserMedia` and recreating `HandLandmarker` on every frame re-render.
- **Render Storm Elimination:** Added shallow equality comparison for `checks` (`handOpen`, `handRaised`, `movement`) and string equality for `hint`, reducing React state re-renders from 60fps to event-driven state transitions.
- **OpenCV Optimization:** Changed default `openCvEnabled` to `false` for immediate, zero-lag initialization; downscaled offscreen OpenCV processing canvas from 640px to 320px preserving exact aspect ratio to eliminate main thread WASM blocking.
- **Loop Lifecycle & Concurrency:** Enforced `isLoopRunningRef` to prevent duplicate concurrent RAF loops and automatically stopped the frame loop upon successful sign recognition per PRD/IMPLEMENTATION guidelines.
- **Safety Fallbacks:** Added `loadeddata`/`canplay` event listeners with timeout fallback in `CameraService.start()` to prevent hanging promises.
- **12 FPS Processing Throttle:** Paced the MediaPipe inference and FPS meter to 12 FPS (~83.3ms interval) in `usePracticeSession.ts` for minimal CPU usage and stable processing.

### Bugfix: Frozen Hand Skeleton Resolved

- **Continuous Overlay Tracking on Recognition:** Removed the premature frame loop termination (`isLoopRunningRef.current = false; return;`) upon sign recognition. Hand skeleton tracking and canvas rendering now continue fluidly at 12 FPS in real-time alongside the live camera feed while displaying the "Sign Recognized!" success banner.
- **Hardware Framerate Decoupling:** Removed the restrictive `frameRate: { max: 15 }` hardware constraint in `src/lib/vision/camera.ts` that caused Windows DirectShow/MediaFoundation webcam driver pipeline stalls and frame drops. Framerate pacing is cleanly enforced in software at 12 FPS.
- **Timestamp & Gating Resiliency:** Streamlined 12 FPS interval throttling in `usePracticeSession.ts` based on performance timing without fragile dependency on quantized or delayed `video.currentTime` updates from live MediaStreams.
- **Error & Reset Canvas Cleanup:** Added safety canvas clearing in `catch (detectErr)` and `resetSession()` to ensure dead or corrupted skeleton landmarks are never left permanently painted on screen.
- **Array Bounds Safeguard:** Added validation for standard 21-landmark array completeness before indexing joints in `drawOverlay` to prevent undefined property errors.

### Bugfix: Webcam Hardware Lock & Hand Tracking Initialization

- **Exclusive Camera Lock Resolution:** Fixed `NotReadableError: Device in use` by terminating a hung background Chrome process holding an exclusive DirectShow/MediaFoundation lock on the webcam hardware.
- **Race Condition & Cancellation Protection:** Added pending promise deduplication and cancellation tokens to `CameraService.start()` and `CameraService.stop()` in `src/lib/vision/camera.ts`. In-flight `getUserMedia` calls aborted during React mount/remount now immediately terminate hardware tracks upon resolution, preventing orphaned locks.
- **SrcObject Track Cleanup:** Explicitly iterate and call `track.stop()` on `videoElement.srcObject` upon camera stop to guarantee sensor release.
- **Concurrent Non-Blocking Initialization:** Decoupled MediaPipe `HandLandmarker` loading from `cameraService.start()` in `usePracticeSession.ts` using `Promise.allSettled`. Camera delays or permission retries no longer prevent MediaPipe from loading into memory.
- **Landmark Sensitivity & Timestamp Pacing:** Lowered `minHandDetectionConfidence`, `minHandPresenceConfidence`, and `minTrackingConfidence` from `0.5` to `0.35` in `src/lib/vision/handLandmarker.ts` for immediate hand pickup across diverse lighting environments, and guaranteed strictly increasing integer timestamps for `detectForVideo`.

### Phase A: Performance Instrumentation & Camera Start Bugfix

- **Camera Start Cancellation Inversion:** Resolved issue where `CameraService.start()` called `this.cancelled = false;` followed by `this.stop(videoElement);` (which set `this.cancelled = true`), causing `getUserMedia` to immediately abort tracks upon acquisition with `AbortError`. Reordered to `this.stop()` first, then `this.cancelled = false;`.
- **DOM Ref Attachment Retries:** Added a safety check in `usePracticeSession.ts` to briefly yield and verify `videoRef.current` is attached before initiating `getUserMedia`.
- **Per-Frame Logging Suppression:** Removed per-frame `console.warn` calls from `usePracticeSession.ts` and `preprocess.ts`.
- **Debug HUD & Testing Flags:** Implemented `DebugHUD.tsx` (active with `?debug=1`, updating at 4 Hz) and wired flags `?cv=off|on`, `?delegate=cpu|gpu`, `?res=360|480|720`, `?overlay=off|on`, `?fps=12|24|max`.
- **Immediate Video Play Pipeline:** Refactored `CameraService.start()` to call `await videoElement.play()` immediately upon attaching `videoElement.srcObject = stream` rather than waiting for `loadeddata` while paused.
- **Clean Production Rebuild:** Purged locked `.next` build artifacts and generated fresh production assets.

### Bugfix: Webcam Playback, OpenCV Freeze & MediaPipe Pipeline Initialization

- **Resolved Unresponsive Browser Hang:** Diagnosed that `flags.cv` was accidentally defaulted to `'on'`, causing synchronous download and compilation of the 9.9 MB `opencv.js` (7.3 MB WASM) on the main thread during initial page render. Restored default to `'off'` across `usePracticeSession.ts` and `page.tsx`, eliminating main-thread freezing and allowing instant camera start.
- **Fixed "Camera On but Not Showing in Window":** Added programmatic assignment of `videoElement.muted = true`, `playsInline = true`, and `autoplay = true` on the DOM element prior to `srcObject` assignment and `play()`, resolving Chrome autoplay policy rejections that left the video element silently paused.
- **Active Stream Reuse & Multi-Mount Resiliency:** Enhanced `CameraService` to fast-path reuse an active, healthy `MediaStream` across React StrictMode mount/remount cycles rather than unnecessarily stopping and reopening hardware device handles.
- **Fixed MediaPipe Initialization in Remounts:** Removed fragile `isClosing` cancellation token from `src/lib/vision/handLandmarker.ts` that caused in-flight `getHandLandmarker` promises to throw and permanently fail during React StrictMode mount/unmount/remount sequences.
- **Frame Loop Playback Keep-Alive:** In `usePracticeSession.ts`, added automatic playback kick in `tick()` if a ready video element is paused, and allowed detection on live frames even if driver-quantized `video.currentTime` updates are delayed.
- **Removed Target Hand Zone Guide Silhouette:** Removed the dashed blue box and "Target Hand Zone" badge overlay from Screen 4's webcam viewport in [page.tsx](file:///d:/projects/Signable/src/app/lesson/hello/practice/page.tsx), providing an unobstructed, full-view canvas for live hand sign detection.
- **Removed Prototype Label, CV Toggle & Hand Detected Badge:** Removed the `"Prototype: recognizes 1 sign (Hello)"` warning badge, `"CV OFF"` button, and `"Hand Detected"` status pill per user request, leaving only the live camera feed, mirrored guidance, and real-time tracking skeleton in the viewport.
- **Removed Circular Start Button & All Project Emojis:** Removed the bouncing `"START!"` badge and circular active node disc from the home page ([src/app/page.tsx](file:///d:/projects/Signable/src/app/page.tsx)), and eliminated all decorative emojis across all screens (`/`, `/lesson/hello/intro`, `/lesson/hello/practice`, `/lesson/hello/complete`, and `index.html`) for a clean, consistent interface.


