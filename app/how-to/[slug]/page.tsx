import React from 'react';
import Link from 'next/link';
import { HOW_TO_GUIDES } from '../page';

interface HowToDetailPageProps {
  params: { slug: string };
}

export default function HowToGuideDetailPage({ params }: HowToDetailPageProps) {
  const guide = HOW_TO_GUIDES.find((g) => g.slug === params.slug);

  if (!guide) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Guide Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          We moved our in-depth, hand-written tool tutorials to the main ToolVerse Guides &amp; Blog hub.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link href="/blog" className="text-brand-600 font-bold hover:underline">
            Browse Tool Guides &rarr;
          </Link>
          <Link href="/tools" className="text-slate-600 dark:text-slate-300 font-semibold hover:underline">
            All Tools
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="space-y-8 max-w-4xl mx-auto text-sm text-slate-700 dark:text-slate-300">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 space-x-2">
        <Link href="/" className="hover:underline">Home</Link> &gt;
        <Link href="/how-to" className="hover:underline">How-To</Link> &gt;
        <span className="text-slate-800 dark:text-slate-200 font-semibold">{guide.title}</span>
      </nav>

      <header className="space-y-3 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-full">
          {guide.category}
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">{guide.title}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">{guide.description}</p>
      </header>

      <section className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">About This Topic</h2>
        <p>{guide.description}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Looking for practical step-by-step tutorials for our PDF, image, CV, and calculator utilities? Visit the{' '}
          <Link href="/blog" className="text-brand-600 font-semibold hover:underline">
            ToolVerse Guides &amp; Blog
          </Link>{' '}
          or open any utility directly from the{' '}
          <Link href="/tools" className="text-brand-600 font-semibold hover:underline">
            Tools Hub
          </Link>.
        </p>
      </section>
    </article>
  );
}
