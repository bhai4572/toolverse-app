import React, { useMemo, useState } from 'react';
import { BLOG_POSTS, getPillarPosts } from '@/lib/blog/posts';
import { BLOG_HUB_CATEGORIES } from '@/lib/blog/types';
import { AdSlot } from '@/components/AdSlot';
import { PageSidebarAds } from '@/components/ads/PageSidebarAds';
import { Breadcrumb } from '@/components/Breadcrumb';

const PAGE_SIZE = 12;

export default function BlogHubPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [page, setPage] = useState(1);

  const pillars = useMemo(() => getPillarPosts(), []);

  const filteredPosts = useMemo(() => {
    const list =
      selectedCategory === 'All'
        ? BLOG_POSTS
        : BLOG_POSTS.filter((post) => post.category === selectedCategory);
    return [...list].sort((a, b) => {
      if (!!a.isToolGuide !== !!b.isToolGuide) return a.isToolGuide ? 1 : -1;
      return a.title.localeCompare(b.title);
    });
  }, [selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagePosts = filteredPosts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const onCategory = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  /** Mid-list break after every 6 cards (2 rows × 3 cols) */
  const listWithBreaks: React.ReactNode[] = [];
  pagePosts.forEach((post, idx) => {
    listWithBreaks.push(
      <article
        key={post.slug}
        className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
      >
        <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={post.featuredImage}
            alt={post.title}
            width={640}
            height={192}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold rounded-md">
              {post.category}
            </span>
            {post.isToolGuide && (
              <span className="px-2.5 py-1 bg-emerald-700/90 text-white text-xs font-semibold rounded-md">
                Tool guide
              </span>
            )}
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2">
              <span>{post.publishDate}</span>
              <span>•</span>
              <span>{post.readTimeMinutes} min read</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
              <a href={`/blog/${post.slug}`}>{post.title}</a>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
              {post.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">By {post.author}</span>
            <a
              href={`/blog/${post.slug}`}
              className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform"
            >
              Read Article →
            </a>
          </div>
        </div>
      </article>
    );

    if ((idx + 1) % 6 === 0 && idx < pagePosts.length - 1) {
      listWithBreaks.push(
        <div
          key={`blog-ad-break-${idx}`}
          className="col-span-full flex justify-center py-2 min-h-[90px] md:min-h-[250px] items-center"
        >
          {(idx + 1) % 12 === 0 ? (
            <AdSlot slot="native" bare className="w-full max-w-[728px]" />
          ) : (
            <AdSlot slot="in-content" bare />
          )}
        </div>
      );
    }
  });

  return (
    <div className="space-y-8 py-4">
      <Breadcrumb items={[{ label: 'Blog' }]} />

      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider">
          ToolVerse Knowledge Hub
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Guides for Tools, Careers & Privacy
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          Pillar guides plus a how-to for every live ToolVerse utility — with clear CTAs back to the free tools.
          Filter by topic or browse page by page.
        </p>
        <p className="text-sm text-slate-500">
          {BLOG_POSTS.length} articles · {pillars.length} pillar guides · {BLOG_POSTS.length - pillars.length} tool
          how-tos
          {' · '}
          <a href="/blog/topics" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            US topic clusters
          </a>
        </p>
      </header>

      <PageSidebarAds>
        <div className="space-y-8">
          <div className="flex flex-wrap gap-2 justify-center pb-2">
            {BLOG_HUB_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {listWithBreaks}
          </div>

          {totalPages > 1 && (
            <nav className="flex flex-wrap items-center justify-center gap-3" aria-label="Blog pagination">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}

          <AdSlot slot="native" />
        </div>
      </PageSidebarAds>
    </div>
  );
}
