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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal panel */}
      <div
        className={clsx(
          'relative w-full max-w-2xl max-h-[90vh] overflow-hidden',
          'rounded-2xl shadow-2xl',
          'bg-white dark:bg-slate-900',
          'border border-slate-200 dark:border-slate-700',
          'flex flex-col',
          'animate-in slide-in-from-bottom-4 duration-300',
        )}
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0">
            <Target size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">SMART Strategy</h2>
              {strategy && (
                <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full border', urgencyConf?.bg, urgencyConf?.color, urgencyConf?.border)}>
                  {urgencyConf?.icon} {strategy.urgency} Priority
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">
              <TrendingDown size={12} className="inline text-red-500 mr-1" />
              {article?.headline}
            </p>
          </div>
          <button
            onClick={onClose}
            id="close-strategy-modal"
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900" />
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap size={18} className="text-blue-500" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Generating Strategy...</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gemini AI is crafting your response plan</p>
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
            <div className="space-y-6">
              {/* Summary */}
              <div className={clsx('p-4 rounded-xl border', urgencyConf?.bg, urgencyConf?.border)}>
                <p className={clsx('text-sm font-semibold', urgencyConf?.color)}>Executive Summary</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{strategy.summary}</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                {(['smart', 'social', 'actions'] as const).map((tab) => (
                  <button
                    key={tab}
                    id={`strategy-tab-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      'flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all',
                      activeTab === tab
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    )}
                  >
                    {tab === 'smart' ? '🎯 SMART Goal' : tab === 'social' ? '📱 Social Copy' : '⚡ Actions'}
                  </button>
                ))}
              </div>

              {/* SMART Goal Tab */}
              {activeTab === 'smart' && (
                <div className="space-y-3">
                  {(Object.entries(SMART_LABELS) as [keyof typeof SMART_LABELS, typeof SMART_LABELS[keyof typeof SMART_LABELS]][]).map(([key, meta]) => (
                    <div key={key} className="flex gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <div className={clsx('w-1 rounded-full shrink-0', meta.color)} />
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-sm">{meta.icon}</span>
                          <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{meta.label}</span>
                        </div>
                        <p className="text-sm text-slate-800 dark:text-slate-200">{strategy.smart_goal[key]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Social Copy Tab */}
              {activeTab === 'social' && (
                <div className="space-y-4">
                  {[
                    { platform: 'Twitter / X', key: 'twitter' as const, emoji: '🐦', limit: '280 chars', color: 'border-sky-200 dark:border-sky-900' },
                    { platform: 'LinkedIn', key: 'linkedin' as const, emoji: '💼', limit: '500 chars', color: 'border-blue-200 dark:border-blue-900' },
                    { platform: 'Instagram', key: 'instagram' as const, emoji: '📸', limit: 'with hashtags', color: 'border-pink-200 dark:border-pink-900' },
                  ].map(({ platform, key, emoji, limit, color }) => (
                    <div key={key} className={clsx('p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border', color)}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span>{emoji}</span>
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{platform}</span>
                          <span className="text-xs text-slate-400">({limit})</span>
                        </div>
                        <CopyButton text={strategy.social_copy[key]} label="Copy" />
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{strategy.social_copy[key]}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions Tab */}
              {activeTab === 'actions' && (
                <div className="space-y-2">
                  {strategy.recommended_actions.map((action, i) => (
                    <div key={i} className="flex gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-800 dark:text-slate-200">{action}</p>
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
