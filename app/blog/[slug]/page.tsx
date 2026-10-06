import React from 'react';
import { getBlogPostBySlug, BLOG_POSTS } from '@/lib/blog/posts';
import { getToolBySlug } from '@/lib/tools/registry';
import { AdSlot } from '@/components/AdSlot';

interface Props {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="text-center py-20 space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Article Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400">The requested guide or article does not exist.</p>
        <a href="/blog" className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl">
          Back to Blog Hub
        </a>
      </div>
    );
  }

  const relatedTool = post.relatedToolSlug ? getToolBySlug(post.relatedToolSlug) : null;
  const recentPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="max-w-4xl mx-auto py-6 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 space-x-2">
        <a href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</a>
        <span>/</span>
        <a href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</a>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium truncate">{post.title}</span>
      </nav>

      {/* Article Header */}
      <header className="space-y-6 text-center sm:text-left">
        <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold uppercase">
            {post.category}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {post.publishDate} • {post.readTimeMinutes} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {post.description}
        </p>

        <div className="flex items-center space-x-3 pt-2 justify-center sm:justify-start border-t border-b border-slate-200 dark:border-slate-800 py-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            TV
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{post.author}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">ToolVerse Senior Editorial</div>
          </div>
        </div>
      </header>

      <AdSlot placement="header" />

      {/* Featured Image */}
      <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-[400px] object-cover"
        />
      </div>

      {/* Embedded Related Tool Call-to-Action Card */}
      {relatedTool && (
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-500/30">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Featured Tool</span>
            <h3 className="text-xl font-bold">{relatedTool.canonicalName}</h3>
            <p className="text-slate-300 text-sm">{relatedTool.shortDescription}</p>
          </div>
          <a
            href={`/tools/${relatedTool.slug}`}
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all text-sm whitespace-nowrap"
          >
            Launch Tool Free →
          </a>
        </div>
      )}

      {/* Main Body Markdown Content */}
      <div className="prose prose-indigo dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-lg leading-relaxed space-y-6">
        {post.contentMarkdown.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('# ')) {
            return null; // Skip duplicate title
          }
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-2xl font-bold text-slate-900 dark:text-white pt-4 border-t border-slate-200 dark:border-slate-800">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl font-semibold text-slate-900 dark:text-white pt-2">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('- ')) {
            return (
              <ul key={idx} className="list-disc list-inside space-y-2 pl-4 text-slate-700 dark:text-slate-300">
                {paragraph.split('\n').map((item, itemIdx) => (
                  <li key={itemIdx}>{item.replace('- ', '')}</li>
                ))}
              </ul>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      {/* FAQ Section */}
      {post.faqs && post.faqs.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {post.faqs.map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-semibold text-slate-900 dark:text-white text-base">Q: {faq.question}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <AdSlot placement="footer" />

      {/* More Articles */}
      <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">More Recommended Guides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPosts.map(rp => (
            <a
              key={rp.slug}
              href={`/blog/${rp.slug}`}
              className="group bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 hover:border-indigo-500 transition-colors"
            >
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-500 line-clamp-2">
                {rp.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{rp.description}</p>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
