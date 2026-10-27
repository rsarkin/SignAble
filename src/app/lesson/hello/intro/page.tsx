import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export default function LessonIntroPage() {
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
      {/* Fixed Header */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-[1200px] mx-auto px-margin flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <Link className="flex items-center gap-space-sm" href="/">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary font-black text-xl shadow-sm">
                S
              </div>
              <span className="font-headline-md text-headline-md text-on-surface font-extrabold tracking-tight">
                SignAble
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full shadow-[0_2px_0_0_#ffb5a0]">
              <Icon name="fire" className="w-4 h-4 text-secondary shrink-0" />
              <span className="font-label-md text-label-md font-bold">1 day</span>
            </div>
            <div className="flex items-center gap-space-xs pl-space-xs">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <Icon name="person" className="w-4 h-4 text-on-primary" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          <div className="w-full bg-tertiary-container/30 py-space-xl px-margin flex items-center justify-center relative overflow-hidden min-h-[calc(100vh-5rem)]">
            {/* Atmospheric subtle background shapes */}
            <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-primary-container/20 blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-16 -right-12 w-80 h-80 rounded-full bg-tertiary-fixed-dim/20 blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-[760px] mx-auto flex flex-col items-center">
              
              {/* Top Navigation */}
              <div className="w-full flex items-center justify-between pb-space-sm">
                <Link
                  className="inline-flex items-center gap-1.5 text-on-tertiary-container font-label-lg text-label-lg group transition-transform active:translate-y-0.5 font-bold"
                  href="/"
                >
                  <Icon name="arrow_back" className="w-4 h-4 transition-transform group-hover:-translate-x-1 shrink-0" />
                  <span className="underline decoration-2 underline-offset-4 group-hover:text-primary">
                    Back to Path
                  </span>
                </Link>
                <div className="flex items-center gap-1.5 bg-surface-container-lowest px-space-sm py-space-xs rounded-full shadow-[0_2px_0_0_#dcd9d9]">
                  <Icon name="verified" className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-label-md text-label-md text-on-surface-variant font-bold">
                    Level 1: Academic ASL
                  </span>
                </div>
              </div>

              {/* Main Stage Card */}
              <section className="w-full bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-[0_8px_24px_rgba(0,101,144,0.08)] flex flex-col items-center text-center relative mt-space-sm">
                {/* Overline Badge */}
                <span className="font-label-md text-label-md text-on-tertiary-container bg-tertiary-fixed px-space-md py-space-xs rounded-full uppercase tracking-wider mb-space-sm shadow-[0_2px_0_0_#88ceff] font-bold">
                  Foundations • Unit 01
                </span>

                {/* Heading */}
                <h1 className="font-headline-xl text-headline-xl text-on-surface mb-space-xs tracking-tight flex items-center justify-center gap-space-xs flex-wrap font-extrabold">
                  <span>Sign:</span>
                  <span className="text-tertiary underline decoration-2 underline-offset-4">Hello</span>
                </h1>

                {/* Subtitle */}
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[540px] mb-space-lg leading-relaxed font-semibold">
                  Master the greeting in 3 easy steps
                </p>

                {/* 3 Step Progression */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-space-sm mb-space-lg text-left">
                  {/* Step 1: Watch */}
                  <div className="bg-surface-container-low hover:bg-surface-container rounded-xl p-space-md transition-all flex flex-col items-center text-center justify-between shadow-[0_3px_0_0_#dcd9d9]">
                    <div className="w-full flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-tertiary text-on-tertiary font-label-md text-label-md flex items-center justify-center font-bold">
                        1
                      </span>
                      <Icon name="play_circle" className="w-5 h-5 text-tertiary shrink-0" />
                    </div>
                    <div className="my-space-md flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-tertiary-container/50 flex items-center justify-center text-tertiary mb-space-xs">
                        <Icon name="visibility" className="w-10 h-10 text-tertiary" />
                      </div>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Watch</h2>
                    </div>
                    <div className="w-full pt-space-xs flex items-center justify-center gap-1.5 bg-surface-container-lowest py-space-xs rounded-lg text-tertiary font-label-md text-label-md shadow-sm font-bold">
                      <Icon name="slow_motion_video" className="w-4 h-4 shrink-0" />
                      <span>Demonstration</span>
                    </div>
                  </div>

                  {/* Step 2: Try */}
                  <div className="bg-surface-container-low hover:bg-surface-container rounded-xl p-space-md transition-all flex flex-col items-center text-center justify-between shadow-[0_3px_0_0_#dcd9d9]">
                    <div className="w-full flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md flex items-center justify-center font-bold">
                        2
                      </span>
                      <Icon name="front_hand" className="w-5 h-5 text-secondary shrink-0" />
                    </div>
                    <div className="my-space-md flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary mb-space-xs">
                        <Icon name="sign_language" className="w-10 h-10 text-secondary" />
                      </div>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Try</h2>
                    </div>
                    <div className="w-full pt-space-xs flex items-center justify-center gap-1.5 bg-surface-container-lowest py-space-xs rounded-lg text-secondary font-label-md text-label-md shadow-sm font-bold">
                      <Icon name="pan_tool" className="w-4 h-4 shrink-0" />
                      <span>Hand Shape</span>
                    </div>
                  </div>

                  {/* Step 3: Practice */}
                  <div className="bg-surface-container-low hover:bg-surface-container rounded-xl p-space-md transition-all flex flex-col items-center text-center justify-between shadow-[0_3px_0_0_#dcd9d9]">
                    <div className="w-full flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center font-bold">
                        3
                      </span>
                      <Icon name="check_circle" className="w-5 h-5 text-primary shrink-0" />
                    </div>
                    <div className="my-space-md flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-primary-container/60 flex items-center justify-center text-primary mb-space-xs">
                        <Icon name="videocam" className="w-10 h-10 text-primary" />
                      </div>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Practice</h2>
                    </div>
                    <div className="w-full pt-space-xs flex items-center justify-center gap-1.5 bg-surface-container-lowest py-space-xs rounded-lg text-primary font-label-md text-label-md shadow-sm font-bold">
                      <Icon name="verified" className="w-4 h-4 shrink-0" />
                      <span>AI Feedback</span>
                    </div>
                  </div>
                </div>

                {/* Privacy & Accessibility Callout */}
                <div className="inline-flex items-center gap-space-xs bg-tertiary-container/30 px-space-md py-space-xs rounded-full text-on-tertiary-container font-label-md text-label-md shadow-[0_2px_0_0_#b5dfff] mb-space-md font-bold">
                  <Icon name="shield" className="w-4 h-4 text-tertiary shrink-0" />
                  <span>100% On-Device • Private &amp; Secure</span>
                  <Icon name="lock" className="w-3.5 h-3.5 text-primary shrink-0" />
                </div>

                {/* Call to Action Button */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-space-md pt-space-xs">
                  <Link
                    className="w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center gap-space-sm bg-primary-container text-on-primary-container hover:bg-primary-fixed font-headline-md text-headline-md py-space-sm px-space-lg rounded-xl shadow-[0_4px_0_0_#346b00] active:translate-y-1 active:shadow-[0_1px_0_0_#346b00] transition-all font-extrabold cursor-pointer"
                    href="/lesson/hello/watch"
                  >
                    <span>Start Lesson</span>
                    <Icon name="arrow_forward" className="w-6 h-6 shrink-0" />
                  </Link>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center justify-center gap-space-md mt-space-md text-on-surface-variant font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Icon name="schedule" className="w-4 h-4 text-tertiary shrink-0" />
                    <span className="font-label-md text-label-md">Approx. 3 mins</span>
                  </div>
                  <span className="text-surface-dim">•</span>
                  <div className="flex items-center gap-1.5">
                    <Icon name="closed_caption" className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-label-md text-label-md">Subtitles &amp; Visual Anchors</span>
                  </div>
                </div>
              </section>

              {/* Bottom Quick Vocabulary Preview */}
              <aside className="w-full bg-surface-container-lowest/80 rounded-xl p-space-md mt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm shadow-[0_2px_0_0_#dcd9d9]">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                    <Icon name="lightbulb" className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex items-center gap-space-xs text-left">
                    <span className="font-label-md text-label-md text-on-surface font-bold">Tip:</span>
                    <span className="font-body-md text-body-md text-on-surface-variant font-semibold">
                      Gentle outward salute from temple
                    </span>
                  </div>
                </div>
                <Link
                  className="font-label-md text-label-md text-tertiary hover:underline inline-flex items-center gap-1.5 shrink-0 font-bold"
                  href="/lesson/hello/watch"
                >
                  <Icon name="play_circle" className="w-4 h-4 shrink-0" />
                  <span>Preview</span>
                </Link>
              </aside>

            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low border-t border-surface-container-high/60">
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
