'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Briefcase,
  Car,
  GraduationCap,
  MapPin,
  Scale,
  Search,
  Wrench,
} from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CATEGORIES, TOOLS } from '@/lib/tools/registry';
import { CARS_BLOG_POSTS, getPillarPosts } from '@/lib/blog/posts';
import { listStudyDestinations } from '@/lib/study/destinations';

type SitemapLink = { href: string; label: string; hint?: string };

const JOB_LINKS: SitemapLink[] = [
  { href: '/jobs/remote-jobs', label: 'Remote Jobs Worldwide' },
  { href: '/jobs/usa-jobs', label: 'Jobs in the United States' },
  { href: '/jobs/software-engineer-jobs', label: 'Software Engineer Jobs' },
  { href: '/jobs/data-entry-jobs', label: 'Data Entry & VA Jobs' },
  { href: '/jobs/pakistan-govt-jobs', label: 'Pakistan Government Jobs' },
];

const LEGAL_LINKS: SitemapLink[] = [
  { href: '/legal/about', label: 'About ToolVerse' },
  { href: '/legal/about-our-tools', label: 'About our tools' },
  { href: '/legal/contact', label: 'Contact' },
  { href: '/legal/privacy-policy', label: 'Privacy Policy' },
  { href: '/legal/terms-of-use', label: 'Terms of Use' },
  { href: '/legal/editorial-policy', label: 'Editorial Policy' },
  { href: '/legal/disclaimer', label: 'Disclaimer' },
  { href: '/legal/cookie-policy', label: 'Cookie Policy' },
  { href: '/legal/dmca', label: 'DMCA' },
  { href: '/legal/security', label: 'Security' },
];

const HUB_LINKS: SitemapLink[] = [
  { href: '/us', label: 'United States hub', hint: 'Paycheck, tax & local tools' },
  { href: '/uk', label: 'United Kingdom hub', hint: 'Take-home pay & UK utilities' },
  { href: '/ca', label: 'Canada hub', hint: 'CAD planning helpers' },
  { href: '/au', label: 'Australia hub', hint: 'AUD planning helpers' },
  { href: '/immigration', label: 'Immigration hub' },
  { href: '/travel', label: 'Travel Intelligence' },
  { href: '/passport-photos', label: 'Passport photo sizes' },
  { href: '/seo', label: 'SEO Suite' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/news', label: 'News headlines' },
  { href: '/how-to', label: 'How-to guides' },
];

function matchesQuery(q: string, ...parts: (string | undefined)[]) {
  if (!q) return true;
  const hay = parts.filter(Boolean).join(' ').toLowerCase();
  return hay.includes(q);
}

function SectionHeader({
  id,
  icon: Icon,
  title,
  count,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count: number;
}) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4 scroll-mt-28" id={id}>
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600/10 text-brand-700 dark:text-brand-400">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 tabular-nums">
        {count} {count === 1 ? 'link' : 'links'}
      </span>
    </div>
  );
}

