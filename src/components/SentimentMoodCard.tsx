'use client';

import { SentimentData, SentimentMood } from '@/types';
import { TrendingUp, TrendingDown, Minus, Newspaper, BarChart2 } from 'lucide-react';

interface SentimentMoodCardProps {
  brand: string;
  data: SentimentData[];
  averageScore: number;
  dominantMood: SentimentMood;
  analyzedAt: string;
}

function getMoodConfig(mood: SentimentMood) {
  switch (mood) {
    case 'Positive':
      return {
        icon: TrendingUp,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        border: 'border-emerald-200 dark:border-emerald-800',
        glow: 'shadow-emerald-500/20',
        label: 'Positive Sentiment',
        emoji: '📈',
      };
    case 'Negative':
      return {
        icon: TrendingDown,
        color: 'text-red-500',
        bg: 'bg-red-50 dark:bg-red-950/40',
        border: 'border-red-200 dark:border-red-800',
        glow: 'shadow-red-500/20',
        label: 'Negative Sentiment',
        emoji: '📉',
      };
    default:
      return {
        icon: Minus,
        color: 'text-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        border: 'border-amber-200 dark:border-amber-800',
        glow: 'shadow-amber-500/20',
        label: 'Neutral Sentiment',
        emoji: '📊',
      };
  }
}

export function SentimentMoodCard({ brand, data, averageScore, dominantMood, analyzedAt }: SentimentMoodCardProps) {
  const config = getMoodConfig(dominantMood);
  const Icon = config.icon;

  const positiveCount = data.filter(d => d.mood === 'Positive').length;
  const neutralCount = data.filter(d => d.mood === 'Neutral').length;
  const negativeCount = data.filter(d => d.mood === 'Negative').length;

  const scorePercent = ((averageScore + 1) / 2) * 100;
  const scoreDisplay = averageScore >= 0 ? `+${averageScore.toFixed(2)}` : averageScore.toFixed(2);

  const analyzeTime = new Date(analyzedAt).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Dominant Mood */}
      <div className={`rounded-2xl border p-5 flex flex-col gap-3 shadow-lg ${config.bg} ${config.border} ${config.glow}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Brand Pulse
          </span>
          <span className="text-xl">{config.emoji}</span>
        </div>
        <div>
          <div className={`text-2xl font-bold ${config.color}`}>{dominantMood}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium truncate">{brand}</div>
        </div>
        <div className="flex items-center gap-2">
          <Icon size={16} className={config.color} />
          <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
        </div>
      </div>

      {/* Sentiment Score */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 p-5 flex flex-col gap-3 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Avg Score
          </span>
          <BarChart2 size={18} className="text-blue-500" />
        </div>
        <div>
          <div className={`text-3xl font-bold tabular-nums ${averageScore >= 0.2 ? 'text-emerald-500' : averageScore <= -0.2 ? 'text-red-500' : 'text-amber-500'}`}>
            {scoreDisplay}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">out of ±1.0 scale</div>
        </div>
        {/* Score bar */}
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 transition-all duration-700"
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {/* Articles Analyzed */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 p-5 flex flex-col gap-3 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Articles
          </span>
          <Newspaper size={18} className="text-purple-500" />
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{data.length}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">articles analyzed at {analyzeTime}</div>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">↑ {positiveCount} pos</span>
          <span className="text-amber-600 dark:text-amber-400 font-semibold">→ {neutralCount} neu</span>
          <span className="text-red-600 dark:text-red-400 font-semibold">↓ {negativeCount} neg</span>
        </div>
      </div>

      {/* Mood Distribution */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 p-5 flex flex-col gap-3 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Distribution
          </span>
          <span className="text-lg">🎯</span>
        </div>
        <div className="space-y-2 flex-1">
          {[
            { label: 'Positive', count: positiveCount, color: 'bg-emerald-500' },
            { label: 'Neutral', count: neutralCount, color: 'bg-amber-400' },
            { label: 'Negative', count: negativeCount, color: 'bg-red-500' },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 w-14 shrink-0">{label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full ${color} transition-all duration-700`}
                  style={{ width: data.length ? `${(count / data.length) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-5 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
