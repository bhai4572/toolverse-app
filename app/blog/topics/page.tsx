import React from 'react';
import { BLOG_TOPIC_CLUSTERS, getBlogPostBySlug } from '@/lib/blog/posts';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PageSidebarAds } from '@/components/ads/PageSidebarAds';
import { AdSlot } from '@/components/AdSlot';

export default function BlogTopicsPage() {
  return (
    <div className="space-y-8 py-4">
      <Breadcrumb items={[{ label: 'Blog', href: '/blog' }, { label: 'Topics' }]} />

      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider">
          Topic clusters
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          US Interest Topics → Free Tools
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          Evergreen how-to, money, and privacy guides that ride real US interest themes (gaming launches,
          concerts, deal events, paychecks) without thin news spam — each cluster links back to ToolVerse
          utilities.
        </p>
        <p className="text-sm text-slate-500">
          <a href="/blog" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            ← All guides
          </a>
        </p>
      </header>

      <PageSidebarAds>
        <div className="space-y-10">
          {BLOG_TOPIC_CLUSTERS.map((cluster) => {
            const posts = cluster.slugs
              .map((slug) => getBlogPostBySlug(slug))
              .filter((p): p is NonNullable<typeof p> => Boolean(p));

            return (
              <section
                key={cluster.id}
                id={cluster.id}
                className="space-y-4 scroll-mt-24"
              >
                <div className="space-y-2 max-w-3xl">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{cluster.title}</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {cluster.description}
                  </p>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {posts.map((post) => (
                    <li key={post.slug}>
                      <a
                        href={`/blog/${post.slug}`}
                        className="block h-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-indigo-400 transition-colors space-y-2"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {post.category}
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-white leading-snug">{post.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {post.description}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          <AdSlot slot="native" />
        </div>
      </PageSidebarAds>
    </div>
  );
}
