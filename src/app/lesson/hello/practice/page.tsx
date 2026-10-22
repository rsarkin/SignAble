'use client';

import Link from 'next/link';
import { usePracticeSession } from '@/lib/session/usePracticeSession';

export default function SignPracticeStudioPage() {
  const {
    videoRef,
    canvasRef,
    cameraReady,
    cameraError,
    modelReady,
    modelError,
    sessionState,
    checks,
    hint,
    ariaMessage,
    isRecognized,
    fps,
    openCvEnabled,
    openCvAvailable,
    setOpenCvEnabled,
    startVerification,
    resetSession,
    retryCamera,
  } = usePracticeSession();

  const passedChecksCount = [checks.handOpen, checks.handRaised, checks.movement].filter(Boolean).length;

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container">
      {/* Hidden Live Region for Screen Readers */}
      <div aria-live="polite" className="sr-only">
        {ariaMessage || hint}
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-[1200px] mx-auto px-margin-mobile md:px-margin flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <Link
              aria-label="Back to Watch Sign"
              className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors"
              href="/lesson/hello/watch"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div className="flex flex-col">
              <h1 className="font-headline-md text-headline-md text-on-surface flex items-center gap-1.5 font-bold">
                Practice: Hello <span className="text-[20px]">👋</span>
              </h1>
              <span className="font-caption text-caption text-on-surface-variant font-bold">
                ASL Level 1 • Vocabulary
              </span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="hidden sm:flex items-center gap-space-sm bg-surface-container-lowest border border-surface-container-high px-space-md py-1.5 rounded-full shadow-sm">
            <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Step 2 of 3</span>
            <div className="w-28 h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary-container rounded-full w-2/3"></div>
            </div>
            <span className="font-label-md text-label-md font-bold text-on-surface">66%</span>
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-space-xs bg-secondary-fixed text-on-secondary-fixed px-space-sm py-1 rounded-full shadow-[0_2px_0_0_#ffb5a0]">
              <span className="material-symbols-outlined text-secondary text-[20px]">local_fire_department</span>
              <span className="font-label-md text-label-md font-bold">1 day streak</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[20px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Area */}
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-5rem)] flex-1">
        <div className="flex flex-col w-full">
          <div className="w-full bg-[#DDF4FF] px-margin-mobile md:px-margin py-space-md md:py-space-lg">
            <div className="max-w-[1200px] mx-auto flex flex-col gap-space-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                
                {/* Left Column: Live Camera & Landmark Overlay */}
                <div className="lg:col-span-7 flex flex-col gap-space-sm">
                  <div className="relative w-full aspect-[4/3] rounded-2xl bg-[#0f172a] shadow-[0_8px_0_0_#090d16] overflow-hidden select-none flex items-center justify-center border border-white/10">
                    
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e293b] via-[#0f172a] to-[#020617] opacity-80 pointer-events-none"></div>

                    {/* Camera Feed & Canvas with CSS Mirroring */}
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center transform -scale-x-100">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      />
                    </div>

                    {/* Target Hand Guide Silhouette Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-56 h-68 rounded-[44px] border-2 border-dashed border-[#38bdf8]/40 flex flex-col items-center justify-start pt-5 bg-[#38bdf8]/5 backdrop-blur-[1px]">
                        <span className="font-caption text-caption text-[#7dd3fc] bg-[#0369a1]/80 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm font-bold shadow-sm">
                          Target Hand Zone
                        </span>
                      </div>
                    </div>

                    {/* Top-Left: Live Status Badge */}
                    <div className="absolute top-space-md left-space-md z-20 flex items-center gap-space-xs bg-[#0b1324]/85 backdrop-blur-md px-space-sm py-1 rounded-full shadow-[0_2px_0_0_#1e293b] border border-white/10">
                      <span className={`w-2.5 h-2.5 rounded-full ${cameraReady ? 'bg-error animate-ping' : 'bg-gray-400'}`}></span>
                      <span className={`w-2.5 h-2.5 -ml-3.5 rounded-full ${cameraReady ? 'bg-error' : 'bg-gray-400'}`}></span>
                      <span className="font-label-md text-label-md text-[#ffffff] font-bold tracking-wide ml-1">
                        {cameraReady ? 'Live Camera' : 'Starting Camera...'}
                      </span>
                    </div>

                    {/* Top-Right: Hand Detection Status Badge */}
                    <div className="absolute top-space-md right-space-md z-20 flex items-center gap-space-xs bg-[#0b1324]/85 backdrop-blur-md px-space-sm py-1 rounded-full text-primary-container border border-white/10">
                      <span className="material-symbols-outlined text-[18px]">
                        {sessionState !== 'no-hand' ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span className="font-caption text-caption text-[#e2e8f0] font-bold">
                        {sessionState !== 'no-hand' ? 'Hand Detected' : 'No Hand in View'}
                      </span>
                    </div>

                    {/* Bottom-Left: Required Prototype Transparency Notice (PRD FR-8) */}
                    <div className="absolute bottom-14 left-space-md z-20 flex items-center gap-1.5 bg-[#0b1324]/90 backdrop-blur-md px-3 py-1 rounded-lg border border-amber-400/40 text-amber-300 shadow-md">
                      <span className="text-[14px]">⚠️</span>
                      <span className="font-caption text-[11px] font-bold tracking-wide">
                        Prototype: recognizes 1 sign (Hello)
                      </span>
                    </div>

                    {/* Bottom Controls Bar */}
                    <div className="absolute bottom-space-md left-space-md right-space-md z-20 flex items-center justify-between pointer-events-auto">
                      <div className="flex items-center gap-space-xs bg-[#0b1324]/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white font-caption text-caption border border-white/10">
                        <span className="material-symbols-outlined text-primary-container text-[18px]">accessibility_new</span>
                        <span className="font-bold">Mirrored Guidance</span>
                        <span className="text-gray-400 ml-1">| {fps > 0 ? `${fps} FPS` : 'Tracking'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* OpenCV Preprocessing Toggle */}
                        <button
                          aria-label="Toggle OpenCV Preprocessing"
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors border border-white/15 ${
                            openCvEnabled && openCvAvailable
                              ? 'bg-primary-container text-on-primary-container'
                              : 'bg-[#0b1324]/80 text-white hover:bg-[#1e293b]'
                          }`}
                          onClick={() => setOpenCvEnabled(!openCvEnabled)}
                          title={openCvAvailable ? 'Toggle OpenCV Preprocessing' : 'OpenCV Fallback active'}
                          type="button"
                        >
                          CV {openCvEnabled && openCvAvailable ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>

                    {/* Camera Error / Permission Overlay */}
                    {cameraError && (
                      <div className="absolute inset-0 z-30 bg-[#0f172a]/95 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center text-white">
                        <div className="w-14 h-14 rounded-full bg-error/20 text-error flex items-center justify-center mb-3">
                          <span className="material-symbols-outlined text-[32px]">videocam_off</span>
                        </div>
                        <h2 className="font-headline-md text-headline-md font-bold mb-1">{cameraError.title}</h2>
                        <p className="text-sm text-gray-300 max-w-sm mb-2">{cameraError.message}</p>
                        <p className="text-xs text-primary-container max-w-sm mb-4 font-semibold">{cameraError.actionHint}</p>
                        <button
                          className="px-6 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
                          onClick={retryCamera}
                          type="button"
                        >
                          Retry Camera
                        </button>
                      </div>
                    )}

                    {/* Model Error Overlay */}
                    {modelError && (
                      <div className="absolute inset-0 z-30 bg-[#0f172a]/95 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center text-white">
                        <div className="w-14 h-14 rounded-full bg-error/20 text-error flex items-center justify-center mb-3">
                          <span className="material-symbols-outlined text-[32px]">warning</span>
                        </div>
                        <h2 className="font-headline-md text-headline-md font-bold mb-2">Model Loading Issue</h2>
                        <p className="text-sm text-gray-300 max-w-sm mb-4">{modelError}</p>
                        <button
                          className="px-6 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
                          onClick={retryCamera}
                          type="button"
                        >
                          Reload Model
                        </button>
                      </div>
                    )}

                  </div>
                </div>

                {/* Right Column: Reference & Live Evaluator Feedback */}
                <div className="lg:col-span-5 flex flex-col gap-space-md">
                  
                  {/* Instructor Model Reference */}
                  <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-[0_4px_0_0_#d4ecf7] flex flex-col gap-space-sm border border-surface-container-high/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs text-on-surface">
                        <span className="material-symbols-outlined text-tertiary text-[20px]">smart_display</span>
                        <span className="font-label-lg text-label-lg font-bold">Instructor Model</span>
                      </div>
                      <span className="font-caption text-caption font-bold px-space-sm py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container">
                        Sign: Hello
                      </span>
                    </div>

                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-container-highest shadow-[0_2px_0_0_#c1cab5]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt="Instructor demonstrating American Sign Language Hello sign"
                        className="w-full h-full object-cover"
                        src="/media/screen4.jpg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-space-sm justify-between">
                        <div className="flex items-center gap-1.5 text-white font-caption text-caption font-bold">
                          <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
                          <span>Standard Loop</span>
                        </div>
                        <span className="font-caption text-caption text-white bg-black/40 px-2 py-0.5 rounded font-bold">
                          0.75x Speed
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Guide Banner */}
                  <div className="bg-tertiary-fixed/30 p-space-md rounded-2xl shadow-[0_4px_0_0_#88ceff] flex items-center justify-between gap-space-sm border border-tertiary-fixed">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-xl bg-tertiary text-white flex items-center justify-center shrink-0 shadow-sm">
                        <span className="material-symbols-outlined text-[24px]">sign_language</span>
                      </div>
                      <div>
                        <span className="font-caption text-caption text-on-tertiary-fixed-variant uppercase font-extrabold tracking-wider block">
                          Feedback Guide
                        </span>
                        <p className="font-headline-md text-headline-md text-on-tertiary-fixed font-bold">
                          {isRecognized
                            ? '🎉 "Hello" recognized!'
                            : sessionState === 'try-again'
                            ? '⏳ Time reached — click Reset to retry'
                            : hint || '👋 Hand in position — wave outward'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Visual Checkpoints Checklist (Existing UI elements) */}
                  <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-[0_4px_0_0_#d4ecf7] flex flex-col gap-space-sm border border-surface-container-high/60">
                    <div className="flex items-center justify-between pb-1">
                      <h2 className="font-label-lg text-label-lg text-on-surface flex items-center gap-space-xs font-bold">
                        <span className="material-symbols-outlined text-primary text-[20px]">task_alt</span>
                        Visual Checkpoints
                      </h2>
                      <span className="font-label-md text-label-md bg-surface-container px-space-sm py-0.5 rounded-full text-on-surface font-bold">
                        {passedChecksCount}/3 Ready
                      </span>
                    </div>

                    <div className="flex flex-col gap-space-xs">
                      {/* Criterion 1: Open Palm */}
                      <div
                        className={`flex items-center justify-between p-space-sm rounded-xl transition-all ${
                          checks.handOpen
                            ? 'bg-primary-container/20 shadow-[0_2px_0_0_#72b043]'
                            : 'bg-surface-container-low shadow-[0_2px_0_0_#dcd9d9]'
                        }`}
                      >
                        <div className="flex items-center gap-space-sm">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                              checks.handOpen
                                ? 'bg-primary-container text-on-primary-container'
                                : 'bg-surface-container-highest text-on-surface-variant'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {checks.handOpen ? 'check' : 'radio_button_unchecked'}
                            </span>
                          </div>
                          <div>
                            <span className="font-label-md text-label-md text-on-surface font-bold block">
                              1. Open Palm
                            </span>
                            <span className="font-caption text-caption text-on-surface-variant font-semibold">
                              Fingers up, facing forward
                            </span>
                          </div>
                        </div>
                        <span
                          className={`font-caption text-caption font-bold px-2.5 py-0.5 rounded-full ${
                            checks.handOpen
                              ? 'text-on-primary-container bg-primary-container'
                              : 'text-on-surface-variant bg-surface-container-high'
                          }`}
                        >
                          {checks.handOpen ? 'Ready' : 'Waiting'}
                        </span>
                      </div>

                      {/* Criterion 2: Cheek / Temple Level */}
                      <div
                        className={`flex items-center justify-between p-space-sm rounded-xl transition-all ${
                          checks.handRaised
                            ? 'bg-primary-container/20 shadow-[0_2px_0_0_#72b043]'
                            : 'bg-surface-container-low shadow-[0_2px_0_0_#dcd9d9]'
                        }`}
                      >
                        <div className="flex items-center gap-space-sm">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                              checks.handRaised
                                ? 'bg-primary-container text-on-primary-container'
                                : 'bg-surface-container-highest text-on-surface-variant'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {checks.handRaised ? 'check' : 'radio_button_unchecked'}
                            </span>
                          </div>
                          <div>
                            <span className="font-label-md text-label-md text-on-surface font-bold block">
                              2. Cheek / Temple Level
                            </span>
                            <span className="font-caption text-caption text-on-surface-variant font-semibold">
                              Raise hand beside face
                            </span>
                          </div>
                        </div>
                        <span
                          className={`font-caption text-caption font-bold px-2.5 py-0.5 rounded-full ${
                            checks.handRaised
                              ? 'text-on-primary-container bg-primary-container'
                              : 'text-on-surface-variant bg-surface-container-high'
                          }`}
                        >
                          {checks.handRaised ? 'Ready' : 'Waiting'}
                        </span>
                      </div>

                      {/* Criterion 3: Gentle Outward Wave */}
                      <div
                        className={`flex items-center justify-between p-space-sm rounded-xl transition-all ${
                          checks.movement
                            ? 'bg-primary-container/20 shadow-[0_2px_0_0_#72b043]'
                            : 'bg-surface-container-low shadow-[0_2px_0_0_#dcd9d9]'
                        }`}
                      >
                        <div className="flex items-center gap-space-sm">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                              checks.movement
                                ? 'bg-primary-container text-on-primary-container'
                                : 'bg-surface-container-highest text-on-surface-variant'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {checks.movement ? 'check' : 'radio_button_unchecked'}
                            </span>
                          </div>
                          <div>
                            <span className="font-label-md text-label-md text-on-surface font-bold block">
                              3. Gentle Outward Wave
                            </span>
                            <span className="font-caption text-caption text-on-surface-variant font-semibold">
                              Smooth salute motion
                            </span>
                          </div>
                        </div>
                        <span
                          className={`font-caption text-caption font-bold px-2.5 py-0.5 rounded-full ${
                            checks.movement
                              ? 'text-on-primary-container bg-primary-container'
                              : 'text-on-surface-variant bg-surface-container-high'
                          }`}
                        >
                          {checks.movement ? 'Match' : 'Waiting'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Physical Action Buttons */}
                  <div className="flex items-center gap-space-sm pt-space-xs">
                    <button
                      className="h-12 px-space-md rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-lg text-label-lg shadow-[0_4px_0_0_#d0d0d0] active:translate-y-[3px] active:shadow-[0_1px_0_0_#d0d0d0] transition-all flex items-center justify-center gap-space-xs font-bold border border-surface-container-high cursor-pointer"
                      onClick={resetSession}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">replay</span>
                      <span>Reset</span>
                    </button>

                    <button
                      className="flex-1 h-12 px-space-lg rounded-xl bg-primary-container text-[#111111] hover:bg-primary-fixed font-headline-md text-headline-md shadow-[0_4px_0_0_#72b043] active:translate-y-[3px] active:shadow-[0_1px_0_0_#72b043] transition-all flex items-center justify-center gap-space-xs font-extrabold cursor-pointer"
                      onClick={startVerification}
                      type="button"
                    >
                      <span>Check my sign</span>
                      <span className="material-symbols-outlined text-[24px]">bolt</span>
                    </button>
                  </div>

                  {/* Success Banner: Revealed when sign is Recognized! */}
                  {isRecognized && (
                    <div className="bg-primary-container p-space-md rounded-2xl shadow-[0_4px_0_0_#72b043] flex items-center justify-between border-2 border-on-primary-container/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-center gap-space-sm text-[#111111]">
                        <span className="material-symbols-outlined text-[32px] text-on-primary-container">
                          verified
                        </span>
                        <div>
                          <span className="font-label-lg text-label-lg font-extrabold block">
                            Sign Recognized!
                          </span>
                          <span className="font-caption text-caption text-on-primary-container font-semibold">
                            Palm posture and wave verified
                          </span>
                        </div>
                      </div>
                      <Link
                        className="px-space-md py-2.5 bg-on-primary-container text-white font-label-md text-label-md rounded-xl shadow-md hover:brightness-110 font-bold flex items-center gap-1 active:scale-95 transition-all"
                        href="/lesson/hello/complete"
                      >
                        <span>Continue &rarr;</span>
                      </Link>
                    </div>
                  )}

                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low border-t border-surface-container-high">
        <div className="max-w-[1200px] mx-auto px-margin py-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm">
            <span className="font-label-md text-label-md text-on-surface font-bold">SignAble</span>
            <span className="font-caption text-caption text-on-surface-variant font-semibold">
              • Academic Visual Curriculum for Deaf &amp; Hard-of-Hearing Students
            </span>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="font-caption text-caption text-on-surface-variant font-semibold">
              All Visual Feedback Calibrated
            </span>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface font-bold" href="/">
              Pathways
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