function LinkGrid({ links }: { links: SitemapLink[] }) {
  if (links.length === 0) {
    return <p className="text-sm text-slate-500">No matches in this section.</p>;
  }
  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
      {links.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className="group inline-flex flex-col py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
          >
            <span className="font-medium underline-offset-2 group-hover:underline">{l.label}</span>
            {l.hint ? (
              <span className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">{l.hint}</span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function HtmlSitemapPage() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const liveTools = useMemo(
    () => TOOLS.filter((t) => t.status === 'live'),
    []
  );

  const toolsByCategory = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const tools = liveTools
        .filter((t) => t.categorySlug === cat.slug)
        .filter((t) => matchesQuery(q, t.canonicalName, t.slug, cat.name, t.shortDescription))
        .map(
          (t): SitemapLink => ({
            href: `/tools/${t.slug}`,
            label: t.canonicalName,
            hint: t.shortDescription,
          })
        );
      const catMatch = matchesQuery(q, cat.name, cat.slug, cat.description);
      return {
        cat,
        tools,
        showCategory: catMatch || tools.length > 0,
        categoryLink: { href: `/category/${cat.slug}`, label: `${cat.name} overview` } as SitemapLink,
      };
    }).filter((row) => row.showCategory && (row.tools.length > 0 || !q || matchesQuery(q, row.cat.name)));
  }, [liveTools, q]);

  const toolsLinkCount = toolsByCategory.reduce(
    (n, row) => n + row.tools.length + (matchesQuery(q, row.cat.name) || !q ? 1 : 0),
    0
  );

  const pillarPosts = useMemo(() => getPillarPosts(), []);
  const blogLinks = useMemo(() => {
    const hub: SitemapLink[] = [
      { href: '/blog', label: 'Blog hub' },
      { href: '/blog/topics', label: 'Topic clusters' },
    ].filter((l) => matchesQuery(q, l.label));
    const posts = pillarPosts
      .filter((p) => matchesQuery(q, p.title, p.slug, p.category))
      .slice(0, q ? 80 : 40)
      .map(
        (p): SitemapLink => ({
          href: `/blog/${p.slug}`,
          label: p.title,
          hint: p.category,
        })
      );
    return [...hub, ...posts];
  }, [pillarPosts, q]);

  const studyLinks = useMemo(() => {
    const hub: SitemapLink[] = [{ href: '/study', label: 'Study Abroad hub' }].filter((l) =>
      matchesQuery(q, l.label, 'study')
    );
    const dests = listStudyDestinations()
      .filter((d) => matchesQuery(q, d.name, d.slug, 'study'))
      .map(
        (d): SitemapLink => ({
          href: `/study/${d.slug}`,
          label: `Study in ${d.name}`,
          hint: d.flag,
        })
      );
    return [...hub, ...dests];
  }, [q]);

  const carsLinks = useMemo(() => {
    const hub: SitemapLink[] = [
      { href: '/cars', label: 'Cars hub', hint: 'Loan, fuel, insurance ranges' },
    ].filter((l) => matchesQuery(q, l.label, l.hint, 'cars'));
    const posts = CARS_BLOG_POSTS.filter((p) => matchesQuery(q, p.title, p.slug, 'cars')).map(
      (p): SitemapLink => ({
        href: `/blog/${p.slug}`,
        label: p.title,
      })
    );
    return [...hub, ...posts];
  }, [q]);

  const jobLinks = useMemo(
    () => JOB_LINKS.filter((l) => matchesQuery(q, l.label, 'jobs')),
    [q]
  );
  const legalLinks = useMemo(
    () => LEGAL_LINKS.filter((l) => matchesQuery(q, l.label, 'legal')),
    [q]
  );
  const hubLinks = useMemo(
    () => HUB_LINKS.filter((l) => matchesQuery(q, l.label, l.hint, 'hub')),
    [q]
  );

  const jumpItems = [
    { id: 'tools', label: 'Tools', count: toolsLinkCount },
    { id: 'blog', label: 'Blog', count: blogLinks.length },
    { id: 'study', label: 'Study', count: studyLinks.length },
    { id: 'cars', label: 'Cars', count: carsLinks.length },
    { id: 'jobs', label: 'Jobs', count: jobLinks.length },
    { id: 'legal', label: 'Legal', count: legalLinks.length },
    { id: 'hubs', label: 'Hubs', count: hubLinks.length },
  ];

  return (
    <div className="relative pb-16">
      {/* Soft atmospheric backdrop — brand blue, not purple */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-6 h-72 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/70 via-slate-50/40 to-transparent dark:from-slate-900 dark:via-slate-950/80 dark:to-transparent" />
        <div className="absolute -top-24 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
      </div>

      <Breadcrumb items={[{ label: 'Sitemap' }]} />

      <header className="max-w-3xl space-y-4 mb-10">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Site directory</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Sitemap
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Browse every public ToolVerse page — tools by category, guides, study destinations, cars,
          jobs, legal pages, and regional hubs. Use search to jump straight to a page.
        </p>
      </header>

      <div className="sticky top-0 z-20 -mx-1 px-1 py-3 mb-8 backdrop-blur-md bg-slate-50/85 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-slate-800/80">
        <label className="relative block max-w-xl">
          <span className="sr-only">Filter sitemap</span>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, guides, hubs…"
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
            autoComplete="off"
          />
        </label>
        <nav
          aria-label="Sitemap sections"
          className="mt-3 flex flex-wrap gap-2"
        >
          {jumpItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 hover:border-brand-500/50 hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
            >
              {item.label}
              <span className="tabular-nums text-slate-400">{item.count}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="space-y-14">
        <section aria-labelledby="tools-heading">
          <SectionHeader id="tools" icon={Wrench} title="Tools by category" count={toolsLinkCount} />
          <p id="tools-heading" className="sr-only">
            Tools by category
          </p>
          <div className="space-y-8">
            {toolsByCategory.length === 0 ? (
              <p className="text-sm text-slate-500">No tools match your search.</p>
            ) : (
              toolsByCategory.map(({ cat, tools, categoryLink }) => (
                <div key={cat.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                    <Link
                      href={categoryLink.href}
                      className="text-xs font-semibold text-brand-600 hover:underline"
                    >
                      Category page →
                    </Link>
                  </div>
                  <LinkGrid links={tools} />
                </div>
              ))
            )}
          </div>
        </section>

        <section aria-labelledby="blog-heading">
          <SectionHeader id="blog" icon={BookOpen} title="Blog & guides" count={blogLinks.length} />
          <p id="blog-heading" className="sr-only">
            Blog and guides
          </p>
          <LinkGrid links={blogLinks} />
          {!q ? (
            <p className="mt-3 text-xs text-slate-500">
              Showing editorial guides first. Every live tool also has a how-to under{' '}
              <Link href="/blog" className="text-brand-600 font-semibold hover:underline">
                /blog
              </Link>
              .
            </p>
          ) : null}
        </section>

        <section aria-labelledby="study-heading">
          <SectionHeader id="study" icon={GraduationCap} title="Study abroad" count={studyLinks.length} />
          <p id="study-heading" className="sr-only">
            Study abroad
          </p>
          <LinkGrid links={studyLinks} />
        </section>

        <section aria-labelledby="cars-heading">
          <SectionHeader id="cars" icon={Car} title="Cars" count={carsLinks.length} />
          <p id="cars-heading" className="sr-only">
            Cars
          </p>
          <LinkGrid links={carsLinks} />
        </section>

        <section aria-labelledby="jobs-heading">
          <SectionHeader id="jobs" icon={Briefcase} title="Jobs" count={jobLinks.length} />
          <p id="jobs-heading" className="sr-only">
            Jobs
          </p>
          <LinkGrid links={jobLinks} />
        </section>

        <section aria-labelledby="legal-heading">
          <SectionHeader id="legal" icon={Scale} title="Legal & trust" count={legalLinks.length} />
          <p id="legal-heading" className="sr-only">
            Legal and trust
          </p>
          <LinkGrid links={legalLinks} />
        </section>

        <section aria-labelledby="hubs-heading">
          <SectionHeader id="hubs" icon={MapPin} title="Regional hubs & more" count={hubLinks.length} />
          <p id="hubs-heading" className="sr-only">
            Regional hubs and more
          </p>
          <LinkGrid links={hubLinks} />
        </section>
      </div>

      <p className="mt-12 text-xs text-slate-500 leading-relaxed max-w-2xl">
        Looking for the machine-readable map? Search engines use{' '}
        <a
          href="/sitemap.xml"
          className="text-brand-600 font-semibold hover:underline"
        >
          sitemap.xml
        </a>
        .
      </p>
    </div>
  );
}
