'use client';

import { useState, useEffect } from 'react';
import { X, Target, Copy, Check, Loader2, AlertTriangle, TrendingDown, Zap } from 'lucide-react';
import { SentimentData, StrategyResponse } from '@/types';
import clsx from 'clsx';

interface StrategyModalProps {
  isOpen: boolean;
  article: SentimentData | null;
  brand: string;
  onClose: () => void;
}

const URGENCY_CONFIG = {
  Critical: { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/50', border: 'border-red-200 dark:border-red-900', icon: '🚨' },
  High: { color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/50', border: 'border-orange-200 dark:border-orange-900', icon: '⚠️' },
  Medium: { color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/50', border: 'border-amber-200 dark:border-amber-900', icon: '📌' },
  Low: { color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/50', border: 'border-blue-200 dark:border-blue-900', icon: 'ℹ️' },
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
    >
      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

const SMART_LABELS = {
  specific: { label: 'Specific', color: 'bg-blue-500', icon: '🎯' },
  measurable: { label: 'Measurable', color: 'bg-purple-500', icon: '📏' },
  achievable: { label: 'Achievable', color: 'bg-emerald-500', icon: '✅' },
  relevant: { label: 'Relevant', color: 'bg-amber-500', icon: '🔗' },
  timeBound: { label: 'Time-Bound', color: 'bg-red-500', icon: '⏱️' },
};

export function StrategyModal({ isOpen, article, brand, onClose }: StrategyModalProps) {
  const [strategy, setStrategy] = useState<StrategyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'smart' | 'social' | 'actions'>('smart');

  useEffect(() => {
    if (isOpen && article) {
      setStrategy(null);
      setError('');
      setActiveTab('smart');
      fetchStrategy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, article]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const fetchStrategy = async () => {
    if (!article) return;
    setLoading(true);
    try {
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand,
          headline: article.headline,
          mood: article.mood,
          sentiment_score: article.sentiment_score,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Strategy generation failed');
      setStrategy(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate strategy');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const urgencyConf = strategy ? URGENCY_CONFIG[strategy.urgency] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-lg animate-in fade-in duration-300" />

      {/* Modal panel */}
      <div
        className={clsx(
          'relative w-full max-w-2xl max-h-[90vh] overflow-hidden',
          'rounded-4xl shadow-2xl',
          'bg-white dark:bg-slate-900',
          'border-2 border-slate-200 dark:border-slate-700/60',
          'flex flex-col',
          'animate-in slide-in-from-bottom-6 duration-400 zoom-in-90',
        )}
      >
        {/* Header */}
        <div className="flex items-start gap-5 p-9 border-b border-slate-200/60 dark:border-slate-800/50 shrink-0 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-950/40 dark:to-cyan-950/40">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
            <Target size={28} className="text-white" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">🎯 SMART Strategy</h2>
              {strategy && (
                <span className={clsx('text-xs font-bold px-4 py-2 rounded-full border-2 backdrop-blur-sm', urgencyConf?.bg, urgencyConf?.color, urgencyConf?.border)}>
                  {urgencyConf?.icon} {strategy.urgency}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 truncate font-semibold">
              <TrendingDown size={14} className="inline text-red-500 mr-2" strokeWidth={2} />
              {article?.headline}
            </p>
          </div>
          <button
            onClick={onClose}
            id="close-strategy-modal"
            className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-200 hover:scale-110 btn-premium"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-8 animate-in fade-in duration-300">
              <div className="relative w-28 h-28">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900/40" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center animate-pulse-glow">
                  <Zap size={32} className="text-blue-600" strokeWidth={2} />
                </div>
              </div>
              <div className="text-center space-y-3">
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">Generating Strategy...</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Gemini AI is crafting your response plan</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400">
              <AlertTriangle size={18} />
              <span className="text-sm">{error}</span>
              <button onClick={fetchStrategy} className="ml-auto text-xs underline hover:no-underline">Retry</button>
            </div>
          )}

          {strategy && (
            <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Summary */}
              <div className={clsx('p-6 rounded-2xl border-2 backdrop-blur-sm transition-all duration-300 hover:shadow-md', urgencyConf?.bg, urgencyConf?.border)}>
                <p className={clsx('text-sm font-extrabold uppercase tracking-widest', urgencyConf?.color)}>📋 Executive Summary</p>
                <p className="text-base text-slate-700 dark:text-slate-300 mt-4 leading-relaxed font-medium">{strategy.summary}</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-3 bg-slate-100/60 dark:bg-slate-800/80 rounded-2xl p-2">
                {(['smart', 'social', 'actions'] as const).map((tab) => (
                  <button
                    key={tab}
                    id={`strategy-tab-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      'flex-1 py-3 px-5 text-sm font-bold rounded-xl transition-all duration-300 btn-premium',
                      activeTab === tab
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-lg border border-slate-200 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40'
                    )}
                  >
                    {tab === 'smart' ? '🎯 SMART' : tab === 'social' ? '📱 Social' : '⚡ Actions'}
                  </button>
                ))}
              </div>

              {/* SMART Goal Tab */}
              {activeTab === 'smart' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                  {(Object.entries(SMART_LABELS) as [keyof typeof SMART_LABELS, typeof SMART_LABELS[keyof typeof SMART_LABELS]][]).map(([key, meta], idx) => (
                    <div key={key} className="flex gap-4 p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 hover:shadow-md transition-all duration-300 group/smart" style={{ animationDelay: `${idx * 50}ms` }}>
                      <div className={clsx('w-1.5 rounded-full shrink-0 group-hover/smart:scale-125 transition-transform', meta.color)} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="text-lg">{meta.icon}</span>
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 group-hover/smart:text-slate-700 dark:group-hover/smart:text-slate-300 transition-colors">{meta.label}</span>
                        </div>
                        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{strategy.smart_goal[key]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Social Copy Tab */}
              {activeTab === 'social' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  {[
                    { platform: 'Twitter / X', key: 'twitter' as const, emoji: '🐦', limit: '280 chars', color: 'border-sky-200/60 dark:border-sky-900/40', bg: 'bg-sky-50/50 dark:bg-sky-950/20' },
                    { platform: 'LinkedIn', key: 'linkedin' as const, emoji: '💼', limit: '500 chars', color: 'border-blue-200/60 dark:border-blue-900/40', bg: 'bg-blue-50/50 dark:bg-blue-950/20' },
                    { platform: 'Instagram', key: 'instagram' as const, emoji: '📸', limit: 'with hashtags', color: 'border-pink-200/60 dark:border-pink-900/40', bg: 'bg-pink-50/50 dark:bg-pink-950/20' },
                  ].map(({ platform, key, emoji, limit, color, bg }, idx) => (
                    <div key={key} className={clsx('p-5 rounded-2xl border-2 hover:shadow-md transition-all duration-300 group/social', color, bg)} style={{ animationDelay: `${idx * 50}ms` }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{emoji}</span>
                          <div>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">{platform}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{limit}</span>
                          </div>
                        </div>
                        <CopyButton text={strategy.social_copy[key]} label="Copy" />
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{strategy.social_copy[key]}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions Tab */}
              {activeTab === 'actions' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {strategy.recommended_actions.map((action, i) => (
                    <div key={i} className="flex gap-4 p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 hover:shadow-md transition-all duration-300 group/action" style={{ animationDelay: `${i * 50}ms` }}>
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover/action:scale-110 transition-transform shadow-lg shadow-blue-500/40">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium group-hover/action:text-slate-900 dark:group-hover/action:text-slate-100 transition-colors">{action}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
