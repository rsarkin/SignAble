# SignAble — Product Requirements Document (Prototype v0.1)

> Status: Draft for owner review. Scope: university project, web prototype.
> Companion files: `AGENTS.md` (rules for the coding agent), `IMPLEMENTATION.md` (technical build spec), `MASTER_PROMPT.md` (prompt to start the build), `SignAble_Product_Brief_MVP.md` (original brief), `duolingo-DESIGN.md` (style tokens).

---

## 1. Summary

SignAble is a proposed accessible-learning product that helps students who rely on sign language engage with academic content through sign-supported lessons and camera-based sign practice.

**This prototype** is deliberately small: a web app with **one lesson ("Hello")** that lets a learner **watch** the sign and **practice** it in front of their webcam, where the browser checks the attempt using hand tracking and gives live feedback.

It is a prototype of a concept. It is **not** a sign-language translator and makes **no accuracy claims**.

## 2. Goals

1. Deliver a clean, polished, working **frontend** that follows the finalized 5-screen flow exactly.
2. Make the Practice Studio genuinely functional for **one sign ("Hello")**: live camera → hand landmarks → rule-based check → on-screen feedback.
3. Be honest and transparent in the UI about what is and isn't implemented.
4. Be easy to explain in a review: every part of the pipeline is understandable and demonstrable.

## 3. Non-goals (do NOT build)

- Any screens beyond the five listed in section 5.
- User accounts, login, database, backend, or any server-side processing.
- XP, points, leaderboards (the brief explicitly excludes an XP system).
- Other lessons, a sign dictionary, quizzes, matching exercises, teacher dashboard, pricing page.
- Continuous sign-language translation or recognition of any sign other than "Hello".
- Uploading, storing, or transmitting camera video anywhere.
- Claims of accuracy, learning outcomes, or user feedback.

Anything not listed in scope requires an explicit decision from the owner first.

## 4. Users and context

- **Primary demo audience:** evaluators / reviewers of the university project.
- **Intended end users (concept):** learners who rely on sign language. Their needs are **not yet validated**; this prototype does not claim they are.
- **Environment:** desktop browser with a webcam (primary); a modern phone browser (secondary, best effort).

## 5. Scope: the five screens (locked)

The screens were designed in Google Stitch (project "SignAble ASL Studio") and are the **visual source of truth**. Do not redesign them.

| # | Screen | Source folder |
|---|---|---|
| 1 | Learning Path | `screens/01_learning_path/` |
| 2 | Lesson Intro | `screens/02_lesson_intro/` |
| 3 | Watch the Sign | `screens/03_watch_the_sign/` |
| 4 | Sign Practice Studio (Redesigned) | `screens/04_sign_practice_studio_redesigned/` |
| 5 | Lesson Complete | `screens/05_lesson_complete/` |

Each folder contains `screen.html` and `screenshot.jpg`. If the HTML and screenshot disagree, the screenshot wins visually and the owner should be told.

## 6. User flow

```
Screen 1 Learning Path → Screen 2 Lesson Intro → Screen 3 Watch the Sign
        → Screen 4 Sign Practice Studio → (sign recognized) → Screen 5 Lesson Complete
        → back to Screen 1
```

Navigation labels and button text follow the Stitch designs. Back/exit behaviour should be minimal and consistent; anything the designs don't show is raised with the owner, not invented.

## 7. Functional requirements

Each requirement has acceptance criteria (AC).

**FR-1 Screens and navigation**
Screens 1–5 are implemented as in the Stitch designs and linked in the flow above.
AC: every primary button advances the flow; visual output matches screenshots at desktop width; layout is usable at tablet and phone widths.

**FR-2 Watch the Sign (Screen 3)**
Shows the reference demonstration for "Hello" with replay and (if present in the design) speed control, with text steps/captions as designed.
AC: video plays, replays, and does not autoplay audio; text alternatives present. If no licensed reference video is available, a clearly marked placeholder is used (see Open Decisions).

**FR-3 Camera access (Screen 4)**
The app requests webcam permission only when the learner enters Practice Studio (or presses the designed start control).
AC: permission prompt appears in context; denial, no camera, or camera-in-use each show a clear, friendly, text-based message and a retry path; camera tracks are stopped when leaving the screen.

**FR-4 Hand tracking and overlay**
Hand landmarks (21 points, one hand) are detected from the live feed and drawn over the mirrored preview.
AC: overlay stays aligned with the hand; runs smoothly (target ≥ 15 FPS on a typical laptop); if no hand is visible the UI says so.

**FR-5 "Hello" check (rule-based)**
The app evaluates landmark data over a short time window against a configurable rule set (hand shape, hand position, movement).
AC: the check outputs one of the states in section 8; each rule's pass/fail is available to the UI for feedback; thresholds live in a single config file; the check is covered by automated unit tests with synthetic landmark data.

