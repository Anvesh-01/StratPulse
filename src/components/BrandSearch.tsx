'use client';

import { useState, FormEvent } from 'react';
import { Search, Loader2, Zap } from 'lucide-react';
import { SentimentResponse } from '@/types';

interface BrandSearchProps {
  onResults: (data: SentimentResponse) => void;
  onLoading: (loading: boolean) => void;
  isLoading: boolean;
}

export function BrandSearch({ onResults, onLoading, isLoading }: BrandSearchProps) {
  const [brand, setBrand] = useState('');
  const [error, setError] = useState('');

  const suggestions = ['Tesla', 'Apple', 'Nike', 'Netflix', 'OpenAI', 'Google', 'Amazon'];

  const handleSubmit = async (e: FormEvent, overrideBrand?: string) => {
    e.preventDefault();
    const target = (overrideBrand ?? brand).trim();
    if (!target) return;

    setError('');
    onLoading(true);

    try {
      const res = await fetch('/api/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: target }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');

      onResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-cyan-500/40 rounded-3xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="absolute left-5 text-slate-400 dark:text-slate-500 transition-colors duration-300 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 pointer-events-none">
            <Search size={24} strokeWidth={1.5} />
          </div>
          <input
            id="brand-search-input"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Enter a brand name (e.g. Tesla, Apple, Nike...)"
            disabled={isLoading}
            className="
              relative w-full pl-16 pr-48 py-4 rounded-3xl text-base font-medium
              bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl
              border border-slate-200 dark:border-slate-700/60
              text-slate-900 dark:text-slate-100
              placeholder-slate-500 dark:placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent
              dark:focus:ring-blue-400/60 dark:focus:border-transparent
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all duration-300 card-elevated
            "
          />
          <button
            id="analyze-brand-btn"
            type="submit"
            disabled={isLoading || !brand.trim()}
            className="
              absolute right-3 flex items-center gap-2 px-7 py-3 rounded-2xl font-bold text-sm
              bg-gradient-to-r from-blue-600 to-cyan-500 text-white
              hover:from-blue-500 hover:to-cyan-400 hover:shadow-lg hover:shadow-blue-500/50
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
              transition-all duration-300 active:scale-95 hover:-translate-y-1 btn-premium
            "
          >
            {isLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Scanning</>
            ) : (
              <><Zap size={16} strokeWidth={2} /> Analyze</>
            )}
          </button>
        </div>
      </form>

      {/* Quick suggestion chips */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Quick Explore:</span>
        {suggestions.map((s, idx) => (
          <button
            key={s}
            id={`suggestion-${s.toLowerCase()}`}
            onClick={(e) => {
              setBrand(s);
              handleSubmit(e, s);
            }}
            disabled={isLoading}
            className="
              px-5 py-2 rounded-full text-xs font-bold
              bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100
              dark:bg-gradient-to-r dark:from-slate-800/80 dark:to-slate-700/80 dark:hover:from-slate-700 dark:hover:to-slate-600
              text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300
              border border-blue-200 dark:border-slate-600/60 hover:border-blue-400 dark:hover:border-blue-500/60
              transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover-lift card-hover
              shadow-sm
            "
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50/80 dark:bg-red-950/40 border border-red-200/80 dark:border-red-800/60 text-red-700 dark:text-red-300 text-sm font-medium card-elevated animate-in slide-in-from-top-4 duration-300">
          <span className="shrink-0 text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
