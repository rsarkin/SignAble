'use client';

import React, { useEffect, useState, type MutableRefObject } from 'react';
import type { DebugHudData } from '@/lib/session/usePracticeSession';

interface DebugHUDProps {
  getDebugData: () => DebugHudData;
  renderCountRef: MutableRefObject<number>;
}

export function DebugHUD({ getDebugData, renderCountRef }: DebugHUDProps) {
  const [data, setData] = useState<DebugHudData>(() => getDebugData());

  useEffect(() => {
    // 4 Hz update rate (~250ms) to ensure HUD does not burden the main thread
    const interval = setInterval(() => {
      setData(getDebugData());
    }, 250);

    return () => clearInterval(interval);
  }, [getDebugData]);

  const flags = data.flags;

  return (
    <div
      id="debug-hud"
      className="fixed top-20 right-4 z-50 bg-[#020617]/95 text-[#38bdf8] font-mono text-xs p-3.5 rounded-xl border border-[#38bdf8]/40 shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-md max-w-sm pointer-events-none select-none"
      style={{ minWidth: '270px' }}
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
        <span className="font-bold text-white flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          VISION DEBUG HUD
        </span>
        <span className="text-[10px] bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800">
          ?debug=1
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
        <div className="text-gray-400">Detection p95:</div>
        <div className="text-right font-bold text-white">
          {data.detectionTimeP95 > 0 ? `${data.detectionTimeP95} ms` : '—'}
        </div>

        <div className="text-gray-400">Detection Avg:</div>
        <div className="text-right font-bold text-slate-200">
          {data.detectionTimeAvg > 0 ? `${data.detectionTimeAvg} ms` : '—'}
        </div>

        <div className="text-gray-400">Draw Time:</div>
        <div className="text-right font-bold text-slate-200">
          {data.drawTime >= 0 ? `${data.drawTime} ms` : '—'}
        </div>

        <div className="text-gray-400">Evaluate Time:</div>
        <div className="text-right font-bold text-slate-200">
          {data.evaluateTime >= 0 ? `${data.evaluateTime} ms` : '—'}
        </div>

        <div className="text-gray-400">Loop FPS:</div>
        <div className="text-right font-bold text-emerald-400">
          {data.loopFps} fps
        </div>

        <div className="text-gray-400">Detection FPS:</div>
        <div className="text-right font-bold text-emerald-400">
          {data.detectionFps} fps
        </div>

        <div className="text-gray-400">Long Tasks (&gt;50ms):</div>
        <div className={`text-right font-bold ${data.longTaskCount > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
          {data.longTaskCount}
        </div>

        <div className="text-gray-400">JS Heap (Chrome):</div>
        <div className="text-right font-bold text-slate-200">
          {data.jsHeapUsedMB}
        </div>

        <div className="text-gray-400">React Renders:</div>
        <div className="text-right font-bold text-purple-300">
          {renderCountRef.current}
        </div>

        <div className="text-gray-400">Last Landmark:</div>
        <div className={`text-right font-bold ${data.timeSinceLastLandmarkMs > 500 ? 'text-rose-400' : 'text-slate-200'}`}>
          {data.timeSinceLastLandmarkMs >= 0 ? `${data.timeSinceLastLandmarkMs} ms ago` : 'Never'}
        </div>

        <div className="text-gray-400">Delegate:</div>
        <div className="text-right font-bold text-sky-300">
          {data.delegate}
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-white/10 text-[10px] text-gray-400 flex flex-wrap gap-x-2 gap-y-0.5">
        <span>flags:</span>
        <span className="text-white">cv={flags.cv}</span>
        <span className="text-white">res={flags.res}</span>
        <span className="text-white">overlay={flags.overlay}</span>
        <span className="text-white">fps={flags.fps}</span>
        <span className="text-white">delegate={flags.delegate}</span>
      </div>
    </div>
  );
}
