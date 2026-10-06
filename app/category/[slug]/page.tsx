import React from 'react';
import Link from 'next/link';
import { CATEGORIES, getToolsByCategory, getToolBySlug } from '@/lib/tools/registry';
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
  const relatedCategories = (pageContent?.relatedCategorySlugs || [])
    .map((slug) => CATEGORIES.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const featuredTools = (pageContent?.featuredToolSlugs || [])
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t) && t.status === 'live');

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      <Breadcrumb items={[{ label: cat.name }]} />

      <header className="space-y-3 max-w-3xl">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{cat.name}</h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          {pageContent?.intro || cat.description}
        </p>
      </header>

      {featuredTools.length > 0 && (
        <section className="space-y-3" aria-labelledby="featured-tools-heading">
          <h2 id="featured-tools-heading" className="text-lg font-bold text-slate-900 dark:text-white">
            Start with these tools
          </h2>
          <ul className="flex flex-wrap gap-2">
            {featuredTools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="inline-flex text-sm font-medium text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/60 px-3 py-1.5 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/40"
                >
                  {tool.canonicalName}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

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

      {relatedCategories.length > 0 && (
        <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Related categories</h2>
          <ul className="grid sm:grid-cols-3 gap-3">
            {relatedCategories.map((rel) => (
              <li key={rel.slug}>
                <Link href={`/category/${rel.slug}`} className="tool-card block p-3">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{rel.name}</div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{rel.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedPosts.length > 0 && (
        <section className="space-y-3 pt-2">
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
