'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Moon, Sun, ShieldCheck, Wrench, Menu, X, Sparkles, Briefcase } from 'lucide-react';
import { searchTools, CATEGORIES, ToolDefinition, TOOLS } from '@/lib/tools/registry';

export function Header() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ToolDefinition[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check initial theme
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      setResults(searchTools(val));
    } else {
      setResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 dark:text-white" aria-label="ToolVerse home">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm" aria-hidden="true">
            <Wrench className="w-5 h-5" />
          </div>
          <span>Tool<span className="text-brand-600 dark:text-brand-500">Verse</span></span>
        </Link>

        {/* Global Instant Search */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search tools (e.g., photo 100kb, pdf merge, json)..."
              aria-label="Search ToolVerse tools"
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-brand-500 rounded-lg outline-none transition-all dark:text-white"
            />
          </div>

          {/* Search Dropdown */}
          {results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-96 overflow-y-auto py-2 z-50">
              {results.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  onClick={() => setResults([])}
                  className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between group transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-brand-600">
                      {tool.canonicalName}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {tool.shortDescription}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {tool.category}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/travel"
            className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
          >
            Travel ✈️
          </Link>

          <Link
            href="/business"
            className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            Businesses 🏪
          </Link>

          <Link
            href="/business-qr"
            className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            QR Badge 📱
          </Link>

          <Link
            href="/how-to"
            className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            How-To 📖
          </Link>

          <Link
            href="/products"
            className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            Products 🚀
          </Link>

          <Link
            href="/alternatives"
            className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            Alternatives 🔄
          </Link>

          <Link
            href="/questions"
            className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            Q&amp;A 💬
          </Link>

          <Link
            href="/business/register"
            className="flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-xl shadow-sm transition-all"
          >
            List Business +
          </Link>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 dark:text-slate-300"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-4">
          <Link
            href="/tools/global-job-finder"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 py-2.5 px-4 rounded-xl shadow-md transition"
          >
            <Briefcase className="w-4 h-4" />
            <span>Find Jobs Engine 💼</span>
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 py-2.5 px-4 rounded-xl transition"
          >
            <span>Blog & SEO Guides 📚</span>
          </Link>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search tools..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
            />
          </div>

          {results.length > 0 && (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {results.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  onClick={() => {
                    setResults([]);
                    setMobileMenuOpen(false);
                  }}
                  className="block p-2 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                >
                  {tool.canonicalName}
                </Link>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
