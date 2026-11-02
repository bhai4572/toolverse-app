'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  GraduationCap,
  Search,
  Globe,
  Building2,
  BookOpen,
  DollarSign,
  Award,
  CheckCircle2,
  Circle,
  ExternalLink,
  Sparkles,
  FileCheck,
  Filter,
  Clock,
} from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { UnderCtaAdBand } from '@/components/ads/UnderCtaAdBand';
import { listStudyDestinations } from '@/lib/study/destinations';
import {
  ALL_COUNTRY_STUDY_SUMMARIES,
  ALL_UNIVERSITIES,
  PROGRAM_CATEGORIES,
  DEGREE_LEVELS,
  GLOBAL_SCHOLARSHIPS,
  getGlobalStudyStats,
  ProgramCategorySlug,
  DegreeLevel,
  BudgetTier,
} from '@/lib/study/globalUniversityEngine';

const CONTINENTS = [
  'All',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Africa',
  'Oceania',
] as const;

const BUDGET_FILTERS: { id: BudgetTier | 'all'; label: string }[] = [
  { id: 'all', label: 'All Tuition Budgets' },
  { id: 'free-low', label: '💚 Free / Low Tuition (<$3,000/yr)' },
  { id: 'affordable', label: '💙 Affordable ($3,000–$10,000/yr)' },
  { id: 'moderate', label: '💜 Moderate ($10,000–$22,000/yr)' },
  { id: 'premium', label: '🧡 Major Western ($22,000+/yr)' },
];

