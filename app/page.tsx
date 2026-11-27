'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Wrench, Globe2, GraduationCap, Landmark, ShieldCheck, Zap, Briefcase, Car, BookOpen } from 'lucide-react';
import { TOOLS, CATEGORIES, getPopularTools, searchTools } from '@/lib/tools/registry';
import { getPillarPosts } from '@/lib/blog/posts';

const PATHS = [
  {
    href: '/cv-maker',
    title: 'CV Maker',
    blurb: 'Free ATS-friendly CV & resume builder — 25 templates, PDF download.',
    icon: Briefcase,
  },
  {
    href: '/tools',
    title: 'Tools',
    blurb: 'PDF, image, calculators, writing — category-first hub.',
    icon: Wrench,
  },
  {
    href: '/passport-photos',
    title: 'Passport Photos',
    blurb: 'US 2×2, UK & Schengen 35×45 mm size specs and browser photo maker.',
    icon: Globe2,
  },
  {
    href: '/blog',
    title: 'Guides',
    blurb: 'Step-by-step how-tos for PDFs, images, CVs and calculators.',
    icon: GraduationCap,
  },
  {
    href: '/immigration',
    title: 'Immigration',
    blurb: 'Work visas, embassies, jobs abroad — checklists, not hype.',
    icon: Landmark,
  },
  {
    href: '/cars',
    title: 'Cars',
    blurb: 'Loan, fuel, insurance bands & checklists.',
    icon: Car,
  },
] as const;

const FLAGSHIP = [
  {
    href: '/tools/pdf-merge',
    name: 'Merge PDF',
    why: 'Combine CVs, cover letters, and scans in the browser — no upload.',
  },
  {
    href: '/tools/pdf-compress',
    name: 'Compress PDF',
    why: 'Shrink PDFs for email and government portals without leaving your device.',
  },
  {
    href: '/tools/compress-image-target-size',
    name: 'Image to exact KB',
    why: 'Hit 20KB / 50KB / 100KB caps for job and visa forms.',
  },
  {
    href: '/cv-maker',
    name: 'Free CV & Resume Maker',
    why: '25 ATS-friendly templates, custom sections, and instant PDF/PNG/JPG download — 100% free.',
  },
  {
    href: '/tools/pakistan-salary-tax-estimator',
    name: 'Pakistan Salary Tax Calculator',
    why: 'Monthly and annual income tax on salary using current FBR slabs — with worked examples.',
  },
  {
    href: '/tools/us-paycheck-calculator',
    name: 'US Paycheck Estimator',
    why: 'Rough take-home math from salary, filing status, and state — educational only.',
  },
] as const;

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('q') || '';
  });
  const popularTools = getPopularTools().slice(0, 6);
  const featuredGuides = getPillarPosts().slice(0, 3);
  const searchResults = searchQuery.trim() ? searchTools(searchQuery) : [];

  return (
    <div className="space-y-14 py-2">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-900"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.45),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(14,165,233,0.25),transparent_40%)]"
          aria-hidden
        />
        <div className="relative px-6 py-14 sm:px-12 sm:py-20 max-w-3xl space-y-6">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold tracking-tight text-white">
              Tool<span className="text-brand-400">Verse</span>
            </p>
            <span className="text-xs text-slate-400 font-normal">
              (also searched as Tools Verse / Tooliverse)
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
            Free Privacy-First Online Tools for PDFs, Images &amp; Documents
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
            Merge PDFs, hit exact image size caps, build an ATS-ready CV, or estimate US/UK/CA/AU take-home pay without creating an
            account. ToolVerse is a private in-browser alternative to cloud converter websites — your files and data stay on your device.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tools/pdf-merge"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold transition-colors"
            >
              Merge a PDF free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/25 hover:border-white/50 text-white text-sm font-bold"
            >
              Browse all tools
            </Link>
            <Link
              href="/legal/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/25 hover:border-white/50 text-white text-sm font-bold"
            >
              About ToolVerse
            </Link>
          </div>
          <div className="relative max-w-md pt-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                if (typeof window !== 'undefined') {
                  const url = new URL(window.location.href);
                  if (value.trim()) url.searchParams.set('q', value);
                  else url.searchParams.delete('q');
                  window.history.replaceState({}, '', url.pathname + url.search);
                }
              }}
              placeholder="Search tools (pdf merge, keyword, tax…)"
              aria-label="Search tools"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-slate-400 text-sm outline-none focus:border-brand-400"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-h-64 overflow-y-auto py-1 z-20 text-left">
                {searchResults.slice(0, 8).map((tool) => (
                  <Link key={tool.id} href={`/tools/${tool.slug}`} className="block px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white">
                    {tool.canonicalName}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="flagship-heading">
        <div>
          <h2 id="flagship-heading" className="text-xl font-bold text-slate-900 dark:text-white">
            Flagship tools people actually use
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Each page explains what the tool does, where processing happens, and clear limits —
            not keyword-stuffed clones.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FLAGSHIP.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/50 transition-colors"
            >
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{t.name}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{t.why}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="paths-heading">
        <h2 id="paths-heading" className="text-xl font-bold text-slate-900 dark:text-white">
          Where do you want to go?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PATHS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className={`group p-5 rounded-2xl border bg-white dark:bg-slate-900 hover:border-brand-500/60 transition-colors ${
                p.href.includes('job-finder')
                  ? 'border-brand-400/70 dark:border-brand-600/50 ring-1 ring-brand-500/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <p.icon className="w-5 h-5 text-brand-600 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600">{p.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-sm">Browser privacy for file tools</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Client-side PDF and image tools process locally. Free tier is ad-supported with light
              display units — tools stay usable without overlays blocking controls. Read{' '}
              <Link href="/legal/about-our-tools" className="font-semibold text-brand-600 hover:underline">
                how our tools work
              </Link>
              .
            </p>
          </div>
        </div>
        <Link href="/legal/about" className="text-xs font-bold text-brand-600 whitespace-nowrap hover:underline">
          About & contact →
        </Link>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Popular tools</h2>
            <p className="text-xs text-slate-500">{TOOLS.filter((t) => t.status === 'live').length}+ live · {CATEGORIES.length} categories</p>
          </div>
          <Link href="/tools" className="text-xs font-semibold text-brand-600 hover:underline">All categories</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-brand-600" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{tool.canonicalName}</h3>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{tool.shortDescription}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="guides-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="guides-heading" className="text-xl font-bold text-slate-900 dark:text-white">
              Practical Guides &amp; Tutorials
            </h2>
            <p className="text-xs text-slate-500">Original step-by-step guides written for real file, document, and calculator tasks</p>
          </div>
          <Link href="/blog" className="text-xs font-semibold text-brand-600 hover:underline">All guides →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/blog/${guide.slug}`}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/50 transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-brand-600">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{guide.category}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">{guide.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{guide.description}</p>
              </div>
              <span className="text-xs font-semibold text-brand-600">Read guide →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
