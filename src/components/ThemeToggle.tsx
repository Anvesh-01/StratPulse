'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('stratpulse-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = saved ? saved === 'dark' : prefersDark;
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('stratpulse-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('stratpulse-theme', 'light');
    }
  };

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      id="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
        bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/15
        border border-white/20 dark:border-white/10
        text-slate-700 dark:text-slate-200
        hover:scale-110 active:scale-95 shadow-lg"
    >
      <span className={`absolute transition-all duration-300 ${isDark ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}>
        <Moon size={18} />
      </span>
      <span className={`absolute transition-all duration-300 ${!isDark ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}>
        <Sun size={18} />
      </span>
    </button>
  );
}
