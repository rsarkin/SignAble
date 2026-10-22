import Link from 'next/link';

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
            <div className="flex items-center gap-1 bg-surface-container-high text-secondary px-3 py-1 rounded-full font-label-md text-label-md">
              <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
              <span>1 day</span>
            </div>
            <div className="flex items-center gap-space-xs pl-space-xs">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
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
                    <div className="w-14 h-14 rounded-xl bg-tertiary-container flex items-center justify-center text-tertiary shadow-[0_3px_0_0_#88ceff]">
                      <span className="material-symbols-outlined text-[32px]">school</span>
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
                  <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded-lg">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span className="font-label-md text-label-md text-on-surface font-bold">0 / 5 Completed</span>
                  </div>
                </div>

                {/* Pathway Track */}
                <div className="relative w-full flex flex-col items-center">
                  
                  {/* NODE 1: Hello (ACTIVE & FEATURED) */}
                  <div className="relative z-10 flex flex-col items-center mb-space-xl w-full">
                    {/* Bouncing Tooltip Badge */}
                    <div className="mb-2 animate-bounce flex flex-col items-center">
                      <div className="bg-[#111111] text-surface-container-lowest font-label-lg text-label-lg px-4 py-1.5 rounded-full shadow-[0_4px_0_0_#333333] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary-container text-[20px]">play_arrow</span>
                        <span className="font-bold">START!</span>
                      </div>
                      <div className="w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#111111]"></div>
                    </div>

                    {/* Active Node Disc */}
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-28 h-28 rounded-full bg-primary-container opacity-40 animate-ping pointer-events-none"></span>
                      <Link
                        aria-label="Start Hello Lesson"
                        className="relative w-24 h-24 rounded-full bg-[#A5ED6E] border-4 border-[#111111] shadow-[0_6px_0_0_#111111] active:translate-y-1 active:shadow-[0_2px_0_0_#111111] transition-transform flex flex-col items-center justify-center cursor-pointer group"
                        href="/lesson/hello/intro"
                      >
                        <span className="text-3xl filter drop-shadow">👋</span>
                        <span className="font-label-md text-label-md text-[#111111] font-bold mt-0.5 tracking-tight">
                          Hello
                        </span>
                      </Link>
                    </div>

                    {/* Featured Action Card Attached to Node 1 */}
                    <div className="w-full mt-6 bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-[0_6px_0_0_#c4dfed] relative overflow-hidden transition-all duration-200">
                      <div className="absolute top-0 left-0 h-2 w-full bg-[#A5ED6E]"></div>
                      <div className="flex flex-col md:flex-row gap-space-md items-start">
                        {/* Preview Visual */}
                        <div className="w-full md:w-44 h-36 rounded-lg bg-tertiary-container relative flex items-center justify-center overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt="Visual demonstration for Hello"
                            className="w-full h-full object-cover"
                            src="/media/screen1.jpg"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                            <span className="font-caption text-caption text-surface-container-lowest flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full font-bold">
                              <span className="material-symbols-outlined text-[14px] text-primary-container">videocam</span> ASL Sign
                            </span>
                          </div>
                        </div>

                        {/* Card Content Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-space-xs mb-2">
                              <span className="font-label-md text-label-md text-on-tertiary-container bg-tertiary-container px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                <span>⏱️</span> 3 min
                              </span>
                              <span className="font-label-md text-label-md text-on-primary-container bg-primary-container px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                <span>🌱</span> Beginner
                              </span>
                              <span className="font-label-md text-label-md text-on-secondary-fixed bg-secondary-fixed px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                <span>📷</span> Camera practice
                              </span>
                            </div>
                            <h2 className="font-headline-md text-headline-md text-[#111111] font-bold">
                              Lesson 1: Hello
                            </h2>
                            <p className="font-body-md text-body-md text-[#3C3C3C] mt-1 leading-relaxed">
                              Master your very first greeting in sign language through interactive visual demonstration and live camera feedback.
                            </p>
                          </div>

                          {/* Chunky Physical Button */}
                          <div className="mt-space-md pt-2 flex flex-col sm:flex-row items-center gap-space-sm">
                            <Link
                              className="w-full sm:w-auto flex-1 min-h-[48px] bg-[#A5ED6E] text-[#111111] font-label-lg text-label-lg rounded-xl px-space-lg flex items-center justify-center gap-space-xs shadow-[0_4px_0_0_#72B043] active:translate-y-1 active:shadow-[0_1px_0_0_#72B043] transition-all font-extrabold hover:brightness-105"
                              href="/lesson/hello/intro"
                            >
                              <span className="material-symbols-outlined text-[22px] text-[#111111]">play_circle</span>
                              <span>Start Lesson</span>
                            </Link>
                            <Link
                              className="w-full sm:w-auto min-h-[48px] bg-surface-container-low text-on-surface font-label-md text-label-md rounded-xl px-space-md flex items-center justify-center gap-1 shadow-[0_4px_0_0_#d0e4ed] active:translate-y-1 active:shadow-[0_1px_0_0_#d0e4ed] transition-all hover:bg-surface-container font-bold"
                              href="/lesson/hello/watch"
                            >
                              <span className="material-symbols-outlined text-[20px] text-tertiary">visibility</span>
                              <span>Watch Sign</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Future Nodes (Locked Representation matching Stitch design) */}
                  <div className="flex flex-col items-center gap-8 opacity-65 w-full">
                    {/* Node 2 */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-surface-container-high border-2 border-surface-container-highest shadow-md flex items-center justify-center text-on-surface-variant font-bold">
                        <span className="material-symbols-outlined text-[24px]">lock</span>
                      </div>
                      <span className="font-caption text-caption text-on-surface-variant mt-1 font-bold">2. Numbers 1–5</span>
                    </div>

                    {/* Node 3 */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-surface-container-high border-2 border-surface-container-highest shadow-md flex items-center justify-center text-on-surface-variant font-bold">
                        <span className="material-symbols-outlined text-[24px]">lock</span>
                      </div>
                      <span className="font-caption text-caption text-on-surface-variant mt-1 font-bold">3. Thank You</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-4 flex flex-col gap-space-md sticky top-28">
                {/* Daily Target */}
                <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-[0_4px_0_0_#d0e4ed]">
                  <div className="flex items-center justify-between pb-space-sm">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[24px]">flag</span>
                      <h3 className="font-headline-md text-[18px] text-[#111111] font-bold">Daily Target</h3>
                    </div>
                    <span className="font-caption text-caption text-secondary font-bold bg-secondary-fixed px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="mt-2 bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
                        <span className="material-symbols-outlined text-[22px]">play_lesson</span>
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
                    <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center shadow-[0_3px_0_0_#ffb5a0]">
                      <span className="material-symbols-outlined text-secondary text-[28px]">local_fire_department</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface-variant font-semibold">Consistent Routine</p>
                      <h4 className="font-headline-md text-headline-md text-[#111111] font-bold">Streak: 1 Day 🔥</h4>
                    </div>
                  </div>
                </div>

                {/* Accessible Learning Notice */}
                <div className="w-full bg-tertiary-container/20 rounded-xl p-space-md border border-tertiary-container/40 flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-tertiary text-[22px] mt-0.5">verified_user</span>
                  <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
                    <strong>Browser-Based Learning:</strong> All camera input is processed locally in your browser. No video is ever stored or transmitted.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
