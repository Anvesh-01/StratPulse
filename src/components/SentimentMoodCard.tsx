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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Dominant Mood */}
      <div className={`rounded-3xl border-2 p-7 flex flex-col gap-4 card-elevated card-hover ${config.bg} ${config.border} group transition-all duration-300`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-400 transition-colors">
            🎯 Brand Pulse
          </span>
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{config.emoji}</span>
        </div>
        <div className="space-y-2">
          <div className={`text-4xl font-extrabold bg-gradient-to-r ${config.color === 'text-emerald-500' ? 'from-emerald-600 to-emerald-400' : config.color === 'text-red-500' ? 'from-red-600 to-red-400' : 'from-amber-600 to-amber-400'} bg-clip-text text-transparent`}>{dominantMood}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400 font-semibold truncate">{brand}</div>
        </div>
        <div className="flex items-center gap-3 pt-3 border-t border-current border-opacity-15">
          <Icon size={18} className={config.color} />
          <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
        </div>
      </div>

      {/* Sentiment Score */}
      <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-700/60 bg-white/95 dark:bg-slate-800/95 p-7 flex flex-col gap-4 card-elevated card-hover backdrop-blur-xl group transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-400 transition-colors">
            📊 Avg Score
          </span>
          <BarChart2 size={22} className="text-blue-600 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
        </div>
        <div>
          <div className={`text-5xl font-extrabold tabular-nums ${averageScore >= 0.2 ? 'text-emerald-600' : averageScore <= -0.2 ? 'text-red-600' : 'text-amber-600'}`}>
            {scoreDisplay}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-semibold">±1.0 scale</div>
        </div>
        {/* Score bar */}
        <div className="w-full h-3 rounded-full bg-slate-200/80 dark:bg-slate-700/60 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 transition-all duration-700 shadow-lg shadow-emerald-500/30"
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {/* Articles Analyzed */}
      <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-700/60 bg-white/95 dark:bg-slate-800/95 p-7 flex flex-col gap-4 card-elevated card-hover backdrop-blur-xl group transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-400 transition-colors">
            📰 Articles
          </span>
          <Newspaper size={22} className="text-purple-600 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
        </div>
        <div>
          <div className="text-5xl font-extrabold text-slate-900 dark:text-slate-100">{data.length}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-semibold">analyzed at {analyzeTime}</div>
        </div>
        <div className="flex gap-5 text-sm pt-3 border-t border-slate-200/60 dark:border-slate-700/50 font-bold">
          <span className="text-emerald-600 dark:text-emerald-400 hover:scale-110 transition-transform cursor-default">↑ {positiveCount}</span>
          <span className="text-amber-600 dark:text-amber-400 hover:scale-110 transition-transform cursor-default">→ {neutralCount}</span>
          <span className="text-red-600 dark:text-red-400 hover:scale-110 transition-transform cursor-default">↓ {negativeCount}</span>
        </div>
      </div>

      {/* Mood Distribution */}
      <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-700/60 bg-white/95 dark:bg-slate-800/95 p-7 flex flex-col gap-4 card-elevated card-hover backdrop-blur-xl group transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-400 transition-colors">
            🎯 Distribution
          </span>
        </div>
        <div className="space-y-4 flex-1">
          {[
            { label: 'Positive', count: positiveCount, color: 'bg-gradient-to-r from-emerald-500 to-emerald-400', glow: 'shadow-emerald-500/30' },
            { label: 'Neutral', count: neutralCount, color: 'bg-gradient-to-r from-amber-500 to-amber-400', glow: 'shadow-amber-500/30' },
            { label: 'Negative', count: negativeCount, color: 'bg-gradient-to-r from-red-500 to-red-400', glow: 'shadow-red-500/30' },
          ].map(({ label, count, color, glow }, idx) => (
            <div key={label} className="flex items-center gap-3 group/item">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-400 w-16 shrink-0">{label}</span>
              <div className="flex-1 h-2.5 rounded-full bg-slate-200/80 dark:bg-slate-700/60 overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full ${color} transition-all duration-700 shadow-lg ${glow}`}
                  style={{ width: data.length ? `${(count / data.length) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-7 text-right tabular-nums">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
