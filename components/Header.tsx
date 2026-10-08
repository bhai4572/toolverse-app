'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Moon, Sun, Wrench, Menu, X, ChevronDown } from 'lucide-react';
import { searchTools, ToolDefinition } from '@/lib/tools/registry';

const PRIMARY_NAV = [
  { href: '/tools', label: 'Tools' },
  { href: '/workspace', label: 'SEO Dashboard' },
  { href: '/study', label: 'Study Abroad' },
  { href: '/immigration', label: 'Immigration' },
  { href: '/blog', label: 'Blog' },
  { href: '/pricing', label: 'Pricing' },
] as const;

const MORE_NAV = [
  { href: '/seo', label: 'SEO Suite (classic)' },
  { href: '/travel', label: 'Travel' },
  { href: '/tools/global-job-finder', label: 'Jobs Finder' },
  { href: '/business', label: 'Businesses' },
  { href: '/startups', label: 'Startups' },
  { href: '/guest-posts', label: 'Guest Posts' },
  { href: '/products', label: 'Products' },
  { href: '/how-to', label: 'How-To' },
] as const;

export function Header() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ToolDefinition[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
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
    setResults(val.trim() ? searchTools(val) : []);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setResults([]);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 dark:text-white shrink-0" aria-label="ToolVerse home">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm" aria-hidden="true">
            <Wrench className="w-5 h-5" />
          </div>
          <span>Tool<span className="text-brand-600">Verse</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5 text-sm font-semibold text-slate-700 dark:text-slate-200" aria-label="Primary">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-1"
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              More <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50">
                {MORE_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="block px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div ref={searchRef} className="relative flex-1 max-w-xs hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search tools..."
              aria-label="Search ToolVerse tools"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-brand-500 rounded-lg outline-none dark:text-white"
            />
          </div>
          {results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-80 overflow-y-auto py-2 z-50">
              {results.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  onClick={() => setResults([])}
                  className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{tool.canonicalName}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{tool.shortDescription}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-1">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
            <p className="px-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">More</p>
            {MORE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-3 flex items-center justify-between px-3">
            <span className="text-sm text-slate-600 dark:text-slate-400">Dark mode</span>
            <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800" aria-label="Toggle theme">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