export default function StudyAbroadPage() {
  const stats = getGlobalStudyStats();
  const featuredTier1 = listStudyDestinations();

  const [activeTab, setActiveTab] = useState<'countries' | 'universities' | 'categories' | 'diy' | 'scholarships'>('countries');

  // Tab 1: 193 Countries Filters
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<(typeof CONTINENTS)[number]>('All');
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier | 'all'>('all');
  const [moiOnly, setMoiOnly] = useState(false);

  // Tab 2: Global University Finder Filters
  const [uniSearch, setUniSearch] = useState('');
  const [uniCategory, setUniCategory] = useState<ProgramCategorySlug | 'all'>('all');
  const [uniDegree, setUniDegree] = useState<DegreeLevel | 'all'>('all');
  const [uniContinent, setUniContinent] = useState<(typeof CONTINENTS)[number]>('All');
  const [uniBudget, setUniBudget] = useState<BudgetTier | 'all'>('all');
  const [uniPageSize, setUniPageSize] = useState(24);

  // Tab 4: Interactive DIY Planner State
  const [diyCountryIso, setDiyCountryIso] = useState('DE');
  const [diyDegree, setDiyDegree] = useState<DegreeLevel>('Master');
  const [diyCategory, setDiyCategory] = useState<ProgramCategorySlug>('cs-it');
  const [diyChecked, setDiyChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tv-global-diy-tracker');
      if (saved) setDiyChecked(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const toggleDiyItem = (key: string) => {
    setDiyChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('tv-global-diy-tracker', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const filteredCountries = useMemo(() => {
    return ALL_COUNTRY_STUDY_SUMMARIES.filter((c) => {
      if (selectedContinent !== 'All' && c.continent !== selectedContinent) return false;
      if (selectedBudget !== 'all' && c.budgetTier !== selectedBudget) return false;
      if (moiOnly && !c.moiFriendly) return false;
      if (countrySearch.trim()) {
        const q = countrySearch.toLowerCase();
        const matchName =
          c.name.toLowerCase().includes(q) ||
          c.capital.toLowerCase().includes(q) ||
          c.iso2.toLowerCase() === q ||
          c.region.toLowerCase().includes(q) ||
          c.universities.some((u) => u.name.toLowerCase().includes(q));
        if (!matchName) return false;
      }
      return true;
    });
  }, [countrySearch, selectedContinent, selectedBudget, moiOnly]);

  const filteredUniversities = useMemo(() => {
    return ALL_UNIVERSITIES.filter((u) => {
      if (uniContinent !== 'All' && u.continent !== uniContinent) return false;
      if (uniBudget !== 'all' && u.budgetTier !== uniBudget) return false;
      if (uniCategory !== 'all' && !u.programs.some((p) => p.category === uniCategory)) return false;
      if (uniDegree !== 'all' && !u.programs.some((p) => p.degrees.includes(uniDegree))) return false;
      if (uniSearch.trim()) {
        const q = uniSearch.toLowerCase();
        const match =
          u.name.toLowerCase().includes(q) ||
          u.countryName.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q) ||
          u.programs.some((p) => p.popularMajors.some((m) => m.toLowerCase().includes(q)));
        if (!match) return false;
      }
      return true;
    });
  }, [uniSearch, uniContinent, uniBudget, uniCategory, uniDegree]);

  const selectedDiyCountry = useMemo(() => {
    return (
      ALL_COUNTRY_STUDY_SUMMARIES.find((c) => c.iso2 === diyCountryIso) ||
      ALL_COUNTRY_STUDY_SUMMARIES[0]
    );
  }, [diyCountryIso]);

  const selectedDiyCategoryMeta = useMemo(() => {
    return PROGRAM_CATEGORIES.find((c) => c.slug === diyCategory) || PROGRAM_CATEGORIES[0];
  }, [diyCategory]);

  return (
    <div className="space-y-10 py-4">
      <Breadcrumb items={[{ label: 'Study Abroad & Global University Directory (193 Countries)' }]} />

      {/* Hero Header */}
      <header className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Global Higher Education &amp; DIY Self-Admission System</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Study in Any of <span className="text-brand-600">193 Countries</span> — File Your Own Admission Without an Agent
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Complete directory of universities across all <strong>{stats.totalCountries} UN Member Countries</strong>, categorized
          by <strong>9 academic faculties</strong> and <strong>5 degree levels</strong> (Bachelor’s, Master’s, PhD, MBBS/MD,
          and Diploma). Compare annual tuition fees, living budgets, scholarships, required documents, and follow our
          6-step DIY admission blueprint to apply directly on official portals for free.
        </p>

        {/* Live Global Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          {[
            { label: 'UN Countries Covered', value: `${stats.totalCountries} / 193`, sub: '100% Global Coverage' },
            { label: 'Indexed Universities', value: `${stats.totalUniversities}+`, sub: 'Public, Research & Medical' },
            { label: 'Program Categories', value: '9 Faculties', sub: 'CS, Eng, Med, MBA, Law+' },
            { label: 'Low-Tuition Countries', value: `${stats.lowCostCountries}+`, sub: 'Under $10k/yr or Free' },
            { label: 'MOI Friendly Countries', value: `${stats.moiFriendlyCountries}+`, sub: 'English Letter Accepted' },
            { label: 'Global Scholarships', value: `${stats.totalScholarships}+ Major`, sub: 'Fully Funded & Waivers' },
          ].map((st) => (
            <div
              key={st.label}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800"
            >
              <div className="text-lg sm:text-xl font-black text-brand-600 dark:text-brand-400">{st.value}</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{st.label}</div>
              <div className="text-[11px] text-slate-500">{st.sub}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Quick Featured Tier-1 Destinations Strip */}
      <section className="space-y-3" aria-labelledby="tier1-heading">
        <div className="flex items-center justify-between">
          <h2 id="tier1-heading" className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
            Most Searched Study Destinations
          </h2>
          <span className="text-xs text-slate-500">Jump directly or browse all 193 countries below</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {featuredTier1.map((d) => (
            <Link
              key={d.slug}
              href={`/study/${d.slug}`}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl mb-1">{d.flag}</div>
                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Study in {d.name}</div>
              </div>
              <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-brand-600">
                Open guide <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Main 5-Tab Navigation Bar */}
      <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {[
          { id: 'countries', label: `🌍 All 193 Countries (${ALL_COUNTRY_STUDY_SUMMARIES.length})`, icon: Globe },
          { id: 'universities', label: `🏛️ University & Program Finder (${ALL_UNIVERSITIES.length})`, icon: Building2 },
          { id: 'categories', label: '📚 9 Program Categories & Majors', icon: BookOpen },
          { id: 'diy', label: '🧭 DIY Self-Admission Planner & Checklist', icon: FileCheck },
          { id: 'scholarships', label: `🎓 Fully Funded Scholarships (${GLOBAL_SCHOLARSHIPS.length})`, icon: Award },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =====================================================================
          TAB 1: ALL 193 COUNTRIES DIRECTORY
         ===================================================================== */}
      {activeTab === 'countries' && (
        <section className="space-y-6" aria-labelledby="all-countries-heading">
          {/* Search & Filters */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Search any of 193 countries, capital, or university..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none focus:border-brand-500"
                />
              </div>

              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value as BudgetTier | 'all')}
                className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              >
                {BUDGET_FILTERS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>

              <label className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 cursor-pointer text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={moiOnly}
                  onChange={(e) => setMoiOnly(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span>Only MOI / English Proficiency Letter Friendly</span>
              </label>
            </div>

            {/* Continent Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CONTINENTS.map((cont) => (
                <button
                  key={cont}
                  type="button"
                  onClick={() => setSelectedContinent(cont)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedContinent === cont
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cont}
                </button>
              ))}
              <span className="ml-auto text-xs font-semibold text-slate-500">
                Showing {filteredCountries.length} of {ALL_COUNTRY_STUDY_SUMMARIES.length} countries
              </span>
            </div>
          </div>

          {/* 193 Countries Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCountries.map((c) => (
              <Link
                key={c.iso2}
                href={`/study/${c.slug}`}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 transition-all flex flex-col justify-between space-y-4 group shadow-sm"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{c.flag}</span>
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                          {c.name}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          {c.capital} • {c.continent} ({c.currencyCode})
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 shrink-0">
                      {c.universitiesCount} {c.universitiesCount === 1 ? 'University' : 'Universities'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1 text-xs">
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">Tuition:</span>
                      <span className="font-bold text-slate-900 dark:text-white text-right">{c.tuitionBandLabel}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">Living Cost:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                        {c.livingCostYearUsd}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">Intakes:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 text-right truncate max-w-[170px]">
                        {c.mainIntakes.join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-slate-500">Top Universities:</div>
                    <div className="flex flex-wrap gap-1">
                      {c.universities.slice(0, 3).map((u) => (
                        <span
                          key={u.id}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 truncate max-w-full"
                        >
                          {u.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {c.moiFriendly ? (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ MOI / IELTS Flexible
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-500">IELTS / TOEFL Required</span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600">
                    Universities &amp; DIY Guide <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 2: GLOBAL UNIVERSITY & PROGRAM FINDER
         ===================================================================== */}
      {activeTab === 'universities' && (
        <section className="space-y-6" aria-labelledby="uni-finder-heading">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={uniSearch}
                  onChange={(e) => setUniSearch(e.target.value)}
                  placeholder="University name, city, country, major..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none focus:border-brand-500"
                />
              </div>

              <select
                value={uniCategory}
                onChange={(e) => setUniCategory(e.target.value as ProgramCategorySlug | 'all')}
                className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              >
                <option value="all">All 9 Subject Categories</option>
                {PROGRAM_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>

              <select
                value={uniDegree}
                onChange={(e) => setUniDegree(e.target.value as DegreeLevel | 'all')}
                className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              >
                <option value="all">All Degree Levels (BS/MS/PhD/MBBS)</option>
                {DEGREE_LEVELS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                value={uniBudget}
                onChange={(e) => setUniBudget(e.target.value as BudgetTier | 'all')}
                className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              >
                {BUDGET_FILTERS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {CONTINENTS.map((cont) => (
                <button
                  key={cont}
                  type="button"
                  onClick={() => setUniContinent(cont)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    uniContinent === cont
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cont}
                </button>
              ))}
              <span className="ml-auto text-xs font-semibold text-slate-500">
                Matching Universities: {filteredUniversities.length}
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {filteredUniversities.slice(0, uniPageSize).map((u) => (
              <div
                key={u.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3.5 flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                      {u.countryFlag} {u.countryName} • {u.type}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">Est. {u.founded}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    <Link href={`/study/${u.countrySlug}/${u.slug}`} className="hover:text-brand-600">
                      {u.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500">
                    📍 {u.city}, {u.countryName} • Intakes: {u.intakes.join(', ')}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Annual Tuition</div>
                      <div className="font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {u.tuitionLabel}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Living Cost / Year</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {u.livingCostPerYearUsd}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {u.programs.slice(0, 4).map((p) => (
                      <span
                        key={p.category}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {p.categoryLabel.split(',')[0]}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                      BS • MS • PhD • MBBS
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={`/study/${u.countrySlug}/${u.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-brand-600 hover:underline"
                  >
                    Programs, Fees &amp; DIY Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={u.admissionsPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-xs font-bold transition-colors"
                  >
                    Official Site <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredUniversities.length > uniPageSize && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setUniPageSize((prev) => prev + 30)}
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors"
              >
                Load More Universities ({filteredUniversities.length - uniPageSize} remaining)
              </button>
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          TAB 3: 9 ACADEMIC PROGRAM CATEGORIES & MAJORS
         ===================================================================== */}
      {activeTab === 'categories' && (
        <section className="space-y-6" aria-labelledby="categories-heading">
          <div className="max-w-3xl space-y-2">
            <h2 id="categories-heading" className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Browse Global Programs by Academic Category (9 Standardized Faculties)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Select any category below to view the top majors offered worldwide, typical subject prerequisites, and
              jump directly to matching universities across all 193 countries.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROGRAM_CATEGORIES.map((cat) => (
              <div
                key={cat.slug}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-2.5">
                  <div className="text-3xl">{cat.icon}</div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{cat.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{cat.description}</p>

                  <div className="space-y-1 pt-1">
                    <div className="text-[11px] font-bold uppercase text-slate-500">Offered Majors &amp; Tracks:</div>
                    <ul className="space-y-1">
                      {cat.sampleMajors.map((m) => (
                        <li key={m} className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                    <strong>Entry Prerequisite:</strong> {cat.typicalRequirements}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setUniCategory(cat.slug);
                    setActiveTab('universities');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-600 text-brand-700 dark:text-brand-300 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  Find {cat.shortName} Universities <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 4: INTERACTIVE DIY SELF-ADMISSION PLANNER & CHECKLIST
         ===================================================================== */}
      {activeTab === 'diy' && (
        <section className="space-y-6" aria-labelledby="diy-planner-heading">
          <div className="p-6 sm:p-8 rounded-3xl border border-brand-200 dark:border-brand-900/60 bg-gradient-to-br from-brand-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 space-y-6">
            <div className="space-y-2 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Step-by-Step Self-Filing Engine
              </span>
              <h2 id="diy-planner-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Interactive DIY Admission &amp; Visa File Builder
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Select your target destination country, degree level, and academic field below. We generate your exact
                cost estimate, bank statement requirement, official portal link, and a saveable document checklist so
                you can file your admission yourself without paying any consultant.
              </p>
            </div>

            {/* 3-Step Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  1. Target Country (All 193 Countries)
                </label>
                <select
                  value={diyCountryIso}
                  onChange={(e) => setDiyCountryIso(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                >
                  {ALL_COUNTRY_STUDY_SUMMARIES.map((c) => (
                    <option key={c.iso2} value={c.iso2}>
                      {c.flag} {c.name} ({c.tuitionBandLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  2. Target Degree Level
                </label>
                <select
                  value={diyDegree}
                  onChange={(e) => setDiyDegree(e.target.value as DegreeLevel)}
                  className="w-full px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                >
                  {DEGREE_LEVELS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  3. Academic Category / Faculty
                </label>
                <select
                  value={diyCategory}
                  onChange={(e) => setDiyCategory(e.target.value as ProgramCategorySlug)}
                  className="w-full px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                >
                  {PROGRAM_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Generated Blueprint Summary Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="text-xs font-bold text-brand-600 uppercase">
                    Your Personalized DIY Dossier: {diyDegree} in {selectedDiyCategoryMeta.shortName}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {selectedDiyCountry.flag} Studying in {selectedDiyCountry.name} ({selectedDiyCountry.capital})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/study/${selectedDiyCountry.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
                  >
                    Open Full {selectedDiyCountry.name} Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={selectedDiyCountry.nationalPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    Official Portal <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="text-slate-500 font-semibold">Annual Tuition Band</div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {selectedDiyCountry.tuitionBandLabel}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="text-slate-500 font-semibold">Bank Statement / Visa Proof</div>
                  <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {selectedDiyCountry.bankStatementRequirementUsd}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="text-slate-500 font-semibold">Student Visa Category</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedDiyCountry.visaCategoryName}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="text-slate-500 font-semibold">Universities to Apply Directly</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedDiyCountry.universities.map((u) => u.name).join(', ')}
                  </div>
                </div>
              </div>

              {/* Interactive Checklist */}
              {selectedDiyCountry.universities[0] && (
                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2.5">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      6-Step DIY Application Progress (Click to Check Off)
                    </h4>
                    {selectedDiyCountry.universities[0].admissionSteps.map((st) => {
                      const k = `diy-step-${st.step}`;
                      const done = Boolean(diyChecked[k]);
                      return (
                        <button
                          key={st.step}
                          type="button"
                          onClick={() => toggleDiyItem(k)}
                          className={`w-full text-left p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                            done
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-brand-500'
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className={`font-bold ${done ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                              Step {st.step}: {st.title} ({st.timeline})
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{st.detail}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Required Document Pack for {diyDegree} (Click to Check Off)
                    </h4>
                    {selectedDiyCountry.universities[0].requiredDocuments
                      .flatMap((g) => g.items)
                      .map((doc) => {
                        const k = `diy-doc-${doc.id}`;
                        const done = Boolean(diyChecked[k]);
                        return (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => toggleDiyItem(k)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                              done
                                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-brand-500'
                            }`}
                          >
                            {done ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <div className={`font-bold ${done ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                                {doc.label}
                              </div>
                              <div className="text-[11px] text-slate-500">{doc.note}</div>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          TAB 5: GLOBAL SCHOLARSHIPS DIRECTORY
         ===================================================================== */}
      {activeTab === 'scholarships' && (
        <section className="space-y-6" aria-labelledby="scholarships-heading">
          <div className="max-w-3xl space-y-2">
            <h2 id="scholarships-heading" className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Major Fully Funded Government &amp; University Scholarships Worldwide
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Official government-funded scholarships covering tuition, monthly living stipends, accommodation, health
              insurance, and airfare. Apply directly through the official links below — never pay anyone to “buy” a
              scholarship.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {GLOBAL_SCHOLARSHIPS.map((s) => (
              <div
                key={s.name}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-3 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                      {s.fundingType} • {s.countryName}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">🗓 {s.deadlineWindow}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{s.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>What it covers:</strong> {s.coverage}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {s.degrees.map((d) => (
                      <span
                        key={d}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    href={`/study/${s.countryIso2.toLowerCase()}`}
                    className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-brand-600"
                  >
                    View {s.countryName} Universities →
                  </Link>
                  <a
                    href={s.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold"
                  >
                    Official Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Free Student Tools Strip */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Free ToolVerse Student Tools to Prepare Your Application Yourself
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/tools/gpa-calculator', label: '🎓 GPA & CGPA Calculator' },
            { href: '/tools/passport-photo-maker', label: '📸 Visa Passport Photo Maker' },
            { href: '/passport-photos', label: '📐 Passport Size Presets Hub' },
            { href: '/tools/pdf-merge', label: '📄 Merge Transcripts into 1 PDF' },
            { href: '/tools/pdf-compress', label: '⚡ Compress PDF under 2MB Portal Limit' },
            { href: '/tools/word-counter', label: '✍️ SOP & Essay Word Counter' },
            { href: '/travel/embassies', label: '🏛️ Global Embassy Directory' },
            { href: '/immigration', label: '🛂 Work & Immigration Hub' },
            { href: '/travel', label: '✈️ Student Visa Route Checker' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 text-slate-700 dark:text-slate-200"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      <UnderCtaAdBand region="study-under-cta" />
    </div>
  );
}