**FR-6 Feedback**
Recognition result and per-rule feedback are shown using the elements that exist in the Screen 4 design (e.g. status indicator, checklist). Feedback never relies on colour alone: icon + text + colour.
AC: each state in section 8 has a visible, text-labelled representation within the existing design; helpful, specific retry hints are shown on failure.

**FR-7 Completion**
After a recognized attempt, the learner can continue to Screen 5, then return to Screen 1.
AC: Screen 5 is reachable via recognition; no fake success path exists in production behaviour.

**FR-8 Transparency label**
The Practice Studio carries a visible note that this is a prototype recognizing one sign.
AC: label present in Screen 4 wherever the design places it (or the owner is asked).

## 8. Recognition behaviour

States:

| State | Meaning |
|---|---|
| `no-hand` | No hand detected in the recent window |
| `detecting` | Hand present, not enough criteria met yet |
| `almost` | Some, but not all, criteria met |
| `recognized` | All criteria met within the window |
| `try-again` | Attempt time limit reached without recognition |

Rule groups (initial values are provisional and must be tuned and validated):
1. **Hand shape:** fingers extended (open hand).
2. **Hand position:** hand raised into the upper region of the frame.
3. **Movement:** wrist travels a minimum distance (relative to hand size) within the time window.

Constraints:
- Recognition is **single-hand, single-sign, isolated**.
- The rule definition is **provisional**: it must be checked by a qualified signer before being presented as correct.
- The app must communicate uncertainty and allow unlimited retries.

## 9. Non-functional requirements

- **Privacy:** all processing is in-browser; no video, images, or landmark data leave the device; no analytics on camera data. A short plain-language note is shown before camera access.
- **Performance:** model loads once and is reused; frame loop uses `requestAnimationFrame`; heavy libraries load lazily; app remains usable if optional preprocessing fails to load.
- **Accessibility:** WCAG-minded: sufficient contrast, 44px minimum targets, visible focus, keyboard-operable controls, no audio dependency, captions/text for instructions, `prefers-reduced-motion` respected.
- **Browsers:** current Chrome and Edge (primary); Safari/Firefox best effort. Requires HTTPS or `localhost` for camera access.
- **Offline-friendliness:** model file and WASM assets are served locally from `/public` so the demo does not depend on a network call at presentation time.

## 10. Design requirements

- Follow the Stitch screens pixel-faithfully. Style tokens are in `duolingo-DESIGN.md` (lime `#a5ed6e`, pale blue `#ddf4ff`, accent `#1cb0f6`, charcoal `#3c3c3c`, 12px radius, 10px spacing grid).
- Known contrast cautions from the token file: muted `#777` on pale blue and accent `#1cb0f6` as text both fail contrast; where the design uses them for text, flag to the owner rather than silently altering the design.
- Original SignAble identity: do not use Duolingo's owl, logo, or proprietary assets or font.

## 11. Open decisions (owner must confirm; agent must ask, not assume)

1. **Target sign language and the exact "Hello" sign.** The Stitch project title mentions ASL, but this has not been confirmed as final. The rule config is written to be swappable; the provisional values must be validated by a qualified signer.
2. **Reference video source.** Needs a licensed or self-produced demonstration by a competent signer. Until then, use a clearly marked placeholder. Never generate or fake a signer.
3. **Fallback if live recognition fails during a presentation.** Owner decides policy (e.g. retry, re-lighting, or an openly labelled simulation). Not built by default.
4. **Presentation device and browser.** Determines testing priority.
5. **Deployment target** (local only vs. hosted).

## 12. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Rules misjudge the sign (false pass / false fail) | Provisional label, tuning, signer validation, honest UI copy, unit tests |
| Lighting/background/camera variance | Test matrix in `IMPLEMENTATION.md`; optional OpenCV.js brightness normalization; specific retry hints |
| Position rule is rough (no face landmarks) | Documented limitation; adjustable threshold; possible future addition of pose/face landmarks (out of scope now) |
| Camera permission denied or no camera | Clear messages and retry; no dead ends |
| Slow laptop / low FPS | GPU delegate with CPU fallback; skip preprocessing if FPS drops |
| Demo-day network issues | Local model and WASM assets |
| Overclaiming | Transparency label; claims policy below |

## 13. Demo script (success criteria)

1. Open app → Learning Path → start "Hello" lesson.
2. Watch the sign, replay once.
3. Enter Practice Studio, allow camera, see the hand overlay.
4. Perform a wrong attempt (closed fist or static hand) → see helpful, specific feedback.
5. Perform the sign → state becomes `recognized` → continue → Lesson Complete → back to path.

Success = this script works end-to-end on the presentation machine, repeatedly, in at least two different lighting conditions.

## 14. Claims policy

Allowed: "A prototype that checks one sign ('Hello') using hand-landmark rules in the browser."
Not allowed: any accuracy percentage, "translates sign language," claims of validated learning outcomes, user feedback or market demand, or "no solutions exist." Existing resources (apps, courses, research) must be acknowledged if discussed.
