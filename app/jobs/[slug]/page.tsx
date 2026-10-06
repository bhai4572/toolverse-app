import React from 'react';
import Link from 'next/link';
import JobTools from '@/features/tools/JobTools';
import { AdSlot } from '@/components/AdSlot';
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

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Jobs', href: '/tools/global-job-finder' }, { label: config.title }]} />

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

      <AdSlot placement="header" />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
        <JobTools />
      </div>

      <AdSlot placement="footer" />

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

      {relatedTools.length > 0 && (
        <section className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Helpful tools</h2>
          <ul className="grid sm:grid-cols-3 gap-3">
            {relatedTools.map((tool) => (
              <li key={tool.slug}>
                <Link href={`/tools/${tool.slug}`} className="tool-card block p-3">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{tool.canonicalName}</div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tool.shortDescription}</p>
                </Link>
              </li>
            ))}
          </ul>
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
    </div>
  );
}
