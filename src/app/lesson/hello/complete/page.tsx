import Link from 'next/link';

export default function LessonCompletePage() {
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
      <main className="w-full min-h-screen bg-surface">
        <div className="flex flex-col w-full">
          <div className="w-full bg-[#DDF4FF] px-gutter py-space-lg flex flex-col items-center justify-start min-h-screen">
            <div className="w-full max-w-4xl mx-auto flex flex-col gap-space-lg">
              
              {/* Top Summary Bar */}
              <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-sm w-full md:w-auto">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">check_circle</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-md text-on-surface font-extrabold">Lesson Completed!</span>
                      <span className="text-headline-md">🎉</span>
                    </div>
                    <span className="font-caption text-on-surface-variant font-bold">Module 1 • Lesson 3 of 3 Finished</span>
                  </div>
                </div>
                <div className="flex items-center gap-space-md w-full md:w-1/2 justify-end">
                  <div className="w-full bg-surface-container-high h-4 rounded-full overflow-hidden p-0.5 relative">
                    <div className="bg-primary-container h-full rounded-full w-full transition-all duration-700 ease-out flex items-center justify-end pr-1">
                      <div className="w-2 h-2 rounded-full bg-surface-container-lowest opacity-75"></div>
                    </div>
                  </div>
                  <span className="font-label-lg text-primary flex-shrink-0 font-extrabold">100%</span>
                </div>
              </div>

              {/* Main Card */}
              <div className="w-full max-w-xl mx-auto bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl text-center relative overflow-hidden flex flex-col items-center shadow-sm">
                <div className="relative mb-space-md">
                  <div className="w-28 h-28 rounded-full bg-primary-container/30 flex items-center justify-center p-2 mx-auto">
                    <div className="w-full h-full rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[48px] text-primary">front_hand</span>
                    </div>
                  </div>
                  <div className="mt-space-sm inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low text-on-surface rounded-full font-bold">
                    <span className="material-symbols-outlined text-[16px] text-primary">workspace_premium</span>
                    <span className="font-label-md text-on-surface">Hello Unlocked</span>
                  </div>
                </div>

                <h1 className="font-headline-xl text-on-surface mb-space-xs font-extrabold">
                  You learned your first sign!
                </h1>
                <p className="font-body-md text-on-surface-variant max-w-md mx-auto mb-space-lg font-semibold">
                  You can now confidently greet friends, mentors, and classmates using sign language.
                </p>

                {/* Academic Progress Summary Box */}
                <div className="w-full bg-surface-container-low rounded-xl p-space-md mb-space-md text-left">
                  <div className="flex items-center justify-between pb-space-xs mb-space-sm">
                    <span className="font-label-md text-on-surface-variant uppercase tracking-wider font-bold">
                      Academic Progress Summary
                    </span>
                    <span className="font-caption text-primary flex items-center gap-1 bg-primary-container/20 px-2 py-0.5 rounded-full font-bold">
                      <span className="material-symbols-outlined text-[14px]">verified</span> Validated
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div className="bg-surface-container-lowest p-space-sm rounded-lg flex items-center gap-space-sm shadow-sm">
                      <div className="w-9 h-9 rounded-lg bg-tertiary-container/40 flex items-center justify-center text-tertiary flex-shrink-0">
                        <span className="material-symbols-outlined text-[20px]">spellcheck</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-caption text-on-surface-variant truncate font-semibold">Signs learned</span>
                        <span className="font-headline-md text-on-surface truncate font-bold">
                          1 <span className="font-body-md text-on-surface-variant font-normal">(Hello)</span>
                        </span>
                      </div>
                    </div>

                    <div className="bg-surface-container-lowest p-space-sm rounded-lg flex items-center gap-space-sm shadow-sm">
                      <div className="w-9 h-9 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary flex-shrink-0">
                        <span className="material-symbols-outlined text-[20px]">ads_click</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-caption text-on-surface-variant truncate font-semibold">Practice attempts</span>
                        <span className="font-headline-md text-on-surface truncate font-bold">1 try</span>
                      </div>
                    </div>

                    <div className="bg-surface-container-lowest p-space-sm rounded-lg flex items-center gap-space-sm shadow-sm">
                      <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant flex-shrink-0">
                        <span className="material-symbols-outlined text-[20px]">schedule</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-caption text-on-surface-variant truncate font-semibold">Time spent</span>
                        <span className="font-headline-md text-on-surface truncate font-bold">3 mins</span>
                      </div>
                    </div>

                    <div className="bg-surface-container-lowest p-space-sm rounded-lg flex items-center gap-space-sm shadow-sm">
                      <div className="w-9 h-9 rounded-lg bg-primary-container/40 flex items-center justify-center text-primary flex-shrink-0">
                        <span className="material-symbols-outlined text-[20px]">star</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-caption text-on-surface-variant truncate font-semibold">Accuracy status</span>
                        <span className="font-headline-md text-on-primary-container truncate font-bold">Recognized</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Callout */}
                <div className="w-full bg-tertiary-container/20 rounded-xl p-space-sm mb-space-lg flex items-center gap-space-sm text-left">
                  <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-tertiary shadow-sm flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">psychology</span>
                  </div>
                  <p className="font-body-md text-on-tertiary-container text-sm font-semibold">
                    Regular practice strengthens muscle memory and visual spatial confidence.
                  </p>
                </div>

                {/* Buttons */}
                <div className="w-full flex flex-col sm:flex-row gap-space-sm">
                  <Link
                    className="w-full order-1 sm:order-2 py-3.5 px-6 rounded-xl bg-primary-container hover:bg-primary-fixed text-on-primary-container font-headline-md shadow-md active:translate-y-0.5 transition-all flex items-center justify-center gap-2 font-bold cursor-pointer"
                    href="/"
                  >
                    <span>Back to Path</span>
                    <span className="material-symbols-outlined text-[22px]">roofing</span>
                  </Link>
                  <Link
                    className="w-full order-2 sm:order-1 py-3.5 px-6 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-md transition-all flex items-center justify-center gap-2 font-bold cursor-pointer"
                    href="/lesson/hello/practice"
                  >
                    <span>Practice Again</span>
                    <span className="material-symbols-outlined text-[22px]">replay</span>
                  </Link>
                </div>
              </div>

              {/* Bottom Badges */}
              <div className="w-full max-w-xl mx-auto flex items-center justify-between px-space-xs text-on-surface-variant font-semibold">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">accessibility_new</span>
                  <span className="font-caption">Tactile Feedback Ready</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-primary">closed_caption</span>
                  <span className="font-caption">Subtitles Enabled</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
