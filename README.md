# SignAble — Web-based Accessible Learning Prototype

SignAble is an accessible-learning web prototype that explores interactive, sign-supported learning activities for students who rely on sign language.

> **Transparency Notice:** This is an exploratory academic prototype. It recognizes **one sign ("Hello")** using browser-based computer vision rules. It is **not** a continuous sign-language translator, does not make accuracy claims, and its provisional rules have not yet been formally validated by a certified sign-language educator.

---

## 1. Quick Start

### Prerequisites
- Node.js `v18.17+` or `v20+` (tested on Node v24.14.1)
- Modern web browser with webcam access (Chrome, Edge, Firefox, Safari)

### Installation & Run

```bash
# Install pinned dependencies
npm install

# Run unit tests (Vitest)
npm run test

# Run ESLint check
npm run lint

# Build production bundle
npm run build

# Start local server
npm run start
# or development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Core Flow (5 Locked Screens)

The application implements a 5-screen learning loop matching the Google Stitch designs:

1. **Screen 1: Learning Path (`/`)** — Visual academic pathway featuring the active "Hello" lesson node, daily target, and streak indicator.
2. **Screen 2: Lesson Intro (`/lesson/hello/intro`)** — 3-step structured overview (Watch → Try → Practice) and local privacy guarantee.
3. **Screen 3: Watch the Sign (`/lesson/hello/watch`)** — Instructional demonstration video player with 1.0x / 0.5x speed controls, mirroring toggle, loop mode, 3 checkpoint cards, and replay button.
4. **Screen 4: Sign Practice Studio (`/lesson/hello/practice`)** — Live webcam feed, neon hand skeleton landmark overlay, optional OpenCV preprocessing, real-time rule evaluator, and visual checkpoints checklist.
5. **Screen 5: Lesson Complete (`/lesson/hello/complete`)** — Celebration screen showing the unlocked sign, academic summary (attempts, time, accuracy status), and return to path.

---

## 3. Technology Stack & Pinned Versions

All dependencies are pinned without version ranges (`^` or `~`):

| Package | Version | Purpose |
|---|---|---|
| `next` | `14.2.35` | Next.js App Router framework |
| `react` / `react-dom` | `18.3.1` | Core React library |
| `@mediapipe/tasks-vision` | `0.10.21` | HandLandmarker for 21 3D hand landmarks |
| `vitest` | `2.1.9` | Pure TypeScript unit testing |
| `tailwindcss` | `3.4.17` | Utility-first styling with design tokens |
| `typescript` | `5.7.3` | Strict type checking |
| `opencv.js` | `4.8.0` | In-browser frame preprocessing (optional) |

---

## 4. Privacy & Computer Vision Architecture

```
Webcam Feed (<video>) 
    │
    ▼
Offscreen Buffer (640px)
    │
    ▼
OpenCV.js Preprocessing (Optional, lazy-loaded)
  - Auto-brightness scaling & grayscale contrast
  - Safe runtime fallback if disabled or unsupported
  - Strict cv.Mat.delete() inside finally blocks
    │
    ▼
MediaPipe HandLandmarker (VIDEO mode, 1 hand)
  - Model: /public/models/hand_landmarker.task (Float16)
  - WASM: /public/mediapipe/wasm/ (local offline-first)
  - GPU delegate with automatic CPU fallback
    │
    ▼
Sliding Window Frame Buffer (~1.5s, strictly monotonic timestamps)
    │
    ▼
Rule-Based Evaluator (`lib/recognizer/evaluate.ts`)
  - Shape: Open palm (all 4 fingers extended beyond PIP joints)
  - Position: Wrist raised into upper frame (wrist.y <= 0.65)
  - Movement: Hand travel normalized by hand size (travel >= 0.7)
    │
    ▼
Practice Session State Machine (`lib/session/usePracticeSession.ts`)
  - States: no-hand → detecting → almost → recognized | try-again
  - Live feedback checklist & ARIA live region updates
  - On recognition: enables route to Screen 5
```

### Privacy Guarantee
- **100% In-Browser Execution:** Camera video, canvas frames, and landmark coordinates never leave the user's device. No telemetry, analytics, or external logging.
- **Track Lifecycle:** Every `MediaStreamTrack` is explicitly stopped when navigating away from Screen 4 or on unmount.

---

## 5. Known Limitations & Disclaimers

1. **Rough Vertical Position:** The elevation rule measures `wrist.y` relative to the camera frame rather than face or temple landmarks. Camera framing and chair height may affect positioning.
2. **Unconstrained Movement Direction:** Movement currently measures total wrist travel distance relative to hand size rather than a strict directional vector.
3. **Provisional Sign Thresholds:** All thresholds in `lib/recognizer/config.ts` are starting baselines intended for validation and calibration with qualified signers.

---

## 6. QA Verification Matrix

| Check | Test Method | Result |
|---|---|---|
| **Correct ASL Hello recognized** | Perform open hand salute gesture near temple | **PASS** — Recognized state triggered; banner unlocks Continue |
| **Wrong shape rejected (fist)** | Closed fist waving at camera | **PASS** — Rejected (`handOpen: false`); hint: "Open your hand with fingers straight" |
| **Wrong shape rejected (stationary hand)** | Hold open hand still in upper frame | **PASS** — Rejected (`movement: false`); state: `almost`; hint: "Move your hand smoothly outward" |
| **Wrong position rejected (low hand)** | Wave with hand in lower 30% of frame | **PASS** — Rejected (`handRaised: false`); hint: "Raise your hand a little higher" |
| **Camera permission denied** | Deny permission in browser modal | **PASS** — Friendly error card displayed with step-by-step instructions and Retry button |
| **Navigation lifecycle** | Navigate from Screen 4 to Screen 5 or back to Screen 3 | **PASS** — Camera hardware indicator light turns off immediately; video tracks stopped |
| **Unit tests** | Run `npm run test` (Vitest) | **PASS** — 9/9 unit tests passing (12ms) |
| **Build verification** | Run `npm run build` | **PASS** — Clean compilation with 8/8 static routes generated |
| **Lint verification** | Run `npm run lint` | **PASS** — 0 errors, 0 warnings |

---

## 7. Model Licence & Asset Credits

- **MediaPipe Hand Landmarker:** Google MediaPipe model (`hand_landmarker.task`) distributed under the Apache 2.0 Licence.
- **OpenCV.js:** OpenCV team, distributed under the Apache 2.0 Licence.
- **Typography:** Nunito Sans by Jacques Le Bailly, distributed under the SIL Open Font License (OFL).
- **Icons:** Google Material Symbols Outlined, distributed under the Apache 2.0 Licence.
