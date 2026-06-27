'use client';

import { useState } from 'react';
import { BrandSearch } from '@/components/BrandSearch';
import { SentimentTimeline } from '@/components/SentimentTimeline';
import { SentimentMoodCard } from '@/components/SentimentMoodCard';
import { SentimentTable } from '@/components/SentimentTable';
import { StrategyModal } from '@/components/StrategyModal';
import { LoadingState } from '@/components/LoadingState';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SentimentData, SentimentResponse } from '@/types';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, Radio, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [results, setResults] = useState<SentimentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<SentimentData | null>(null);

  const handleNodeClick = (item: SentimentData) => {
    setSelectedArticle(item);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/10 dark:from-slate-950 dark:via-slate-950 dark:to-blue-950/10 transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl card-elevated shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3.5 shrink-0 group hover:opacity-80 transition-opacity duration-300">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg hover-lift group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300">
              <Radio size={20} className="text-white" strokeWidth={1.5} />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-extrabold text-gradient">
                StratPulse
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-0.5 hidden md:inline font-semibold tracking-wide">War Room</span>
            </div>
          </div>

          {/* Status indicator */}
          {results && (
            <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-bold text-emerald-700 dark:text-emerald-300 card-elevated shadow-sm hover:shadow-md transition-all duration-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow" />
              <span>Live Analysis</span>
              <span className="hidden sm:inline text-emerald-600 dark:text-emerald-400">•</span>
              <span className="hidden sm:inline">{results.brand}</span>
              <ChevronRight size={13} className="ml-1" strokeWidth={2} />
              <span className="font-semibold text-emerald-800 dark:text-emerald-200">{results.data.length}</span>
              <span className="hidden sm:inline">articles</span>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-5">
            <ThemeToggle />
            {session?.user && (
              <div className="flex items-center gap-4">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? 'User'}
                    width={36}
                    height={36}
                    className="rounded-lg ring-2 ring-blue-500/30 hover-lift hidden sm:block shadow-md"
                  />
                )}
                <span className="hidden md:block text-sm font-semibold text-slate-700 dark:text-slate-300 max-w-[140px] truncate">
                  {session.user.name?.split(' ')[0]}
                </span>
                <button
                  id="sign-out-btn"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 btn-premium border border-slate-200 dark:border-slate-700/60"
                  aria-label="Sign out"
                >
                  <LogOut size={20} strokeWidth={1.5} />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-12">
        {/* Hero Header */}
        {!results && !isLoading && (
          <div className="text-center py-16 space-y-7 animate-in fade-in slide-in-from-top-8 duration-700">
            <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border border-blue-200/80 dark:border-blue-900/60 text-xs font-bold text-blue-700 dark:text-blue-400 mb-6 card-elevated shadow-sm hover:shadow-md transition-all duration-300">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-glow" />
              ⚡ Powered by Google Gemini AI + Live News
            </div>
            <h1 className="text-6xl sm:text-7xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight space-y-2">
              <span>Anticipate the Market.</span>{' '}
              <span className="text-gradient-premium block">
                Automate the Response.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Enter any brand to scan live news sentiment and instantly generate AI-powered SMART marketing strategies with precision.
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto w-full">
          <BrandSearch
            onResults={setResults}
            onLoading={setIsLoading}
            isLoading={isLoading}
          />
        </div>

        {/* Loading State */}
        {isLoading && <LoadingState />}

        {/* Results */}
        {results && !isLoading && (
          <div className="space-y-12">
            <SentimentMoodCard
              brand={results.brand}
              data={results.data}
              averageScore={results.averageScore}
              dominantMood={results.dominantMood}
              analyzedAt={results.analyzedAt}
            />
            <SentimentTimeline data={results.data} onNodeClick={handleNodeClick} />
            <SentimentTable data={results.data} onRowClick={handleNodeClick} />
          </div>
        )}
      </main>

      {/* Strategy Modal */}
      <StrategyModal
        isOpen={modalOpen}
        article={selectedArticle}
        brand={results?.brand ?? ''}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
