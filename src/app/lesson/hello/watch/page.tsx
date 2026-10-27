'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export default function WatchTheSignPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(40);
  const [speed, setSpeed] = useState<1 | 0.5>(1);
  const [isMirrored, setIsMirrored] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [isSideAngle, setIsSideAngle] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const stepInterval = speed === 1 ? 60 : 120;
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (isLooping) return 0;
            setIsPlaying(false);
            return 100;
          }
          return prev + 3;
        });
      }, stepInterval);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, isLooping]);

  const togglePlay = () => {
    if (progress >= 100) setProgress(0);
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="bg-[#fbf9f8] font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container">
      {/* Header */}
      <header className="sticky top-0 w-full z-40 bg-surface-container-lowest/90 backdrop-blur-md border-b border-surface-container-highest/60">
        <div className="h-18 py-3 max-w-[960px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              aria-label="Exit lesson"
              className="w-10 h-10 rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-all cursor-pointer"
              href="/"
            >
              <Icon name="close" className="w-5 h-5" />
            </Link>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-tertiary tracking-wide uppercase">Lesson 1 • Greetings</span>
              <h1 className="text-[19px] sm:text-[21px] font-extrabold text-on-surface leading-tight tracking-tight">
                Watch &amp; Learn: Hello
              </h1>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end gap-1.5 w-36 sm:w-44">
              <div className="flex justify-between w-full text-[12px] font-bold text-on-surface-variant">
                <span>Step 1 of 3</span>
                <span className="text-primary font-extrabold">33%</span>
              </div>
              <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-primary-container rounded-full w-1/3 transition-all duration-300"></div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-secondary-fixed/70 text-on-secondary-fixed px-3 py-1 rounded-full text-[13px] font-bold">
              <Icon name="fire" className="w-4 h-4 text-secondary shrink-0" />
              <span>1</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full flex-1 max-w-[960px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Vocabulary Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-tertiary-container/50 text-tertiary flex items-center justify-center font-bold shrink-0">
              <Icon name="waving_hand" className="w-5 h-5 text-tertiary" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-tertiary tracking-wider uppercase">Vocabulary</span>
              <h2 className="text-[20px] font-black text-on-surface tracking-tight">&quot;Hello&quot;</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-surface-container-lowest border border-outline-variant/40 px-3 py-1 rounded-full text-[13px] font-bold text-on-surface-variant shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Open 5 Hand
            </span>
            <span className="inline-flex items-center gap-1.5 bg-surface-container-lowest border border-outline-variant/40 px-3 py-1 rounded-full text-[13px] font-bold text-on-surface-variant shadow-sm">
              <Icon name="near_me" className="w-4 h-4 text-tertiary shrink-0" />
              Forehead Arc
            </span>
            <span className="inline-flex items-center gap-1.5 bg-surface-container-lowest border border-outline-variant/40 px-3 py-1 rounded-full text-[13px] font-bold text-on-surface-variant shadow-sm">
              <Icon name="sentiment_satisfied" className="w-4 h-4 text-secondary shrink-0" />
              Warm Smile
            </span>
          </div>
        </div>

        {/* Hero Video / Demonstration Player */}
        <div className="relative w-full aspect-video sm:aspect-[16/9] rounded-3xl bg-inverse-surface overflow-hidden shadow-xl ring-1 ring-black/5 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Instructor demonstrating the ASL sign for Hello"
            className={`w-full h-full object-cover object-center transition-transform duration-300 ${
              isMirrored ? 'scale-x-[-1]' : ''
            }`}
            src="/media/screen3.jpg"
          />

          {/* Demonstration Notice */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-bold border border-white/10">
              ASL Reference Model
            </span>
          </div>

          {/* Angle switch button */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              className="bg-black/50 hover:bg-black/75 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 border border-white/10 transition-colors shadow-sm cursor-pointer"
              onClick={() => setIsSideAngle(!isSideAngle)}
              type="button"
            >
              <Icon name="360" className="w-4 h-4 shrink-0" />
              <span>{isSideAngle ? 'Front View' : 'Side Profile'}</span>
            </button>
          </div>

          {/* Center Play/Pause Circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              aria-label={isPlaying ? 'Pause demonstration' : 'Play demonstration'}
              className="pointer-events-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              onClick={togglePlay}
              type="button"
            >
              {isPlaying ? (
                <Icon name="pause" className="w-9 h-9 sm:w-11 sm:h-11" />
              ) : (
                <Icon name="play" className="w-9 h-9 sm:w-11 sm:h-11 ml-1" />
              )}
            </button>
          </div>

          {/* Bottom Controls Overlay */}
          <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex flex-col gap-2.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
            {/* Scrub Progress Bar */}
            <div
              className="relative w-full h-2 bg-white/25 hover:bg-white/35 rounded-full cursor-pointer overflow-hidden transition-all"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newProgress = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
                setProgress(newProgress);
              }}
            >
              <div
                className="h-full bg-primary-container rounded-full relative transition-all duration-100"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between gap-3 pt-1 text-white">
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10">
                <button
                  className={`h-7 px-3 rounded-full text-[12px] font-extrabold transition-all cursor-pointer ${
                    speed === 1
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                  onClick={() => setSpeed(1)}
                  type="button"
                >
                  1.0x
                </button>
                <button
                  className={`h-7 px-3 rounded-full text-[12px] font-extrabold transition-all cursor-pointer ${
                    speed === 0.5
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                  onClick={() => setSpeed(0.5)}
                  type="button"
                >
                  0.5x
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className={`h-8 px-3 rounded-full backdrop-blur-md border border-white/10 text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isMirrored
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-black/40 hover:bg-black/60 text-white/90 hover:text-white'
                  }`}
                  onClick={() => setIsMirrored(!isMirrored)}
                  type="button"
                >
                  <Icon name="flip" className="w-4 h-4 shrink-0" />
                  <span>Mirror</span>
                </button>
                <button
                  className={`h-8 w-8 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors cursor-pointer ${
                    isLooping ? 'bg-primary-container text-on-primary-container' : 'bg-black/40 text-white'
                  }`}
                  onClick={() => setIsLooping(!isLooping)}
                  title="Loop playback"
                  type="button"
                >
                  <Icon name="sync" className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Anatomy of the Sign: 3 Checkpoint Cards */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[13px] font-extrabold uppercase tracking-wider text-on-surface-variant">
              3 Checkpoints
            </span>
            <span className="text-[12px] font-bold text-tertiary flex items-center gap-1">
              <Icon name="touch_app" className="w-4 h-4 shrink-0" /> Follow along
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Step 1 */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-surface-container-highest/60 shadow-sm flex sm:flex-col items-center sm:items-start gap-3.5 transition-all hover:border-primary-container hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-tertiary-container/40 text-tertiary flex items-center justify-center shrink-0">
                <Icon name="pan_tool" className="w-6 h-6 text-tertiary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[11px] font-extrabold text-tertiary uppercase tracking-wider">Step 1</span>
                </div>
                <h3 className="text-[16px] font-extrabold text-on-surface leading-snug">Open Palm</h3>
                <p className="text-[13px] font-semibold text-on-surface-variant mt-0.5">Fingers together, relaxed flat 5</p>
              </div>
              <Icon name="check_circle" className="w-5 h-5 text-primary shrink-0 sm:mt-auto sm:pt-2" />
            </div>

            {/* Step 2 */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-surface-container-highest/60 shadow-sm flex sm:flex-col items-center sm:items-start gap-3.5 transition-all hover:border-primary-container hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-primary-container/40 text-on-primary-container flex items-center justify-center shrink-0">
                <Icon name="my_location" className="w-6 h-6 text-on-primary-container" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[11px] font-extrabold text-primary uppercase tracking-wider">Step 2</span>
                </div>
                <h3 className="text-[16px] font-extrabold text-on-surface leading-snug">Temple Touch</h3>
                <p className="text-[13px] font-semibold text-on-surface-variant mt-0.5">Hand 2 inches near forehead</p>
              </div>
              <Icon name="check_circle" className="w-5 h-5 text-primary shrink-0 sm:mt-auto sm:pt-2" />
            </div>

            {/* Step 3 */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-surface-container-highest/60 shadow-sm flex sm:flex-col items-center sm:items-start gap-3.5 transition-all hover:border-primary-container hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-secondary-fixed/50 text-secondary flex items-center justify-center shrink-0">
                <Icon name="waves" className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[11px] font-extrabold text-secondary uppercase tracking-wider">Step 3</span>
                </div>
                <h3 className="text-[16px] font-extrabold text-on-surface leading-snug">Gentle Wave</h3>
                <p className="text-[13px] font-semibold text-on-surface-variant mt-0.5">Smooth outward salute arc</p>
              </div>
              <Icon name="check_circle" className="w-5 h-5 text-primary shrink-0 sm:mt-auto sm:pt-2" />
            </div>
          </div>
        </div>

        {/* Bottom Floating Action Bar */}
        <div className="sticky bottom-4 z-30 mt-2 bg-surface-container-lowest/95 backdrop-blur-md border border-surface-container-highest/80 rounded-2xl p-3 sm:p-4 shadow-xl flex items-center justify-between gap-3">
          <button
            className="h-12 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-bold text-[14px] flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            onClick={handleReplay}
            title="Replay video demonstration"
            type="button"
          >
            <Icon name="replay" className="w-5 h-5 text-tertiary shrink-0" />
            <span className="hidden sm:inline">Replay</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-[12px] font-bold text-on-surface-variant mr-2">
              Ready to test your hand?
            </span>
            <Link
              className="h-13 py-3 px-7 sm:px-9 rounded-2xl bg-primary-container text-on-primary-container font-extrabold text-[16px] sm:text-[17px] flex items-center justify-center gap-2.5 shadow-[0_4px_0_0_#346b00] active:translate-y-1 active:shadow-none hover:brightness-105 transition-all text-center tracking-tight cursor-pointer"
              href="/lesson/hello/practice"
            >
              <span>I&apos;m ready to try</span>
              <Icon name="arrow_forward" className="w-5 h-5 shrink-0" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-[12px] font-bold text-on-surface-variant/70 border-t border-surface-container-high/40">
        SignAble • Academic Visual Curriculum for Deaf &amp; Hard-of-Hearing Students
      </footer>
    </div>
  );
}
