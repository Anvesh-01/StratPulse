'use client';

import { useState, useMemo } from 'react';
import { SentimentData } from '@/types';
import { ExternalLink, ChevronUp, ChevronDown, Zap } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

interface SentimentTableProps {
  data: SentimentData[];
  onRowClick: (item: SentimentData) => void;
}

type SortKey = 'headline' | 'sentiment_score' | 'mood' | 'source' | 'publishedAt';
type SortDir = 'asc' | 'desc';

function MoodBadge({ mood, score }: { mood: string; score: number }) {
  const config = {
    Positive: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    Neutral: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    Negative: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  }[mood] ?? '';

  return (
    <div className="flex items-center gap-2">
      <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border', config)}>
        {mood}
      </span>
      <span className={clsx('text-xs font-mono font-semibold tabular-nums',
        score >= 0.2 ? 'text-emerald-600 dark:text-emerald-400' :
        score <= -0.2 ? 'text-red-600 dark:text-red-400' :
        'text-amber-600 dark:text-amber-400'
      )}>
        {score >= 0 ? '+' : ''}{score.toFixed(2)}
      </span>
    </div>
  );
}

export function SentimentTable({ data, onRowClick }: SentimentTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('sentiment_score');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      let va: string | number = a[sortKey] as string | number;
      let vb: string | number = b[sortKey] as string | number;
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDir]);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp size={14} className="text-slate-300 dark:text-slate-600" />;
    return sortDir === 'asc'
      ? <ChevronUp size={14} className="text-blue-500" />
      : <ChevronDown size={14} className="text-blue-500" />;
  }

  const headerClass = 'text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-4 py-3 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors select-none';

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-700/50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm card-elevated overflow-hidden">
      <div className="p-7 border-b border-slate-200 dark:border-slate-700/50">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">📰 Headlines Analysis</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
          {data.length} articles • Click any row to generate a strategy
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50/60 dark:bg-slate-900/40">
              <th className={headerClass} onClick={() => toggleSort('headline')}>
                <span className="flex items-center gap-1">Headline <SortIcon col="headline" /></span>
              </th>
              <th className={headerClass} onClick={() => toggleSort('sentiment_score')}>
                <span className="flex items-center gap-1">Sentiment <SortIcon col="sentiment_score" /></span>
              </th>
              <th className={`${headerClass} hidden sm:table-cell`} onClick={() => toggleSort('source')}>
                <span className="flex items-center gap-1">Source <SortIcon col="source" /></span>
              </th>
              <th className={`${headerClass} hidden md:table-cell`} onClick={() => toggleSort('publishedAt')}>
                <span className="flex items-center gap-1">Date <SortIcon col="publishedAt" /></span>
              </th>
              <th className="px-4 py-3 w-16" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
            {sorted.map((item) => {
              const isNeg = item.sentiment_score <= -0.2;
              return (
                <tr
                  key={item.id}
                  id={`headline-row-${item.id}`}
                  onClick={() => onRowClick(item)}
                  className={clsx(
                    'cursor-pointer transition-all duration-200 group',
                    isNeg
                      ? 'hover:bg-red-50/60 dark:hover:bg-red-950/20'
                      : 'hover:bg-slate-50/60 dark:hover:bg-slate-700/20'
                  )}
                >
                  <td className="px-6 py-4 max-w-xs">
                    <p className="line-clamp-2 text-slate-800 dark:text-slate-200 font-semibold leading-snug group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {item.headline}
                    </p>
                    {isNeg && (
                      <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-bold mt-2">
                        <Zap size={11} /> Strategy available
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <MoodBadge mood={item.mood} score={item.sentiment_score} />
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell text-slate-600 dark:text-slate-400 whitespace-nowrap text-sm font-medium">
                    {item.source}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-slate-500 dark:text-slate-400 whitespace-nowrap tabular-nums text-xs font-medium">
                    {format(new Date(item.publishedAt), 'MMM d, HH:mm')}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/60 hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover-lift"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
