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
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
          <div className="absolute left-4 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-blue-500">
            <Search size={22} />
          </div>
          <input
            id="brand-search-input"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Enter a brand name (e.g. Tesla, Apple, Nike...)"
            disabled={isLoading}
            className="
              relative w-full pl-14 pr-40 py-4 rounded-2xl text-base font-medium
              bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm
              border border-slate-200 dark:border-slate-700/50
              text-slate-900 dark:text-slate-100
              placeholder-slate-500 dark:placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              dark:focus:ring-cyan-400/50 dark:focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300 card-elevated
            "
          />
          <button
            id="analyze-brand-btn"
            type="submit"
            disabled={isLoading || !brand.trim()}
            className="
              absolute right-2 flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-blue-600 to-cyan-500 text-white
              hover:from-blue-500 hover:to-cyan-400 hover:shadow-lg hover:shadow-blue-500/40
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300 active:scale-95 hover:-translate-y-0.5
            "
          >
            {isLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Scanning</>
            ) : (
              <><Zap size={16} /> Analyze</>
            )}
          </button>
        </div>
      </form>

      {/* Quick suggestion chips */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Explore:</span>
        {suggestions.map((s) => (
          <button
            key={s}
            id={`suggestion-${s.toLowerCase()}`}
            onClick={(e) => {
              setBrand(s);
              handleSubmit(e, s);
            }}
            disabled={isLoading}
            className="
              px-4 py-1.5 rounded-full text-xs font-semibold
              bg-slate-100 hover:bg-blue-100 dark:bg-slate-800/80 dark:hover:bg-slate-700
              text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300
              border border-slate-200 dark:border-slate-700/50 hover:border-blue-400 dark:hover:border-blue-500/50
              transition-all duration-200 disabled:opacity-50 hover-lift
            "
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
          <span className="shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
