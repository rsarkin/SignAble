import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export default function LearningPathPage() {
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
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
            <div className="flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full font-label-md text-label-md shadow-[0_2px_0_0_#ffb5a0]">
              <Icon name="fire" className="w-4 h-4 text-secondary shrink-0" />
              <span className="font-bold">1 day</span>
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
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-5rem)]">
        <div className="flex flex-col w-full">
          <div className="w-full bg-[#DDF4FF] py-space-xl px-margin min-h-[calc(100vh-5rem)] flex justify-center">
            <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              
              {/* Center Learning Pathway */}
              <div className="lg:col-span-8 flex flex-col items-center">
                
                {/* Header Banner */}
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-[0_4px_0_0_#d0e4ed] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md mb-space-xl">
                  <div className="flex items-center gap-space-md">
                    <div className="w-14 h-14 rounded-xl bg-tertiary-container flex items-center justify-center text-tertiary shadow-[0_3px_0_0_#88ceff] shrink-0">
                      <Icon name="school" className="w-8 h-8 text-tertiary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-label-md text-label-md bg-primary-container text-on-primary-container px-space-sm py-0.5 rounded-full font-bold">
                          Unit 1
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant font-bold">
                          Core Fundamentals
                        </span>
                      </div>
                      <h1 className="font-headline-lg text-headline-lg text-[#111111] mt-1 font-extrabold">
                        Foundational Greetings
                      </h1>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded-lg shrink-0">
                    <Icon name="check_circle" className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-label-md text-label-md text-on-surface font-bold">0 / 5 Completed</span>
                  </div>
                </div>

                {/* Pathway Track */}
                <div className="relative w-full flex flex-col items-center">
                  
                  {/* NODE 1: Hello (ACTIVE & FEATURED) */}
                  <div className="relative z-10 flex flex-col items-center mb-space-xl w-full">
                    {/* Featured Action Card Attached to Node 1 */}
                    <div className="w-full bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-[0_6px_0_0_#c4dfed] relative overflow-hidden transition-all duration-200">
                      <div className="absolute top-0 left-0 h-2 w-full bg-[#A5ED6E]"></div>
                      <div className="flex flex-col md:flex-row gap-space-md items-start">
                        {/* Preview Visual */}
                        <div className="w-full md:w-44 h-36 rounded-lg bg-tertiary-container relative flex items-center justify-center overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt="Visual demonstration for Hello"
                            className="w-full h-full object-cover"
                            src="/media/screen1.jpg"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                            <span className="font-caption text-caption text-surface-container-lowest flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full font-bold">
                              <Icon name="videocam" className="w-3.5 h-3.5 text-primary-container shrink-0" /> ASL Sign
                            </span>
                          </div>
                        </div>

                        {/* Card Content Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-space-xs mb-2">
                              <span className="font-label-md text-label-md text-on-tertiary-container bg-tertiary-container px-2.5 py-0.5 rounded-full font-bold">
                                3 min
                              </span>
                              <span className="font-label-md text-label-md text-on-primary-container bg-primary-container px-2.5 py-0.5 rounded-full font-bold">
                                Beginner
                              </span>
                              <span className="font-label-md text-label-md text-on-secondary-fixed bg-secondary-fixed px-2.5 py-0.5 rounded-full font-bold">
                                Camera practice
                              </span>
                            </div>
                            <h2 className="font-headline-md text-headline-md text-[#111111] font-bold">
                              Lesson 1: Hello
                            </h2>
                            <p className="font-body-md text-body-md text-[#3C3C3C] mt-1 leading-relaxed">
                              Master your very first greeting in sign language through interactive visual demonstration and live camera feedback.
                            </p>
                          </div>

                          {/* Chunky Physical Buttons */}
                          <div className="mt-space-md pt-2 flex flex-col sm:flex-row items-center gap-space-sm">
                            <Link
                              className="w-full sm:w-auto flex-1 min-h-[48px] bg-[#A5ED6E] text-[#111111] font-label-lg text-label-lg rounded-xl px-space-lg flex items-center justify-center gap-space-xs shadow-[0_4px_0_0_#72B043] active:translate-y-1 active:shadow-[0_1px_0_0_#72B043] transition-all font-extrabold hover:brightness-105"
                              href="/lesson/hello/intro"
                            >
                              <Icon name="play_circle" className="w-5 h-5 text-[#111111] shrink-0" />
                              <span>Start Lesson</span>
                            </Link>
                            <Link
                              className="w-full sm:w-auto min-h-[48px] bg-surface-container-low text-on-surface font-label-md text-label-md rounded-xl px-space-md flex items-center justify-center gap-1.5 shadow-[0_4px_0_0_#d0e4ed] active:translate-y-1 active:shadow-[0_1px_0_0_#d0e4ed] transition-all hover:bg-surface-container font-bold"
                              href="/lesson/hello/watch"
                            >
                              <Icon name="visibility" className="w-4 h-4 text-tertiary shrink-0" />
                              <span>Watch Sign</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-4 flex flex-col gap-space-md sticky top-28">
                {/* Daily Target Card */}
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-[0_4px_0_0_#d0e4ed]">
                  <div className="flex items-center justify-between pb-space-sm">
                    <div className="flex items-center gap-space-xs">
                      <Icon name="flag" className="w-5 h-5 text-secondary shrink-0" />
                      <h3 className="font-headline-md text-[18px] text-[#111111] font-bold">Daily Target</h3>
                    </div>
                    <span className="font-caption text-caption text-secondary font-bold bg-secondary-fixed px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="mt-2 bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container shrink-0">
                        <Icon name="play_lesson" className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-label-md text-label-md text-[#111111] font-bold">Today&apos;s Goal</p>
                        <p className="font-caption text-caption text-on-surface-variant font-semibold">Complete 1 Lesson</p>
                      </div>
                    </div>
                    <span className="font-label-lg text-label-lg text-primary font-bold">0 / 1</span>
                  </div>
                  <div className="mt-space-sm">
                    <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                      <div className="h-full bg-primary-container rounded-full w-[10%]"></div>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant mt-1.5 flex justify-between font-semibold">
                      <span>Ready to start</span>
                      <span>10% Ready</span>
                    </p>
                  </div>
                </div>

                {/* Streak Card */}
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-[0_4px_0_0_#d0e4ed] flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center shadow-[0_3px_0_0_#ffb5a0] shrink-0">
                      <Icon name="fire" className="w-7 h-7 text-secondary" />
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface-variant font-semibold">Consistent Routine</p>
                      <h4 className="font-headline-md text-headline-md text-[#111111] font-bold">Streak: 1 Day</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-caption text-caption text-secondary font-extrabold uppercase tracking-wide">
                      Committed
                    </span>
                  </div>
                </div>

                {/* Accessibility Tip Card */}
                <div className="w-full bg-tertiary-container/30 rounded-xl p-space-md shadow-[0_4px_0_0_#b5dfff]">
                  <div className="flex items-start gap-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-tertiary-container flex items-center justify-center text-tertiary shrink-0">
                      <Icon name="lightbulb" className="w-5 h-5 text-tertiary" />
                    </div>
                    <div>
                      <h4 className="font-label-lg text-label-lg text-on-tertiary-container font-bold flex items-center gap-1">
                        Accessibility Tip
                      </h4>
                      <p className="font-body-md text-body-md text-[#3C3C3C] mt-1 leading-snug text-sm">
                        Practice in good, front-facing lighting for smooth hand motion and gesture recognition. Avoid backlighting.
                      </p>
                    </div>
                  </div>
                  <div className="mt-space-sm pt-space-xs flex items-center justify-between">
                    <span className="font-caption text-caption text-tertiary flex items-center gap-1 font-bold">
                      <Icon name="videocam" className="w-3.5 h-3.5" /> Studio calibrated
                    </span>
                    <Link className="font-label-md text-label-md text-tertiary hover:underline font-bold" href="/lesson/hello/practice">
                      Test Camera
                    </Link>
                  </div>
                </div>

                {/* Module Progress Snapshot */}
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-[0_4px_0_0_#d0e4ed]">
                  <div className="flex items-center justify-between pb-space-sm">
                    <h4 className="font-label-lg text-label-lg text-[#111111] font-bold">Module Progress</h4>
                    <span className="font-caption text-caption text-on-surface-variant font-semibold">Unit 1 of 6</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    <div className="flex flex-col items-center p-2 rounded-lg bg-primary-container/20">
                      <span className="font-caption text-caption text-primary font-bold">L1</span>
                      <Icon name="radio_button_checked" className="w-4 h-4 text-primary mt-1" />
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg bg-surface-container-low opacity-60">
                      <span className="font-caption text-caption text-outline font-bold">L2</span>
                      <Icon name="lock" className="w-4 h-4 text-outline mt-1" />
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg bg-surface-container-low opacity-60">
                      <span className="font-caption text-caption text-outline font-bold">L3</span>
                      <Icon name="lock" className="w-4 h-4 text-outline mt-1" />
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg bg-surface-container-low opacity-60">
                      <span className="font-caption text-caption text-outline font-bold">L4</span>
                      <Icon name="lock" className="w-4 h-4 text-outline mt-1" />
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg bg-surface-container-low opacity-60">
                      <span className="font-caption text-caption text-outline font-bold">L5</span>
                      <Icon name="lock" className="w-4 h-4 text-outline mt-1" />
                    </div>
                  </div>
                  <div className="mt-space-md p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
                    <span className="font-caption text-caption text-on-surface-variant font-semibold">
                      No XP system: Mastery driven
                    </span>
                    <Icon name="verified" className="w-4 h-4 text-primary" />
                  </div>
                </div>

              </div>

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
