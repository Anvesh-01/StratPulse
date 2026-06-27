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
      <nav className="sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl card-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <Image
              src="/logo.png"
              alt="StratPulse Logo"
              width={140}
              height={79}
              className="h-9 w-auto object-contain dark:brightness-100 brightness-90"
              priority
            />
          </div>

          {/* Status indicator */}
          {results && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-bold text-emerald-700 dark:text-emerald-400 card-elevated">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live · {results.brand}
              <ChevronRight size={12} className="ml-1" />
              {results.data.length} articles
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session?.user && (
              <div className="flex items-center gap-3">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? 'User'}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-blue-500/30 hover-lift"
                  />
                )}
                <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                  {session.user.name?.split(' ')[0]}
                </span>
                <button
                  id="sign-out-btn"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition-all duration-200"
                  aria-label="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Hero Header */}
        {!results && !isLoading && (
          <div className="text-center py-12 space-y-5">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs font-bold text-blue-700 dark:text-blue-400 mb-6 card-elevated">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Powered by Google Gemini AI + Live News
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              Anticipate the Market.{' '}
              <span className="text-gradient">
                Automate the Response.
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Enter any brand to scan live news sentiment and instantly generate AI-powered SMART marketing strategies.
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
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
