import React from 'react';
import Link from 'next/link';
import { CATEGORIES, getToolsByCategory } from '@/lib/tools/registry';
import { getCategoryPageContent } from '@/lib/seo/categoryPageContent';
import { getBlogPostBySlug } from '@/lib/blog/posts';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolverse.baby';

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) return { title: 'Category Not Found — ToolVerse' };

  const seo = getCategoryPageContent(cat.slug);
  const canonicalUrl = `${siteUrl}/category/${cat.slug}`;
  const title = seo?.seoTitle ?? `${cat.name} — Free Online Tools | ToolVerse`;
  const description =
    seo?.seoDescription ?? `${cat.description} Free, fast, privacy-first browser utilities.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'ToolVerse',
      type: 'website',
    },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES.find((c) => c.slug === params.slug);
  if (!cat) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Category Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">The requested category does not exist.</p>
        <Link href="/" className="inline-block px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-semibold text-sm">
          Return to Home
        </Link>
      </div>
    );
  }

  const categoryTools = getToolsByCategory(cat.slug);
  const pageContent = getCategoryPageContent(cat.slug);
  const relatedPosts = (pageContent?.relatedBlogSlugs || [])
    .map((slug) => getBlogPostBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      <Breadcrumb items={[{ label: cat.name }]} />

      <div className="space-y-3 max-w-3xl">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{cat.name}</h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          {pageContent?.intro || cat.description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryTools.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="tool-card group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <h2 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                {tool.canonicalName}
              </h2>
              <p className="text-xs text-slate-500 line-clamp-2">{tool.shortDescription}</p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-brand-600">
              <span>Use Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {pageContent?.sections?.map((section) => (
        <section key={section.heading} className="max-w-3xl space-y-2 pt-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{section.heading}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{section.body}</p>
        </section>
      ))}

      {relatedPosts.length > 0 && (
        <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Related guides</h2>
          <ul className="space-y-2">
            {relatedPosts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="text-sm text-brand-600 hover:underline font-medium">
                  {post.title}
                </Link>
                <p className="text-xs text-slate-500 mt-0.5">{post.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
