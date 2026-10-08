import React from 'react';
import Link from 'next/link';
import JobTools from '@/features/tools/JobTools';
import { AdSlot } from '@/components/AdSlot';
import { PageSidebarAds } from '@/components/ads/PageSidebarAds';
import { JobsGridWithAds } from '@/components/ads/JobsGridWithAds';
import { getJobPageContent } from '@/lib/seo/jobPageContent';
import { getBlogPostBySlug } from '@/lib/blog/posts';
import { getToolBySlug } from '@/lib/tools/registry';
import { Breadcrumb } from '@/components/Breadcrumb';

interface Props {
  params: {
    slug: string;
  };
}

export default function JobCategoryPage({ params }: Props) {
  const config = getJobPageContent(params.slug) || {
    title: 'Global Job Search',
    subtitle: 'Find active vacancies worldwide, then apply on the original posting.',
    seoTitle: 'Job Search — ToolVerse',
    seoDescription:
      'Search jobs across tech, government, banking, healthcare, and remote sectors. Apply on official employer sites.',
    intro:
      'ToolVerse helps you discover listings from multiple sources. Always verify the employer and apply on the original career page or job board.',
    sections: [
      {
        heading: 'Stay safe while job hunting',
        body: 'Ignore recruiters who demand payment, gift cards, or crypto to “guarantee” a role. Legitimate employers do not charge candidates to get hired.',
      },
    ],
    faqs: [
      {
        question: 'Does ToolVerse employ me?',
        answer: 'No. We are not the hiring company for third-party listings.',
      },
    ],
    relatedToolSlugs: ['global-job-finder', 'pdf-merge'],
  };

  const relatedTools = (config.relatedToolSlugs || [])
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const relatedPosts = (config.relatedBlogSlugs || [])
    .map((slug) => getBlogPostBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const featuredCards =
    config.featuredPostings?.map((posting) => (
      <div
        key={posting.title}
        className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2 hover:border-brand-500 transition-colors"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">{posting.title}</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 uppercase shrink-0">
            {posting.employmentType.replace('_', ' ')}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {posting.hiringOrganization.name} •{' '}
          {posting.jobLocation?.locality ||
            (posting.jobLocationType === 'TELECOMMUTE' ? 'Remote Worldwide' : 'United States')}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
          {posting.description}
        </p>
        {posting.salary && (
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
            Est. Salary: {posting.salary.currency} {posting.salary.value.toLocaleString()} /{' '}
            {posting.salary.unitText.toLowerCase()}
          </p>
        )}
      </div>
    )) ?? [];

  return (
    <div className="space-y-8 py-4">
      <Breadcrumb items={[{ label: 'Jobs', href: '/tools/global-job-finder' }, { label: config.title }]} />

      <PageSidebarAds
        rightRail={
          relatedTools.length > 0 ? (
            <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Helpful tools</h3>
              <ul className="space-y-2">
                {relatedTools.map((tool) => (
                  <li key={tool.slug}>
                    <Link href={`/tools/${tool.slug}`} className="text-xs font-medium text-brand-600 hover:underline">
                      {tool.canonicalName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null
        }
      >
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">ToolVerse Job Finder</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {config.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {config.subtitle}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">{config.intro}</p>
        </header>

        <AdSlot slot="under-title" className="my-2" />

        {featuredCards.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured Verified Openings</h2>
              <span className="text-xs font-medium text-brand-600 dark:text-brand-400">Google Jobs Eligible</span>
            </div>
            <JobsGridWithAds cards={featuredCards} every={4} />
          </section>
        )}

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
          <JobTools />
        </div>

        <AdSlot slot="in-content" />

        {config.sections.map((section) => (
          <section key={section.heading} className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{section.heading}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{section.body}</p>
          </section>
        ))}

        {config.faqs.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Frequently asked questions</h2>
            <div className="space-y-3">
              {config.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60"
                >
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{faq.question}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedPosts.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Related guides</h2>
            <ul className="space-y-2">
              {relatedPosts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="text-sm text-brand-600 font-medium hover:underline">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <AdSlot slot="native" />
      </PageSidebarAds>
    </div>
  );
}
