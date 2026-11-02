'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Building2,
  CheckCircle2,
  Circle,
  BookOpen,
  DollarSign,
  FileCheck,
  Award,
  Globe,
  Clock,
  Briefcase,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { UnderCtaAdBand } from '@/components/ads/UnderCtaAdBand';
import { StudyDestination, listStudyDestinations } from '@/lib/study/destinations';
import {
  PROGRAM_CATEGORIES,
  DEGREE_LEVELS,
  ProgramCategorySlug,
  DegreeLevel,
  UniversityProfile,
  ALL_COUNTRY_STUDY_SUMMARIES,
} from '@/lib/study/globalUniversityEngine';

function ExtLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className || 'inline-flex items-center gap-1 text-brand-600 hover:underline font-semibold'}
    >
      {children}
      <ExternalLink className="w-3 h-3 shrink-0" aria-hidden />
    </a>
  );
}

/** Persistent localStorage checklist hook for DIY admission tracking */
function useDiyChecklist(storageKey: string) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      // ignore storage errors
    }
  }, [storageKey]);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return { checked, toggle };
}

/** Detailed University Card with expandable Programs, Fees, Scholarships & DIY Steps */
function UniversityCard({
  uni,
  countrySlug,
  defaultExpanded = false,
  selectedCategory,
  selectedDegree,
}: {
  uni: UniversityProfile;
  countrySlug: string;
  defaultExpanded?: boolean;
  selectedCategory: ProgramCategorySlug | 'all';
  selectedDegree: DegreeLevel | 'all';
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'programs' | 'admission' | 'docs' | 'scholarships'>('programs');

  const filteredPrograms = useMemo(() => {
    return uni.programs.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedDegree !== 'all' && !p.degrees.includes(selectedDegree)) return false;
      return true;
    });
  }, [uni.programs, selectedCategory, selectedDegree]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
      {/* University Header */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/50">
                {uni.type}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                📍 {uni.city}, {uni.countryName} • Est. {uni.founded}
              </span>
              {uni.moiAccepted && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
                  ✓ MOI / English Certificate Friendly
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              <Link href={`/study/${countrySlug}/${uni.slug}`} className="hover:text-brand-600 transition-colors">
                {uni.name}
              </Link>
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={uni.admissionsPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm transition-colors"
            >
              Official Portal <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link
              href={`/study/${countrySlug}/${uni.slug}`}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Full Profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-600" /> Annual Tuition
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">{uni.tuitionLabel}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-600" /> Main Intakes
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
              {uni.intakes.join(' • ')}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Globe className="w-3 h-3 text-purple-600" /> Language / IELTS
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
              {uni.moiAccepted ? 'IELTS 6.0 / MOI Accepted' : 'IELTS 6.5 / TOEFL'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-600" /> Application Fee
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
              {uni.applicationFeeUsd}
            </div>
          </div>
        </div>

        {/* Toggle Expand Button */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-wrap gap-1.5">
            {uni.programs.slice(0, 5).map((p) => (
              <span
                key={p.category}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {p.categoryLabel.split(',')[0]}
              </span>
            ))}
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
              All 9 Faculties (BS / MS / PhD)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-500 shrink-0"
          >
            {expanded ? (
              <>
                Hide Details <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Programs, Fees &amp; DIY Steps <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Deep Detail Section */}
      {expanded && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-5 sm:p-6 space-y-5">
          {/* Sub-navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            {[
              { id: 'programs', label: `📚 Programs & Fees (${filteredPrograms.length})`, icon: BookOpen },
              { id: 'admission', label: '🧭 DIY Admission Steps (1–6)', icon: CheckCircle2 },
              { id: 'docs', label: '📋 Required Documents', icon: FileCheck },
              { id: 'scholarships', label: `🎓 Scholarships (${uni.scholarships.length})`, icon: Award },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-brand-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Offered Programs & Fee Structure */}
          {activeTab === 'programs' && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {filteredPrograms.map((prog) => (
                  <div
                    key={prog.category}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{prog.categoryLabel}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shrink-0">
                        {prog.annualTuitionUsd}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {prog.degrees.map((deg) => (
                        <span
                          key={deg}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                        >
                          {deg}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {prog.durationYears}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Popular Majors: </span>
                      {prog.popularMajors.join(' • ')}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      <span className="font-semibold">Eligibility:</span> {prog.entryRequirements}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DIY Step-by-Step Self-Admission Procedure */}
          {activeTab === 'admission' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Follow these 6 steps to file your own admission at <strong>{uni.name}</strong> directly without paying an external consultant:
              </p>
              <div className="grid gap-3">
                {uni.admissionSteps.map((st) => (
                  <div
                    key={st.step}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider">
                        Step {st.step}: {st.title}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        ⏱ {st.timeline}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{st.detail}</p>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                        💡 Pro Tip: {st.proTip}
                      </p>
                      {st.toolHref && (
                        <Link
                          href={st.toolHref}
                          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline shrink-0"
                        >
                          {st.toolLabel} <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Required Documents */}
          {activeTab === 'docs' && (
            <div className="grid sm:grid-cols-2 gap-3">
              {uni.requiredDocuments.map((grp) => (
                <div
                  key={grp.category}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5"
                >
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{grp.title}</h4>
                  <ul className="space-y-2">
                    {grp.items.map((item) => (
                      <li key={item.id} className="text-xs space-y-0.5 border-l-2 border-brand-500 pl-2.5">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</div>
                        <div className="text-slate-500 dark:text-slate-400">{item.note}</div>
                        <div className="text-[10px] font-bold text-brand-600 uppercase">{item.requiredFor}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Scholarships */}
          {activeTab === 'scholarships' && (
            <div className="space-y-3">
              {uni.scholarships.map((sch) => (
                <div
                  key={sch.name}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1"
                >
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    {sch.name}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Coverage: {sch.coverage}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Eligibility: {sch.eligibility}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Dedicated Single-University Profile Page (/study/:country/:uni) */
export function UniversityProfilePage({
  uni,
  dest,
}: {
  uni: UniversityProfile;
  dest: StudyDestination;
}) {
  const { checked, toggle } = useDiyChecklist(`tv-diy-uni-${uni.id}`);
  const [selectedCategory, setSelectedCategory] = useState<ProgramCategorySlug | 'all'>('all');
  const [selectedDegree, setSelectedDegree] = useState<DegreeLevel | 'all'>('all');

  const allDocIds = uni.requiredDocuments.flatMap((g) => g.items.map((i) => i.id));
  const completedCount = allDocIds.filter((id) => checked[id]).length;

  return (
    <article className="space-y-10 py-4 max-w-5xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Study Abroad (193 Countries)', href: '/study' },
          { label: `Study in ${uni.countryName}`, href: `/study/${uni.countrySlug}` },
          { label: uni.name },
        ]}
      />

      {/* Hero Header */}
      <header className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xl">{uni.countryFlag}</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
            {uni.type}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            📍 {uni.city}, {uni.countryName} ({uni.continent}) • Founded {uni.founded}
          </span>
          {uni.moiAccepted && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              ✓ MOI / English Proficiency Letter Accepted
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {uni.name} — Programs, Fees, Documents &amp; DIY Admission Guide
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Complete self-application dossier for international students applying to <strong>{uni.name}</strong> in{' '}
          {uni.city}, {uni.countryName}. Explore Bachelor’s, Master’s, PhD, and Medical/Technical programs across 9
          academic categories, verify annual tuition ({uni.tuitionLabel}) and living costs ({uni.livingCostPerYearUsd}),
          and use the interactive checklist below to file your own application without an agent.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={uni.admissionsPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors"
          >
            Apply on Official University Portal <ExternalLink className="w-4 h-4" />
          </a>
          <Link
            href={`/study/${uni.countrySlug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            ← All Universities in {uni.countryName}
          </Link>
          <Link
            href={`/travel/PK/${uni.countryIso2}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            Check {uni.countryName} Visa Rules
          </Link>
        </div>
      </header>

      {/* Filter Bar for Programs */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Offered Programs, Fees &amp; Entry Requirements
          </h2>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ProgramCategorySlug | 'all')}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            >
              <option value="all">All 9 Subject Categories</option>
              {PROGRAM_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value as DegreeLevel | 'all')}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            >
              <option value="all">All Degree Levels</option>
              {DEGREE_LEVELS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <UniversityCard
          uni={uni}
          countrySlug={uni.countrySlug}
          defaultExpanded={true}
          selectedCategory={selectedCategory}
          selectedDegree={selectedDegree}
        />
      </section>

      {/* Interactive Document Checklist */}
      <section className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Interactive Document Checklist for {uni.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any document below as you prepare your PDF pack — your progress saves automatically in your browser.
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            {completedCount} / {allDocIds.length} Documents Ready
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {uni.requiredDocuments.map((grp) => (
            <div
              key={grp.category}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-3"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{grp.title}</h3>
              <div className="space-y-2">
                {grp.items.map((item) => {
                  const isDone = Boolean(checked[item.id]);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggle(item.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                        isDone
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-500'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-0.5">
                        <div
                          className={`text-xs font-bold ${
                            isDone ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {item.label}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.note}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <UnderCtaAdBand region="study-uni-under-cta" />
    </article>
  );
}

/** Country Study Destination Page (/study/:slug) — works for all 193 countries + Europe */
export function StudyDestinationPage({ dest }: { dest: StudyDestination }) {
  const cs = dest.countryStudy;
  const universities = cs?.universities || [];

  const [selectedCategory, setSelectedCategory] = useState<ProgramCategorySlug | 'all'>('all');
  const [selectedDegree, setSelectedDegree] = useState<DegreeLevel | 'all'>('all');
  const [uniSearch, setUniSearch] = useState('');

  const { checked, toggle } = useDiyChecklist(`tv-diy-country-${dest.slug}`);

  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      if (uniSearch.trim()) {
        const q = uniSearch.toLowerCase();
        const matchName = u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q);
        const matchProg = u.programs.some(
          (p) =>
            p.categoryLabel.toLowerCase().includes(q) ||
            p.popularMajors.some((m) => m.toLowerCase().includes(q))
        );
        if (!matchName && !matchProg) return false;
      }
      if (selectedCategory !== 'all') {
        const hasCat = u.programs.some((p) => p.category === selectedCategory);
        if (!hasCat) return false;
      }
      if (selectedDegree !== 'all') {
        const hasDeg = u.programs.some((p) => p.degrees.includes(selectedDegree));
        if (!hasDeg) return false;
      }
      return true;
    });
  }, [universities, uniSearch, selectedCategory, selectedDegree]);

  // Neighbouring / same-continent countries for quick navigation
  const relatedCountries = useMemo(() => {
    if (!cs) return listStudyDestinations().filter((d) => d.slug !== dest.slug);
    return ALL_COUNTRY_STUDY_SUMMARIES.filter(
      (c) => c.continent === cs.continent && c.iso2 !== cs.iso2
    ).slice(0, 12);
  }, [cs, dest.slug]);

  return (
    <article className="space-y-10 py-4 max-w-5xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Study Abroad (193 Countries)', href: '/study' },
          { label: dest.name },
        ]}
      />

      {/* Hero Banner */}
      <header className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            {dest.flag} Study in {dest.name}
          </span>
          {cs && (
            <>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {cs.continent} • {cs.region}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                Capital: {cs.capital} • Currency: {cs.currencyCode} ({cs.currencySymbol})
              </span>
              {cs.moiFriendly && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  ✓ MOI / English Proficiency Letter Accepted
                </span>
              )}
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Study in {dest.name} — Universities, Programs, Fees &amp; DIY Admission Guide
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          {dest.answerFirst}
        </p>

        {/* Country At-a-Glance Metrics */}
        {cs && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
              <div className="text-[11px] font-bold uppercase text-slate-500">Annual Tuition Band</div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                {cs.tuitionBandLabel}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
              <div className="text-[11px] font-bold uppercase text-slate-500">Living Cost / Year</div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                {cs.livingCostYearUsd}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
              <div className="text-[11px] font-bold uppercase text-slate-500">Work Rights (Student)</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                {cs.workHoursAllowed}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
              <div className="text-[11px] font-bold uppercase text-slate-500">Post-Study Work Visa</div>
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                {cs.postStudyStay}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* SECTION 1: Universities & Programs Directory in this Country */}
      {universities.length > 0 && (
        <section className="space-y-5" aria-labelledby="unis-heading">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Official Universities &amp; Programs
              </span>
              <h2 id="unis-heading" className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Universities in {dest.name} ({filteredUniversities.length})
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Filter programs by academic category or degree level, inspect annual fees, and open the 6-step DIY
                admission procedure for each institution.
              </p>
            </div>

            {/* Category & Degree Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={uniSearch}
                  onChange={(e) => setUniSearch(e.target.value)}
                  placeholder="Search university, city, major..."
                  className="pl-8 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none focus:border-brand-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ProgramCategorySlug | 'all')}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              >
                <option value="all">All 9 Subject Categories</option>
                {PROGRAM_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.icon} {c.shortName}
                  </option>
                ))}
              </select>
              <select
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value as DegreeLevel | 'all')}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              >
                <option value="all">All Degree Levels</option>
                {DEGREE_LEVELS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredUniversities.map((uni, idx) => (
              <UniversityCard
                key={uni.id}
                uni={uni}
                countrySlug={dest.slug}
                defaultExpanded={idx === 0}
                selectedCategory={selectedCategory}
                selectedDegree={selectedDegree}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: Step-by-Step DIY Self-Application Guide (No Agent Needed) */}
      {universities[0] && (
        <section
          className="p-6 sm:p-8 rounded-3xl border border-brand-200/70 dark:border-brand-900/50 bg-gradient-to-br from-brand-50/60 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 space-y-5"
          aria-labelledby="diy-guide-heading"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Zero-Agent Self-Application Blueprint
            </span>
            <h2 id="diy-guide-heading" className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              How to File Your Own Admission in {dest.name} (Step-by-Step DIY Procedure)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Click any step below to mark it complete as you prepare and submit your application to {dest.name}:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5">
            {universities[0].admissionSteps.map((st) => {
              const stepKey = `step-${st.step}`;
              const isDone = Boolean(checked[stepKey]);
              return (
                <div
                  key={st.step}
                  className={`p-4 rounded-2xl border transition-all space-y-2 ${
                    isDone
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggle(stepKey)}
                      className="flex items-center gap-2 text-left"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-brand-600 shrink-0" />
                      )}
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Step {st.step}: {st.title}
                      </span>
                    </button>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                      {st.timeline}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-7">{st.detail}</p>
                  <div className="pl-7 flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      💡 {st.proTip}
                    </span>
                    {st.toolHref && (
                      <Link
                        href={st.toolHref}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
                      >
                        {st.toolLabel} <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 3: Overview & Admission Pathways */}
      <div className="grid md:grid-cols-2 gap-6">
        <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3" aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="text-lg font-bold text-slate-900 dark:text-white">
            Higher Education Overview — {dest.name}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{dest.overview}</p>
          <div className="space-y-3 pt-2">
            {dest.pathways.map((p) => (
              <div key={p.title} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{p.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Required Documents Checklist */}
        <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3" aria-labelledby="docs-heading">
          <h2 id="docs-heading" className="text-lg font-bold text-slate-900 dark:text-white">
            Required Documents Checklist (Click to Track)
          </h2>
          <p className="text-xs text-slate-500">
            Tick each document as you scan and attest it. Your checklist stays saved in your browser.
          </p>
          <div className="space-y-2">
            {dest.documents.map((d, idx) => {
              const docKey = `doc-${idx}`;
              const isDone = Boolean(checked[docKey]);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggle(docKey)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                    isDone
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-slate-500 line-through'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-brand-500'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <span className="font-medium leading-relaxed">{d}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* SECTION 5: Fees & Visa Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3" aria-labelledby="fees-heading">
          <h2 id="fees-heading" className="text-lg font-bold text-slate-900 dark:text-white">
            Tuition Fees &amp; Living Cost Breakdown
          </h2>
          <p className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed rounded-xl border border-amber-200/80 dark:border-amber-800/50 bg-amber-50/80 dark:bg-amber-950/30 px-3 py-2">
            {dest.feeYearNote}
          </p>
          <dl className="space-y-3 pt-1">
            {dest.feeRanges.map((f) => (
              <div key={f.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <dt className="text-xs font-bold text-slate-900 dark:text-white">{f.label}</dt>
                <dd className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  <span className="font-extrabold text-brand-600 dark:text-brand-400">{f.range}</span>
                  {f.note ? <span className="block text-xs text-slate-500 mt-0.5">{f.note}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3" aria-labelledby="visa-heading">
          <h2 id="visa-heading" className="text-lg font-bold text-slate-900 dark:text-white">
            Student Visa, Portals &amp; Official Links
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{dest.visaSummary}</p>
          <ul className="space-y-2 text-xs sm:text-sm pt-1">
            {dest.officialLinks.map((l) => (
              <li key={l.href + l.label}>
                <ExtLink href={l.href}>{l.label}</ExtLink>
                {l.note ? <span className="text-slate-500"> — {l.note}</span> : null}
              </li>
            ))}
          </ul>
          {(dest.travelHref || dest.regionHubHref) && (
            <div className="flex flex-wrap gap-2 pt-2">
              {dest.travelHref && (
                <Link
                  href={dest.travelHref}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:border-brand-500"
                >
                  Check Visa &amp; Travel Route <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              {dest.regionHubHref && (
                <Link
                  href={dest.regionHubHref}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:border-brand-500"
                >
                  {dest.name} Tools Hub <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          )}
        </section>
      </div>

      {/* SECTION 6: Frequently Asked Questions */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Frequently Asked Questions — Studying in {dest.name}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {dest.faqs.map((faq) => (
            <div key={faq.question} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{faq.question}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: Free ToolVerse Student Application Toolkit */}
      <section className="space-y-3" aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Free ToolVerse Student Tools for Your Application Pack
        </h2>
        <div className="flex flex-wrap gap-2">
          {dest.tools.map((t) => (
            <Link
              key={t.href + t.label}
              href={t.href}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 text-slate-700 dark:text-slate-200"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 8: Explore More Countries */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Explore More Study Destinations
          </h2>
          <Link href="/study" className="text-xs font-bold text-brand-600 hover:underline">
            View All 193 Countries →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {relatedCountries.map((o) => (
            <Link
              key={o.slug}
              href={`/study/${o.slug}`}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/50 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between"
            >
              <span className="truncate">
                {o.flag} {o.name}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      <UnderCtaAdBand region="study-dest-under-cta" />
    </article>
  );
}
