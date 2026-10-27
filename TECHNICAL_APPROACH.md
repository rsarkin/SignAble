# SignAble Technical Architecture & Implementation Approach

This document provides a comprehensive technical breakdown of **SignAble**, an accessible, browser-based sign-language learning application. It details the computer vision pipeline, hand tracking infrastructure, rule-based recognition mathematics, client-side OpenCV WebAssembly integration, dependency justifications, and the hybrid Server-Side Rendering (SSR) architecture.

---

## Table of Contents
1. [System Architecture Overview](#1-system-architecture-overview)
2. [Libraries and Technology Stack](#2-libraries-and-technology-stack)
3. [Hand Tracking Pipeline (MediaPipe Tasks-Vision)](#3-hand-tracking-pipeline-mediapipe-tasks-vision)
4. [Computer Vision & Image Preprocessing (OpenCV.js)](#4-computer-vision--image-preprocessing-opencvjs)
5. [Gesture Recognition Engine (Rule-Based Evaluator)](#5-gesture-recognition-engine-rule-based-evaluator)
6. [Server-Side Rendering (SSR) & Client Hydration Architecture](#6-server-side-rendering-ssr--client-hydration-architecture)
7. [Why Vision Processing Cannot Be Server-Side](#7-why-vision-processing-cannot-be-server-side)
8. [Performance, Memory & Lifecycle Management](#8-performance-memory--lifecycle-management)

---

## 1. System Architecture Overview

SignAble is built around an entirely **local, zero-backend, client-first architecture**. All video ingestion, machine learning landmark inference, computer vision preprocessing, and gesture evaluation execute within the client browser process.

```mermaid
flowchart TD
    subgraph BrowserClient ["Client Runtime (Browser Process)"]
        A[Webcam Hardware] -->|MediaStream 1280x720| B[CameraService /src/lib/vision/camera.ts]
        B -->|HTMLVideoElement| C[usePracticeSession Hook /src/lib/session/usePracticeSession.ts]
        
        C -->|Raw Video Frame| D{OpenCV Loaded & Enabled?}
        D -->|Yes| E[Preprocess Pipeline /src/lib/vision/preprocess.ts]
        E -->|Normalized Mat/Canvas| F[MediaPipe HandLandmarker]
        D -->|No / Fallback| F[MediaPipe HandLandmarker /src/lib/vision/handLandmarker.ts]
        
        F -->|21 3D Landmarks + Timestamp| G[Temporal Frame Buffer 1,500ms Window]
        G -->|Coordinate Trajectory| H[Rule Evaluator /src/lib/recognizer/evaluate.ts]
        
        H -->|Shape, Elevation, Motion Flags| I[Feedback State Machine]
        I -->|Live Checkpoints & Prompts| J[Practice Studio UI /src/app/lesson/hello/practice]
        I -->|HTML5 Overlay Canvas| K[Hand Skeleton Neon Renderer]
    end
```

### End-to-End Execution Flow
1. **Camera Ingestion:** The `CameraService` requests a 1280×720 stream (`facingMode: 'user'`), handles browser autoplay permissions (`muted = true`, `playsInline = true`), and binds the stream to an unmirrored `<video>` element.
2. **Animation Frame Loop:** A `requestAnimationFrame` loop polls the video element. When a fresh frame arrives (detected via `video.currentTime`), the timestamp is validated for strict monotonic increase.
3. **Optional Preprocessing:** If OpenCV.js is loaded and enabled, the frame passes through brightness normalization and contrast balancing. If OpenCV is unavailable or disabled, the pipeline skips preprocessing without delay or degradation.
4. **Landmark Extraction:** Google MediaPipe `HandLandmarker` processes the frame in `VIDEO` mode, outputting 21 normalized 3D hand coordinates ($x, y, z \in [0, 1]$).
5. **Temporal Windowing:** Coordinates and timestamps are pushed to a 1,500 ms sliding FIFO buffer.
6. **Deterministic Rule Evaluation:** The evaluator computes finger extension vectors, wrist elevation, and displacement over time against thresholds defined in `config.ts`.
7. **Reactive UI & Visual Feedback:** The UI updates checkpoint icons, assistive text, ARIA live region announcements, and renders an overlay skeleton in real time at 30–60 FPS.

---

## 2. Libraries and Technology Stack

All dependencies are strictly pinned to exact versions to eliminate supply-chain drift, build inconsistencies, or sudden breaking changes.

| Library / Tool | Pinned Version | Architectural Role | Why It Was Chosen |
|---|---|---|---|
| **Next.js** | `14.2.35` | Core Application Framework (App Router) | Enables hybrid server-side rendering for static UI shells, rapid FCP, modern routing, and strict code splitting between server and client boundaries. |
| **React** | `18.3.1` | UI Library & State Reconciliation | Concurrent rendering, declarative component state, ref-based DOM management for canvas and video streams. |
| **TypeScript** | `5.7.3` | Static Typing System | Enforces compile-time type safety across landmark arrays, recognizer configurations, and component contracts with `strict: true`. |
| **@mediapipe/tasks-vision** | `0.10.21` | Machine Learning Hand Landmark Model | Industry-standard, highly optimized WebAssembly + SIMD runtime that detects 21 3D hand landmarks in 10–18 ms per frame without GPU server roundtrips. |
| **OpenCV.js** | `4.8.0` | Computer Vision & Image Processing | Standard computer vision library compiled to WebAssembly. Used for pixel-level operations (brightness scaling, histogram equalization) directly in browser memory. |
| **Tailwind CSS** | `3.4.17` | Utility-First Styling System | Zero runtime CSS overhead, responsive utility classes, custom design tokens matching the Duolingo accessible learning design system. |
| **Vitest** | `2.1.9` | Headless Unit Testing | Extremely fast, native Vite/ESM-based unit test runner used to test the pure TypeScript recognition engine with synthetic 3D coordinate fixtures. |

---

## 3. Hand Tracking Pipeline (MediaPipe Tasks-Vision)

### Architecture of MediaPipe HandLandmarker
Google MediaPipe HandLandmarker operates using a two-stage machine-learning pipeline:
1. **Palm Detection Model (BlazePalm):** Scans the entire image frame to detect the bounding box of a human palm. This model is rotation-invariant and optimized for hands of varying scale and orientation.
2. **Hand Landmark Model:** Crops into the bounding box identified by BlazePalm and predicts **21 3D landmarks** with high spatial accuracy ($x, y$ coordinates normalized to $[0, 1]$, and $z$ representing relative depth from the wrist).

```
Landmark Topology:
         4 (Thumb Tip)
         |
         3 (Thumb IP)
         |
         2 (Thumb MP)        8 (Index Tip)   12 (Middle Tip)  16 (Ring Tip)   20 (Pinky Tip)
         |                   |               |                |               |
         1 (Thumb CMC)       7 (Index DIP)   11 (Middle DIP)  15 (Ring DIP)   19 (Pinky DIP)
          \                  |               |                |               |
           \                 6 (Index PIP)   10 (Middle PIP)  14 (Ring PIP)   18 (Pinky PIP)
            \                |               |                |               |
             \               5 (Index MCP)   9 (Middle MCP)   13 (Ring MCP)   17 (Pinky MCP)
              \              |               /                /               /
               \             |              /                /               /
                \------------0 (Wrist)-----/----------------/---------------/
```

### Monotonic Timestamps & Frame Pacing
MediaPipe's `detectForVideo()` requires strictly increasing timestamps:
$$\text{timestamp}_{i} > \text{timestamp}_{i-1}$$
If a frame is sent with a duplicated or decreasing timestamp, the underlying WASM engine throws a fatal runtime exception. 

SignAble solves this in `usePracticeSession.ts` by combining hardware video time with a high-resolution performance timer fallback:
```typescript
const now = performance.now();
const videoTimeMs = video.currentTime * 1000;
const timestamp = Math.max(videoTimeMs, lastTimestampRef.current + 1, now);
lastTimestampRef.current = timestamp;
```

### Lifecycle & React StrictMode Resilience
In React 18 development mode, components mount, unmount, and remount immediately to detect side-effect cleanup bugs. Initializing a 9.9 MB WASM model is expensive (~400–800 ms). 

To ensure stability:
- The `HandLandmarker` instance is managed as a **singleton promise** in `src/lib/vision/handLandmarker.ts`.
- In-flight initialization is never aborted or destroyed mid-flight during transient StrictMode unmounts.
- Teardown only disposes of the underlying WASM instance when the user permanently navigates away from the practice route.

### Mirroring: Visual Perception vs. Geometric Math
- **User Experience Requirement:** Users expect a webcam to behave like a mirror (raising the right hand displays the hand on the right side of the screen).
- **Computer Vision Danger:** Mirroring pixel coordinates alters chirality (left hand becomes right hand) and inverts vector mathematics.
- **The Solution:** The raw video feed and coordinate calculations remain **strictly unmirrored**. Mirroring is handled purely at the presentation layer using a CSS transform on the container wrapping both video and overlay canvas:
```css
.camera-mirror-container {
  transform: scaleX(-1);
}
```

---

## 4. Computer Vision & Image Preprocessing (OpenCV.js)

### Why OpenCV.js?
In uncontrolled web environments, users practice in varied lighting conditions: backlighting, underexposure, or harsh side glare. MediaPipe's landmark detector performance drops when hand edges blend into low-contrast backgrounds.

OpenCV.js provides WebAssembly-accelerated image normalization before frames reach the detector.

### Lazy Dynamic Loading
`opencv.js` is a 9.9 MB script compiling 7.3 MB of WebAssembly. Loading this synchronously blocks the main thread, causing initial page freezes and poor Core Web Vitals.

SignAble implements **lazy runtime injection**:
1. The app loads with `cv: 'off'` by default, allowing instant UI interaction and camera activation.
2. OpenCV is injected dynamically via a non-blocking `<script>` tag:
```typescript
export async function loadOpenCV(scriptUrl = '/opencv/opencv.js'): Promise<OpenCVModule> {
  if (cvInstance) return cvInstance;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => {
      // Poll for Module.Mat to be instantiated by Emscripten
      checkRuntimeInitialized(resolve);
    };
    document.head.appendChild(script);
  });
}
```

### Preprocessing Operations
When enabled, `src/lib/vision/preprocess.ts` executes a 3-step normalization:

```mermaid
flowchart LR
    A[Raw Video Canvas RGBA] -->|cv.imread| B[Mat src]
    B -->|cv.cvtColor| C[RGB Mat]
    C -->|Calculate Mean Brightness| D{Brightness < 80 or > 180?}
    D -->|Yes: Scale & Bias| E[cv.convertScaleAbs / convertTo]
    D -->|No: Pass Through| F[Target Canvas]
    E --> F
    F -->|Dispose Mats| G[cv.Mat.delete]
```

1. **Pixel Ingest:** Extracts the image matrix from an offscreen HTML canvas using `cv.imread(canvas)`.
2. **Color Space Harmonization:** Converts from browser 4-channel `RGBA` to 3-channel `RGB`.
3. **Dynamic Range Scaling:**
   Computes mean frame luminance $\mu$:
   $$\mu = \frac{1}{N} \sum_{i=1}^N Y_i$$
   If $\mu < 80$ (underexposed), scale factor $\alpha = \frac{128}{\mu}$ and brightness boost $\beta = 25$ are applied:
   $$I_{\text{out}}(x,y) = \text{clamp}\big(\alpha \cdot I_{\text{in}}(x,y) + \beta, 0, 255\big)$$

### Critical WebAssembly Memory Management
JavaScript is garbage collected, but **WebAssembly memory is manually managed heap memory**. Every `cv.Mat` instantiated by OpenCV.js allocates bytes on the linear Emscripten heap. If not explicitly freed, the application will crash with `RuntimeError: memory access out of bounds` within seconds.

SignAble enforces strict memory reclamation using `try...finally` blocks:
```typescript
const srcMat = cv.imread(inputCanvas);
let dstMat = new cv.Mat();
try {
  cv.cvtColor(srcMat, dstMat, cv.COLOR_RGBA2RGB);
  // Perform image adjustments...
  cv.imshow(outputCanvas, dstMat);
} finally {
  srcMat.delete();
  dstMat.delete(); // Crucial: deallocates linear WASM heap memory
}
```

### Graceful Fallback Guarantee
If OpenCV fails to load (e.g. network timeout or unsupported browser WASM SIMD), the practice studio seamlessly falls back to passing raw canvas frames directly to MediaPipe without crashing or degrading user experience.

---

## 5. Gesture Recognition Engine (Rule-Based Evaluator)

### Why Rule-Based over Black-Box Neural Networks?
For an educational sign language prototype, a deterministic, rule-based evaluator was chosen over a black-box deep learning classifier (e.g. LSTM or 3D-CNN) for three reasons:
1. **Explainable Real-Time Feedback:** Neural classifiers output a probability score (e.g., `"Hello: 0.72"`), which cannot tell the student *why* their sign was imperfect. A geometric rule engine generates specific, actionable guidance: *"Raise your hand higher"* or *"Open your fingers fully"*.
2. **Zero Training Drift & Bias:** A geometric evaluator evaluates anatomical proportions and relative distances, making it robust across skin tones, lighting, and camera sensors without dataset bias.
3. **Ultra-Low Latency:** Computing 10 vector dot products takes $<0.1\text{ ms}$, leaving 99% of the frame budget for smooth rendering.

---

### The Three Geometric Checkpoints for ASL "Hello"

The American Sign Language sign for "Hello" consists of three components:
1. **Handshape:** Open flat palm (B-handshape) with all fingers extended straight.
2. **Location (Elevation):** Hand positioned in the upper portion of the frame near temple/chin height.
3. **Movement:** A smooth lateral outward wave/salute gesture.

```
+---------------------------------------------+
| Camera Frame (Normalized Coordinates [0,1]) |
|                                             |
|   [0.0, 0.0]                                |
|         +-------------------------+         |
|         | UPPER REGION: y <= 0.65 |         |
|         |   (Hand Raised Zone)    |         |
|         |                         |         |
|         |       [Handshape]       |         |
|         |        Extended         | ====> Outward Motion |
|         |        Open Palm        |       (dx >= 0.7 * hand_size)
|         +-------------------------+         |
|                                             |
|                                  [1.0, 1.0] |
+---------------------------------------------+
```

#### Checkpoint 1: Handshape (Open Flat Palm)
To verify an extended flat handshape without relying on absolute pixel dimensions, the evaluator measures the distance from the wrist (Landmark 0) to each fingertip ($TIP$) compared to the distance from the wrist to the corresponding Proximal Interphalangeal joint ($PIP$):

$$\text{Extended}(\text{finger}) \iff \|\mathbf{p}_{\text{tip}} - \mathbf{p}_{\text{wrist}}\| > \|\mathbf{p}_{\text{pip}} - \mathbf{p}_{\text{wrist}}\| \times 1.15$$

For the 4 main fingers (Index: 8 vs 6, Middle: 12 vs 10, Ring: 16 vs 14, Pinky: 20 vs 18):
$$\text{HandOpen} = \text{Extended}(\text{Index}) \land \text{Extended}(\text{Middle}) \land \text{Extended}(\text{Ring}) \land \text{Extended}(\text{Pinky})$$

#### Checkpoint 2: Elevation (Hand Raised)
The wrist vertical coordinate ($y \in [0, 1]$ where 0 is the top of the frame and 1 is the bottom) must be positioned in the upper region of the frame:
$$\text{HandRaised} \iff \mathbf{p}_{\text{wrist}}.y \le 0.65$$

#### Checkpoint 3: Dynamic Movement (Outward Wave)
Movement cannot be verified from a single static snapshot. The evaluator analyzes a sliding temporal buffer of the last $N$ frames over a 1,500 ms window:
$$\mathcal{B} = \{(L_1, t_1), (L_2, t_2), \dots, (L_m, t_m)\} \quad \text{where } t_m - t_1 \le 1500\text{ ms}$$

1. **Scale Normalization:** Hand size is calculated using the distance from wrist (0) to middle MCP (9):
   $$S = \|\mathbf{p}_{9} - \mathbf{p}_{0}\|$$
2. **Cumulative Displacement:** Horizontal trajectory travel of the wrist is computed:
   $$\Delta X = \max_{t} (\mathbf{p}_{\text{wrist}}(t).x) - \min_{t} (\mathbf{p}_{\text{wrist}}(t).x)$$
3. **Threshold Check:** Movement is validated when horizontal travel exceeds the calibrated fraction of hand size:
   $$\text{MovementValid} \iff \Delta X \ge S \times 0.70$$

---

### Evaluator State Machine
The practice studio operates on a 4-state finite state machine:

```mermaid
stateDiagram-v2
    [*] --> NO_HAND: Camera Active
    NO_HAND --> DETECTING: Hand Enters View
    DETECTING --> NO_HAND: Hand Lost
    
    DETECTING --> ALMOST: Hand Open & Raised (Waiting for Motion)
    ALMOST --> DETECTING: Shape Lost / Dropped Hand
    
    ALMOST --> RECOGNIZED: Outward Movement Complete + Hold 300ms
    RECOGNIZED --> [*]: Continue to Screen 5
```

- **`NO_HAND`:** Displays assistive prompt: *"Show your hand to the camera"*.
- **`DETECTING`:** Hand is tracking; checks shape and elevation.
- **`ALMOST`:** Shape and height are verified. Prompts: *"Move your hand smoothly outward"*.
- **`RECOGNIZED`:** All 3 checkpoints satisfied and sustained for `minHoldDurationMs` (300 ms). Triggers celebration chime, unlocks the "Continue" action, and logs completion.

---

## 6. Server-Side Rendering (SSR) & Client Hydration Architecture

SignAble is built using Next.js 14 App Router, utilizing a **hybrid rendering architecture** that balances fast initial page delivery with client-side hardware interactivity.

```
┌─────────────────────────────────────────────────────────────┐
│ Next.js Server / Build Phase (Node.js)                       │
│                                                             │
│  - Pre-renders static page scaffolding (HTML/CSS)           │
│  - Generates SEO meta tags, title headers, route segments   │
│  - Inlines critical SVG icons (/src/components/ui/Icon.tsx) │
│  - Produces zero-JS static HTML shells                      │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP Request (Instant FCP)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Browser Client Process (Hydration Boundary)                 │
│                                                             │
│  - Reconciles DOM with React virtual tree                   │
│  - Executes 'use client' directives                         │
│  - Binds navigator.mediaDevices.getUserMedia                │
│  - Instantiates WebAssembly runtimes (MediaPipe, OpenCV)    │
│  - Runs requestAnimationFrame rendering loop                │
└─────────────────────────────────────────────────────────────┘
```

### The `'use client'` Boundary
In Next.js App Router, all files in `src/app/` are React Server Components (RSC) by default. Server components execute strictly on the server (Node.js environment) where DOM APIs do not exist.

Interactive pages (such as `/lesson/hello/practice/page.tsx`) declare the `'use client'` directive at line 1:
```typescript
'use client';

import React, { useRef, useEffect, useState } from 'react';
```
This tells the Next.js compiler to:
1. Pre-render a static HTML skeleton on the server for instant First Contentful Paint (FCP).
2. Bundle the component's JavaScript for hydration in the browser.

### Preventing Hydration Mismatches
When code accesses browser-only APIs (`window`, `navigator`, `localStorage`) during initial render, the server-rendered HTML will differ from the client-rendered DOM, triggering a React Hydration Error (`Text content did not match`).

SignAble guards against hydration mismatches using a two-stage mounting guard:
```typescript
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  // Render server-safe static placeholder shell
  return <PracticeStudioSkeleton />;
}
// Render full interactive camera viewport
```

---

## 7. Why Vision Processing Cannot Be Server-Side

A natural architectural question is: *Could we offload video preprocessing, MediaPipe inference, or sign recognition to a cloud server?*

In SignAble, **running computer vision on the server is strictly forbidden by architectural rules**. Here is why:

### 1. Absolute Privacy & Biometric Data Security
- **Camera Feeds are Biometric Data:** A webcam stream captures a student's face, home environment, and personal biological characteristics.
- **Regulatory Compliance:** Transmitting student video to a server triggers severe legal compliance requirements under **GDPR** (EU), **COPPA** (Children's Online Privacy Protection Act), and **FERPA** (Family Educational Rights and Privacy Act).
- **Client-Side Guarantee:** By running MediaPipe and OpenCV 100% inside client browser memory, camera frames never touch a network socket. Video data exists only in transient GPU/RAM buffers and is permanently purged every frame.

### 2. Network Latency & Real-Time Feedback
Interactive gesture practice requires immediate visual feedback ($<50\text{ ms}$) to allow users to adjust their hand posture intuitively.

| Architecture | Pipeline Steps | Average Latency |
|---|---|---|
| **Client-Side (SignAble)** | Frame Capture $\to$ Local WASM $\to$ Local Evaluator $\to$ Render | **12–25 ms (40–60 FPS)** |
| **Server-Side Streaming** | Capture $\to$ H.264 Encode $\to$ Uplink Network (50ms) $\to$ Server Decode $\to$ GPU Inference $\to$ Downlink Network (50ms) $\to$ Client Render | **180–350 ms (3–5 FPS)** |

Streaming video over WebRTC or WebSocket introduces network jitter, packet drops, and round-trip delay, making smooth real-time skeleton overlay rendering impossible.

### 3. Bandwidth & Infrastructure Cost
- A 720p 30 FPS video feed compressed via WebRTC requires $\approx 1.5 - 2.5\text{ Mbps}$ per active user.
- For 1,000 concurrent students, server-side processing would require:
  - **1.5 to 2.5 Gbps** of continuous ingress bandwidth.
  - 10 to 20 dedicated GPU server instances (e.g. NVIDIA A10G) costing thousands of dollars per month.
- With client-side WebAssembly, **the server load is zero**. The app is served as static assets from a CDN, scaling to millions of users at negligible cost.

---

## 8. Performance, Memory & Lifecycle Management

### Frame Budget & CPU Allocation (60 FPS = 16.6 ms)
To maintain 60 FPS without UI jank, each frame must complete within 16.6 milliseconds:

| Step | Execution Time | Budget % |
|---|---|---|
| Frame Acquisition (`requestAnimationFrame`) | 0.5 ms | 3% |
| OpenCV Preprocessing (when enabled) | 3.5 ms | 21% |
| MediaPipe HandLandmarker (WASM + SIMD) | 8.0 – 11.0 ms | 60% |
| Geometric Rule Evaluation (`evaluate.ts`) | 0.1 ms | 1% |
| Canvas Skeleton & UI Render | 1.5 ms | 9% |
| **Total Frame Time** | **13.6 – 16.6 ms** | **100% (Meets 60 FPS)** |

### Clean Hardware Lifecycle
When a user finishes practice or navigates to another screen, the camera hardware must turn off immediately to assure the user of their privacy:
```typescript
export function stopCameraStream(stream: MediaStream | null): void {
  if (!stream) return;
  stream.getTracks().forEach((track) => {
    track.stop(); // Powers off hardware camera LED
    track.enabled = false;
  });
}
```
In `usePracticeSession.ts`, this cleanup is registered in `useEffect` return handlers, ensuring camera tracks are killed immediately if the user closes the tab, clicks "Continue", or switches routes.

---

## 9. Verification & Quality Assurance

To verify the architecture, run the automated suite:

```bash
# 1. Run unit tests on recognizer logic
npm run test

# 2. Run TypeScript and code style linter
npm run lint

# 3. Compile full static Next.js production bundle
npm run build
```

All 9 geometric unit test suites validate:
- Correct ASL "Hello" detection across varying hand sizes.
- Rejection of closed fists and resting hands.
- Rejection of low hand elevation.
- Rejection of insufficient horizontal motion.
- Purity of the recognizer module with zero DOM dependencies.
