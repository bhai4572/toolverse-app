'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  getAllPhones,
  getAllPhoneBrands,
  getAllPhoneCategories,
  getPhoneBrandBySlug,
  getPhoneCategoryBySlug,
  filterPhones,
  getDefaultPhoneFilterState,
} from '@/lib/phones/database';
import { PhoneCategorySlug, PhoneFilterState, PhoneRecord } from '@/lib/phones/types';
import { Breadcrumb } from '@/components/Breadcrumb';
import { UnderCtaAdBand } from '@/components/ads/UnderCtaAdBand';
import {
  Search,
  Smartphone,
  Scale,
  BatteryCharging,
  Cpu,
  Camera,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  X,
  Upload,
} from 'lucide-react';

interface MobilePhonesDirectoryPageProps {
  initialBrandSlug?: string;
  initialCategorySlug?: string;
  initialCompareMode?: boolean;
}

const ITEMS_PER_PAGE = 24;

export default function MobilePhonesDirectoryPage({
  initialBrandSlug,
  initialCategorySlug,
  initialCompareMode = false,
}: MobilePhonesDirectoryPageProps) {
  const [phones, setPhones] = useState<PhoneRecord[]>(() => getAllPhones());
  const brands = useMemo(() => getAllPhoneBrands(), []);
  const categories = useMemo(() => getAllPhoneCategories(), []);

  const [filters, setFilters] = useState<PhoneFilterState>(() => ({
    ...getDefaultPhoneFilterState(),
    brandSlug: initialBrandSlug || 'all',
    categorySlug: (initialCategorySlug as PhoneCategorySlug) || 'all',
  }));
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([
    'samsung-galaxy-s24-ultra',
    'apple-iphone-16-pro-max',
  ]);
  const [showCompare, setShowCompare] = useState(initialCompareMode);

  useEffect(() => {
    const refresh = () => setPhones(getAllPhones());
    window.addEventListener('toolverse_phones_changed', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('toolverse_phones_changed', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      brandSlug: initialBrandSlug || 'all',
      categorySlug: (initialCategorySlug as PhoneCategorySlug) || 'all',
    }));
    setCurrentPage(1);
  }, [initialBrandSlug, initialCategorySlug]);

  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((prev) => ({ ...prev, searchQuery: searchInput }));
      setCurrentPage(1);
    }, 150);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filteredPhones = useMemo(
    () => filterPhones(phones, filters),
    [phones, filters]
  );

  const totalPages = Math.max(1, Math.ceil(filteredPhones.length / ITEMS_PER_PAGE));
  const paginatedPhones = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPhones.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPhones, currentPage]);

  const comparedPhones = useMemo(
    () =>
      compareSlugs
        .map((s) => phones.find((p) => p.slug === s))
        .filter((p): p is PhoneRecord => Boolean(p)),
    [compareSlugs, phones]
  );

  const toggleCompare = (slug: string) => {
    setCompareSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) return [...prev.slice(1), slug];
      return [...prev, slug];
    });
  };

  const activeBrand = filters.brandSlug !== 'all' ? getPhoneBrandBySlug(filters.brandSlug) : undefined;
  const activeCategory =
    filters.categorySlug !== 'all' ? getPhoneCategoryBySlug(filters.categorySlug) : undefined;

  const breadcrumbItems = [
    { label: 'Mobile Phones', href: activeBrand || activeCategory || showCompare ? '/phones' : undefined },
    ...(activeBrand ? [{ label: activeBrand.name }] : []),
    ...(activeCategory ? [{ label: activeCategory.name }] : []),
    ...(showCompare && !activeBrand && !activeCategory ? [{ label: 'Compare Phones' }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header Banner */}
      <header className="p-7 sm:p-10 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-indigo-500/20 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>GSMArena-Grade Specs + Pakistan PKR &amp; Global USD Prices</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {activeBrand
                ? `${activeBrand.name} Mobile Phones & Prices in Pakistan`
                : activeCategory
                ? `${activeCategory.name} — Specs & Prices`
                : 'Mobile Phones Specifications & Price Directory'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {activeBrand
                ? `${activeBrand.summary} Browse all deduplicated ${activeBrand.name} models with full 13-category technical specs, PKR & USD prices, and PTA status.`
                : activeCategory
                ? activeCategory.description
                : `Compare ${phones.length} verified smartphones across ${brands.length} brands with full technical specs, PKR & USD retail prices, PTA approval status, and zero duplicate entries.`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowCompare((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow transition"
            >
              <Scale className="w-4 h-4" />
              <span>{showCompare ? 'Hide Comparator' : `Compare Specs (${compareSlugs.length}/3)`}</span>
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-semibold transition"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>CSV/JSON Bulk Import</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Single Clean AdSense-Compliant Band */}
      <UnderCtaAdBand variant="leaderboard" region="phones-directory-top" />

      {/* Side-by-Side Phone Comparator */}
      {showCompare && (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-indigo-500/30 shadow-lg overflow-hidden">
          <div className="p-4 sm:p-5 bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                <span>Side-by-Side Phone Specification Comparison ({comparedPhones.length}/3)</span>
              </h2>
              <p className="text-xs text-slate-500">Select up to 3 smartphones below to compare display, chipset, cameras, battery, and PKR/USD prices.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCompare(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {comparedPhones.length < 2 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Select at least 2 smartphones using <strong>+ Compare</strong> on any phone card.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <th className="p-3.5 font-semibold text-slate-500 w-44">Specification</th>
                    {comparedPhones.map((p) => (
                      <th key={p.slug} className="p-3.5 min-w-[200px]">
                        <div className="flex items-center justify-between gap-2">
                          <Link href={`/phones/${p.slug}`} className="font-bold text-indigo-600 hover:underline">
                            {p.fullName}
                          </Link>
                          <button
                            type="button"
                            onClick={() => toggleCompare(p.slug)}
                            className="text-xs text-rose-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-medium text-slate-500">Price (Pakistan / USD)</td>
                    {comparedPhones.map((p) => (
                      <td key={p.slug} className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                        {p.pricePkr ? `PKR ${p.pricePkr.toLocaleString()}` : 'TBA'} / {p.priceUsd ? `$${p.priceUsd}` : 'TBA'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-500">Display</td>
                    {comparedPhones.map((p) => (
                      <td key={p.slug} className="p-3">{p.specs.display.size} — {p.specs.display.type}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-500">Processor / Chipset</td>
                    {comparedPhones.map((p) => (
                      <td key={p.slug} className="p-3 font-medium">{p.specs.platform.chipset}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-500">RAM &amp; Storage</td>
                    {comparedPhones.map((p) => (
                      <td key={p.slug} className="p-3">{p.specs.memory.internal}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-500">Main Camera</td>
                    {comparedPhones.map((p) => (
                      <td key={p.slug} className="p-3">{p.specs.mainCamera.modules}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-500">Selfie Camera</td>
                    {comparedPhones.map((p) => (
                      <td key={p.slug} className="p-3">{p.specs.selfieCamera.modules}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-500">Battery &amp; Charging</td>
                    {comparedPhones.map((p) => (
                      <td key={p.slug} className="p-3">{p.specs.battery.capacityMah} mAh — {p.specs.battery.charging}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-slate-500">PTA Status &amp; 5G</td>
                    {comparedPhones.map((p) => (
                      <td key={p.slug} className="p-3">{p.is5g ? '5G' : '4G LTE'} • {p.ptaStatus}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Brand Directory Bar (WhatMobile + GSMArena Brand Grid) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Browse by Mobile Brand ({brands.length} Companies)
          </h2>
          {filters.brandSlug !== 'all' && (
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, brandSlug: 'all' }))}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Show All Brands
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setFilters((prev) => ({ ...prev, brandSlug: 'all' }));
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              filters.brandSlug === 'all'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
            }`}
          >
            All Brands ({phones.length})
          </button>
          {brands.map((b) => {
            const count = phones.filter((p) => p.brandSlug === b.slug).length;
            const active = filters.brandSlug === b.slug;
            return (
              <Link
                key={b.slug}
                href={`/phones/brand/${b.slug}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  active
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                {b.name} ({count})
              </Link>
            );
          })}
        </div>
      </section>

      {/* 10 Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Link
          href="/phones"
          className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
            filters.categorySlug === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          All Categories
        </Link>
        {categories.map((cat) => {
          const count = phones.filter((p) => p.categories.includes(cat.slug)).length;
          const active = filters.categorySlug === cat.slug;
          return (
            <Link
              key={cat.slug}
              href={`/phones/category/${cat.slug}`}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                active
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
              }`}
            >
              {cat.shortName} ({count})
            </Link>
          );
        })}
      </div>

      {/* Multi-Facet Search, Price Bracket & Spec Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search model, chipset (Snapdragon 8 Gen 3), camera (200MP), or brand..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm"
            />
          </div>

          <div className="md:col-span-4">
            <select
              aria-label="Filter by Pakistan Price Range"
              value={
                filters.maxPricePkr === 50000
                  ? 'under50k'
                  : filters.maxPricePkr === 100000
                  ? 'under100k'
                  : filters.maxPricePkr === 200000
                  ? 'under200k'
                  : filters.minPricePkr === 200000
                  ? 'above200k'
                  : 'all'
              }
              onChange={(e) => {
                const v = e.target.value;
                setFilters((prev) => ({
                  ...prev,
                  minPricePkr: v === 'above200k' ? 200000 : null,
                  maxPricePkr:
                    v === 'under50k'
                      ? 50000
                      : v === 'under100k'
                      ? 100000
                      : v === 'under200k'
                      ? 200000
                      : null,
                }));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm"
            >
              <option value="all">All PKR Price Brackets</option>
              <option value="under50k">Budget: Under PKR 50,000</option>
              <option value="under100k">Value: Under PKR 100,000</option>
              <option value="under200k">Upper Mid: Under PKR 200,000</option>
              <option value="above200k">Flagship: Above PKR 200,000</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              aria-label="Sort Mobile Phones"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortBy: e.target.value as PhoneFilterState['sortBy'] }))
              }
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm"
            >
              <option value="popularity">Sort: Most Popular</option>
              <option value="latest">Sort: Latest Releases</option>
              <option value="price_pkr_asc">Price (PKR): Low to High</option>
              <option value="price_pkr_desc">Price (PKR): High to Low</option>
              <option value="price_usd_asc">Price (USD): Low to High</option>
              <option value="battery_desc">Battery: Largest First</option>
              <option value="alphabetical">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {([2026, 2025, 2024, 2023] as const).map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => {
                setFilters((p) => ({ ...p, releaseYear: p.releaseYear === yr ? null : yr }));
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold border ${
                filters.releaseYear === yr
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {yr}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setFilters((p) => ({ ...p, only5g: !p.only5g }))}
            className={`px-3 py-1 rounded-lg font-semibold border ${
              filters.only5g ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            5G Ready
          </button>
          <button
            type="button"
            onClick={() => setFilters((p) => ({ ...p, onlyPtaApproved: !p.onlyPtaApproved }))}
            className={`px-3 py-1 rounded-lg font-semibold border ${
              filters.onlyPtaApproved ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            PTA Approved (Pakistan)
          </button>
          <button
            type="button"
            onClick={() => setFilters((p) => ({ ...p, onlyNfc: !p.onlyNfc }))}
            className={`px-3 py-1 rounded-lg font-semibold border ${
              filters.onlyNfc ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            NFC Enabled
          </button>
          <button
            type="button"
            onClick={() => setFilters((p) => ({ ...p, minRamGb: p.minRamGb === 12 ? null : 12 }))}
            className={`px-3 py-1 rounded-lg font-semibold border ${
              filters.minRamGb === 12 ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            12GB+ RAM
          </button>
          <button
            type="button"
            onClick={() => setFilters((p) => ({ ...p, minBatteryMah: p.minBatteryMah === 5500 ? null : 5500 }))}
            className={`px-3 py-1 rounded-lg font-semibold border ${
              filters.minBatteryMah === 5500 ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            5500mAh+ Battery
          </button>
          <span className="ml-auto text-slate-500">
            Showing <strong>{paginatedPhones.length}</strong> of <strong>{filteredPhones.length}</strong> phones
          </span>
        </div>
      </div>

      {/* Phone Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedPhones.map((phone) => {
          const isCompared = compareSlugs.includes(phone.slug);
          return (
            <article
              key={phone.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4">
                  <Link href={`/phones/${phone.slug}`} className="shrink-0">
                    <img
                      src={phone.thumbUrl}
                      alt={phone.fullName}
                      className="w-20 h-24 object-contain rounded-xl bg-slate-100 dark:bg-slate-800 p-1"
                      loading="lazy"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {phone.brandName} • {phone.releaseYear}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleCompare(phone.slug)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                          isCompared
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        {isCompared ? '✓ Comparing' : '+ Compare'}
                      </button>
                    </div>
                    <Link href={`/phones/${phone.slug}`}>
                      <h2 className="text-base font-extrabold text-slate-900 dark:text-white hover:text-indigo-600 mt-0.5">
                        {phone.fullName}
                      </h2>
                    </Link>

                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                      {phone.pricePkr && (
                        <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                          PKR {phone.pricePkr.toLocaleString()}
                        </span>
                      )}
                      {phone.priceUsd && (
                        <span className="text-slate-500 font-semibold">(${phone.priceUsd})</span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">
                        {phone.is5g ? '5G' : '4G LTE'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold">
                        {phone.ptaStatus.split('(')[0].trim()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Quick Specs */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5 truncate">
                    <Cpu className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{phone.specs.platform.chipset}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Camera className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{phone.specs.mainCamera.primaryMp}MP Camera</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Smartphone className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span className="truncate">
                      {phone.specs.display.size} • {phone.specs.display.refreshRateHz}Hz
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{phone.specs.battery.capacityMah} mAh</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Full 13-Group Specs</span>
                </span>
                <Link
                  href={`/phones/${phone.slug}`}
                  className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>View Specs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-xl text-xs font-bold border ${
                currentPage === page
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

