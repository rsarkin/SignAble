# AGENTS.md — Rules for the coding agent (SignAble prototype)

Read this file first, every session. Then read `PRD.md` and `IMPLEMENTATION.md`. If anything here conflicts with a chat message, ask the owner which wins.

## 1. Mission

Build a web app with **five locked screens** and **one working interaction**: a webcam "Hello" sign check using MediaPipe hand landmarks and a rule-based evaluator, preprocessing with OpenCV.js, all in the browser, no backend.

## 2. Source of truth (in priority order)

1. The owner's latest explicit instruction.
2. `PRD.md` (what to build and what not to build).
3. `IMPLEMENTATION.md` (how to build it).
4. `screens/<NN_name>/screenshot.jpg` and `screen.html` (how it must look). Folder: `d:/projects/Signable/screens/`.
5. `docs/duolingo-DESIGN.md` (style tokens) and `docs/SignAble_Product_Brief_MVP.md` (context).

## 3. Hard rules (never break)

1. **Exactly these screens:** 01 Learning Path, 02 Lesson Intro, 03 Watch the Sign, 04 Sign Practice Studio (Redesigned), 05 Lesson Complete. Do not add, remove, merge, split, or redesign screens. Do not add modals, popups, extra states, or features "to be helpful". If something seems missing, ask.
2. **No assumptions.** If a requirement, label, asset, or behaviour is unspecified, stop and ask the owner. Do not guess the sign language, copy text, thresholds' validity, or asset sources.
3. **No backend, no accounts, no database, no XP.**
4. **Privacy:** camera frames and landmarks are processed in the browser only. Never send them anywhere, never store or log them. Stop all camera tracks when leaving Screen 4 and on unmount.
5. **Honesty:** never fake recognition. Recognized must come from the real evaluator. No hidden bypass buttons, no "always succeed" paths in the delivered app. A dev-only test helper is allowed only if the owner approves it explicitly.
6. **No invented facts:** no accuracy numbers, user quotes, statistics, or claims in code, copy, comments, or README.
7. **Do not copy Duolingo assets** (owl, logo, font, artwork). Use the Stitch screens' original look and a free font.
8. **Pin dependency versions** exactly (no `latest`, no ranges). Prefer versions at least two weeks old. Look up the current stable version when installing; don't rely on memory.
9. **Do not modify** anything in `screens/` or `docs/`. Copy what you need into the app.
10. **Never leave the app broken.** Each phase ends with a working build (`npm run build` passes, no console errors on the main flow).

## 4. Tech stack (decided)

- Next.js (App Router) + TypeScript (strict) + Tailwind CSS
- `@mediapipe/tasks-vision` (HandLandmarker, VIDEO mode, `numHands: 1`), pinned
- OpenCV.js for lightweight frame preprocessing, loaded lazily, **optional at runtime** (app must work if it fails to load)
- Vitest for unit tests of the recognizer
- No other runtime dependencies without owner approval

## 5. Architecture rules

- **Separation:** `lib/recognizer` is pure TypeScript with no React or DOM imports, so it can be unit-tested with synthetic data.
- **Config over constants:** all thresholds and the sign definition live in `lib/recognizer/config.ts`. No magic numbers elsewhere.
- **One owner of the camera:** a single hook/service manages `getUserMedia`, the video element, and cleanup.
- **One owner of the model:** create the `HandLandmarker` once, reuse it, `close()` it on teardown.
- **Frame loop:** `requestAnimationFrame`; call `detectForVideo` only when the video has a new frame; timestamps must be strictly increasing.
- **OpenCV memory:** every `cv.Mat` you create must be `.delete()`d in a `finally` block. Leaks are bugs.
- **Mirroring:** mirror the preview for the user with CSS on a wrapper containing both video and overlay canvas. Do not mirror the data. Do not rely on MediaPipe's handedness label.
- **Assets served locally:** model file and WASM files go in `/public` so the demo works offline.

## 6. Code standards

- TypeScript strict, no `any` unless justified in a comment.
- Small components, named exports, clear file names.
- Accessible by default: semantic elements, labels, focus rings, 44px targets, keyboard operation, `aria-live="polite"` for recognition status, `prefers-reduced-motion` respected.
- Feedback never relies on colour alone (icon + text + colour).
- User-facing errors are friendly, specific, and offer a next step. No raw error text shown to users.
- Comments explain *why*, not *what*.

## 7. Workflow rules

- Work in the phases defined in `MASTER_PROMPT.md` / `IMPLEMENTATION.md`. Finish and verify a phase before starting the next.
- At the end of each phase, report: what was done, what was verified (commands run, results), what is uncertain, and any questions for the owner.
- Run `npm run lint`, `npm run test`, and `npm run build` before declaring a phase done. Report real output, not assumptions.
- If a command fails, fix the root cause. Do not hide errors, disable lint rules, or delete tests to pass.
- Keep a short `CHANGELOG.md` of decisions and deviations.

## 8. When to stop and ask the owner

- The Stitch HTML and screenshot disagree, or a screen's behaviour is not defined.
- Any need for a new screen, state, dependency, or backend.
- The reference video or any media asset is missing or its licence is unclear.
- The sign language or sign definition is not confirmed.
- A package or API behaves differently from `IMPLEMENTATION.md` (version drift): report what you found.
- Recognition cannot be made reliable within the given rules: report measurements; don't paper over it.

## 9. Definition of done (whole project)

- All five screens match the designs at desktop width and remain usable on tablet and phone.
- Full flow works: 1 → 2 → 3 → 4 → (recognized) → 5 → 1.
- Practice Studio: camera permission handling, overlay, live feedback, recognition all work; camera stops on exit.
- Recognizer unit tests pass; QA matrix in `IMPLEMENTATION.md` is run and results recorded honestly.
- No console errors in the main flow; build passes; no network calls for model or WASM at runtime beyond the app's own origin.
- Transparency label present; no unverified claims anywhere.
- `README.md` explains setup, run, test, limitations, and the open decisions.
