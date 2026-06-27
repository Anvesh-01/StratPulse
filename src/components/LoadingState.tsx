'use client';

import { Radar } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      {/* Radar sweep animation */}
      <div className="relative w-24 h-24">
        {/* Outer rings */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-2 rounded-full border border-blue-400/30" />
        <div className="absolute inset-4 rounded-full border border-blue-300/20" />
        <div className="absolute inset-6 rounded-full border border-blue-200/10" />
        {/* Sweep */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{ animation: 'spin 2s linear infinite' }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(59,130,246,0.4) 60deg, transparent 60deg)',
            }}
          />
        </div>
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Radar size={22} className="text-blue-500" />
        </div>
      </div>

      {/* Animated dots text */}
      <div className="text-center space-y-2">
        <p className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
          Scanning Intelligence
          <span className="flex gap-0.5 mt-0.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1 h-1 rounded-full bg-blue-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        </p>
        <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
          <p className="animate-pulse">📡 Fetching live news articles</p>
          <p className="animate-pulse" style={{ animationDelay: '0.5s' }}>🧠 Running Gemini AI sentiment analysis</p>
          <p className="animate-pulse" style={{ animationDelay: '1s' }}>📊 Building your intelligence report</p>
        </div>
      </div>
    </div>
  );
}
