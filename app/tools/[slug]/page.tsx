import React from 'react';
import Link from 'next/link';
import { getToolBySlug, getToolById, getToolsByCategory, TOOLS } from '@/lib/tools/registry';
import { getToolPageContent } from '@/lib/seo/toolPageContent';
import { getGuidePostForTool } from '@/lib/blog/posts';
import { ToolRenderer } from '@/features/tools/ToolRenderer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AdSlot } from '@/components/AdSlot';
import { ShieldCheck, Info, CheckCircle2, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolverse.baby';

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) return { title: 'Tool Not Found — ToolVerse' };

  const seo = getToolPageContent(tool.slug);
  const pageTitle = seo?.seoTitle ?? `${tool.canonicalName} — Free Online Tool | ToolVerse`;
  const pageDesc =
    seo?.seoDescription ??
    `${tool.shortDescription} Free, fast, and private — processed locally in your browser.`;
  const canonicalUrl = `${siteUrl}/tools/${tool.slug}`;

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: [...tool.keywords, 'free online tool', 'toolverse'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      siteName: 'ToolVerse',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
    },
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tool Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">The tool you are looking for does not exist or may have been moved.</p>
        <Link href="/" className="inline-block px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-semibold text-sm">
          Back to All Tools
        </Link>
      </div>
    );
  }

  const pageContent = getToolPageContent(tool.slug);
  const guidePost = getGuidePostForTool(tool.slug);

  const relatedFromIds = (tool.relatedToolIds || [])
    .map((id) => getToolById(id))
    .filter((t): t is NonNullable<typeof t> => t !== undefined);

  // Fill to 3 with same-category siblings for denser internal links
  const relatedTools = [...relatedFromIds];
  if (relatedTools.length < 3) {
    for (const sibling of getToolsByCategory(tool.categorySlug)) {
      if (sibling.slug === tool.slug) continue;
      if (relatedTools.some((r) => r.slug === sibling.slug)) continue;
      relatedTools.push(sibling);
      if (relatedTools.length >= 3) break;
    }
  }

  const faqList = pageContent?.faqs ?? [
    {
      question: `Is ${tool.canonicalName} completely free to use?`,
      answer: `Yes, ${tool.canonicalName} is free with unlimited usage. No hidden fees or sign-up required.`,
    },
    {
      question: `Is my data safe and private when using ${tool.canonicalName}?`,
      answer: `${tool.privacyMessage} Client-side tools process data in your browser where possible.`,
    },
    {
      question: `Does ${tool.canonicalName} work on mobile phones and tablets?`,
      answer: `Yes. ${tool.canonicalName} is responsive and works on phones, tablets, and desktops.`,
    },
  ];

  return (
    <div className="space-y-10 max-w-4xl mx-auto py-4">
      <div className="space-y-3">
        <Breadcrumb
          items={[
            { label: tool.category, href: `/category/${tool.categorySlug}` },
            { label: tool.canonicalName },
          ]}
        />

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {tool.canonicalName}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {pageContent?.answerFirst || tool.shortDescription}
        </p>

        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{tool.privacyMessage}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <ToolRenderer tool={tool} />
      </div>

      {guidePost && (
        <aside className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-brand-200/70 dark:border-brand-800/60 bg-brand-50/80 dark:bg-brand-950/40 px-4 py-3">
          <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
            <BookOpen className="w-4 h-4 mt-0.5 text-brand-600 shrink-0" />
            <p>
              New to this workflow?{' '}
              <span className="font-medium text-slate-900 dark:text-white">Read the full guide</span> for steps,
              when not to use it, and common mistakes.
            </p>
          </div>
          <Link
            href={`/blog/${guidePost.slug}`}
            className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-brand-700 dark:text-brand-300 whitespace-nowrap hover:underline"
          >
            {guidePost.isToolGuide ? 'How-to guide' : 'Full guide'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </aside>
      )}

      <AdSlot slotId="tool-middle-ad" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3">
          <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-brand-600" /> How to Use {tool.canonicalName}
          </h2>
          <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal pl-4">
            {tool.instructions.map((step, idx) => (
              <li key={idx} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3">
          <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Common Use Cases
          </h2>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc pl-4">
            {tool.useCases.map((useCase, idx) => (
              <li key={idx} className="leading-relaxed">{useCase}</li>
            ))}
          </ul>
        </div>
      </div>

      {pageContent?.sections?.length ? (
        <div className="space-y-6">
          {pageContent.sections.map((section) => (
            <section key={section.heading} className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{section.heading}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
      ) : null}

      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-500" /> Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqList.map((faq) => (
            <div key={faq.question} className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{faq.question}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {relatedTools.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">Related Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((rel) => (
              <Link key={rel.id} href={`/tools/${rel.slug}`} className="tool-card group p-4">
                <div className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-brand-600">
                  {rel.canonicalName}
                </div>
                <div className="text-xs text-slate-500 line-clamp-2 mt-1">{rel.shortDescription}</div>
              </Link>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Browse more in{' '}
            <Link href={`/category/${tool.categorySlug}`} className="text-brand-600 font-medium hover:underline">
              {tool.category}
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
