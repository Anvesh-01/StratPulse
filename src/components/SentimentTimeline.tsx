'use client';

import {
  ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts';
import { SentimentData } from '@/types';
import { format } from 'date-fns';

interface SentimentTimelineProps {
  data: SentimentData[];
  onNodeClick: (item: SentimentData) => void;
}

function getMoodColor(score: number): string {
  if (score >= 0.2) return '#10b981';   // emerald - positive
  if (score <= -0.2) return '#ef4444';  // red - negative
  return '#f59e0b';                      // amber - neutral
}

function getMoodGlow(score: number): string {
  if (score >= 0.2) return '0 0 12px rgba(16,185,129,0.6)';
  if (score <= -0.2) return '0 0 12px rgba(239,68,68,0.6)';
  return '0 0 12px rgba(245,158,11,0.6)';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomDot(props: any) {
  const { cx, cy, payload, onClick } = props;
  const color = getMoodColor(payload.sentiment_score);
  const isNegative = payload.sentiment_score <= -0.2;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={isNegative ? 8 : 6}
      fill={color}
      stroke={isNegative ? '#fff' : color}
      strokeWidth={isNegative ? 2 : 1}
      style={{
        cursor: 'pointer',
        filter: `drop-shadow(${getMoodGlow(payload.sentiment_score)})`,
        transition: 'r 0.2s ease',
      }}
      onClick={() => onClick(payload)}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d: SentimentData = payload[0]?.payload;
  if (!d) return null;
  const color = getMoodColor(d.sentiment_score);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-3 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color }}>
          {d.mood}
        </span>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-auto">
          {d.sentiment_score >= 0 ? '+' : ''}{d.sentiment_score.toFixed(2)}
        </span>
      </div>
      <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-snug line-clamp-3">
        {d.headline}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{d.source}</p>
      {d.sentiment_score <= -0.2 && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-semibold">⚡ Click to generate strategy</p>
      )}
    </div>
  );
}

export function SentimentTimeline({ data, onNodeClick }: SentimentTimelineProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    index: index + 1,
    dateLabel: format(new Date(item.publishedAt), 'MMM d'),
  }));

  return (
    <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-700/60 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl card-elevated card-hover p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 transition-all">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">📈 Sentiment Timeline</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
            Click any <span className="text-red-600 dark:text-red-400 font-bold">red node</span> for AI strategy
          </p>
        </div>
        <div className="flex items-center gap-6 text-xs font-bold hidden sm:flex">
          <span className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50"><span className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40" />Positive</span>
          <span className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50"><span className="w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/40" />Neutral</span>
          <span className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50"><span className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/40 animate-pulse-glow" />Negative</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" vertical={false} />
          <XAxis
            dataKey="index"
            tick={{ fontSize: 11, fill: 'currentColor' }}
            tickLine={false}
            axisLine={false}
            className="text-slate-400 dark:text-slate-500"
          />
          <YAxis
            domain={[-1.1, 1.1]}
            tickCount={5}
            tick={{ fontSize: 11, fill: 'currentColor' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v.toFixed(1)}
            className="text-slate-400 dark:text-slate-500"
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="rgba(148,163,184,0.4)" strokeDasharray="4 4" />
          <ReferenceLine y={0.2} stroke="rgba(16,185,129,0.2)" strokeDasharray="2 4" />
          <ReferenceLine y={-0.2} stroke="rgba(239,68,68,0.2)" strokeDasharray="2 4" />
          <Line
            type="monotone"
            dataKey="sentiment_score"
            stroke="url(#lineGrad)"
            strokeWidth={2}
            dot={<CustomDot onClick={onNodeClick} />}
            activeDot={false}
          />
          <Scatter dataKey="sentiment_score" shape={() => null}>
            {chartData.map((entry) => (
              <Cell key={entry.id} fill={getMoodColor(entry.sentiment_score)} />
            ))}
          </Scatter>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
