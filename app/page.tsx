'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Wrench, Globe2, GraduationCap, Landmark, ShieldCheck, Zap, Briefcase, Car, Sparkles, Rocket } from 'lucide-react';
import { TOOLS, CATEGORIES, getPopularTools, searchTools } from '@/lib/tools/registry';
import { AdSlot } from '@/components/ads/AdSlot';

const PATHS = [
  {
    href: '/products',
    title: 'Products & SaaS Hub',
    blurb: 'Discover new software, AI tools & SaaS or launch your product.',
    icon: Sparkles,
  },
  {
    href: '/tools/global-job-finder',
    title: 'Job Finder',
    blurb: 'Search remote & local jobs worldwide — free, no signup.',
    icon: Briefcase,
  },
  {
    href: '/tools',
    title: 'Tools',
    blurb: 'PDF, image, calculators, writing — category-first hub.',
    icon: Wrench,
  },
  {
    href: '/workspace',
    title: 'SEO Dashboard',
    blurb: 'Audits, keywords, reports — free workspace, honest labels.',
    icon: Globe2,
  },
  {
    href: '/study',
    title: 'Study Abroad',
    blurb: 'USA, UK, Canada, AU, NZ & Europe — admissions, docs, fees.',
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
    href: '/tools/us-paycheck-calculator',
    name: 'US Paycheck Estimator',
    why: 'Rough take-home math from salary, filing status, and state — educational only.',
  },
  {
    href: '/tools/uk-take-home-pay-calculator',
    name: 'UK Take-Home Pay',
    why: 'Estimate PAYE-style take-home for planning — not tax advice.',
  },
  {
    href: '/tools/global-job-finder',
    name: 'Global Job Finder',
    why: 'Headlines and listings that link out to employer sites — we are not the employer.',
  },
] as const;

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('q') || '';
  });
  const popularTools = getPopularTools().slice(0, 6);
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
          <p className="text-sm font-bold tracking-tight text-white">
            Tool<span className="text-brand-400">Verse</span>
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
            Free tools that stay on your device.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
            Merge PDFs, hit exact image size caps, or estimate paycheck math without creating an
            account. Most file tools run in your browser with Canvas and WebAssembly — your files are
            not the product. Built by an independent operator who maintains working utilities, not
            scraped filler pages.
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

      {/* Single mid-page display unit — content first */}
      <div
        className="flex flex-col items-center justify-center gap-1 py-1 min-h-[50px] md:min-h-[90px]"
        data-ad-region="home-leaderboard"
        aria-label="Advertisement"
      >
        <AdSlot slot="leaderboard" bare className="my-0 max-w-[728px] w-full" />
        <AdSlot slot="mobile-banner" bare className="my-0 max-w-[320px] w-full" />
      </div>

      {/* Product Discovery & SaaS Launch Hub (Product Hunt & SaaSHub Style) */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Product Hunt &amp; SaaSHub Discovery Network
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Discover &amp; Launch <span className="text-indigo-400">Products, AI Tools &amp; SaaS</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Explore newly launched software products, indie maker tools, and business directories. Upvote your favorite software or list your own product and business for free global discovery.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <Link href="/products" className="text-indigo-300 hover:text-white underline font-semibold">
                Explore Software Directory →
              </Link>
              <span className="text-slate-600">•</span>
              <Link href="/startups" className="text-indigo-300 hover:text-white underline font-semibold">
                Startups &amp; Launchpad →
              </Link>
              <span className="text-slate-600">•</span>
              <Link href="/business" className="text-indigo-300 hover:text-white underline font-semibold">
                Business Directory →
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Link
              href="/submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition text-center"
            >
              <Rocket className="w-4 h-4" /> List Your Product Free
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition text-center"
            >
              Browse All Products
            </Link>
          </div>
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
            <p className="text-xs text-slate-500">{TOOLS.length}+ live · {CATEGORIES.length} categories</p>
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
    </div>
  );
}
