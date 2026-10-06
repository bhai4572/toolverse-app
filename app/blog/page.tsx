import React, { useState } from 'react';
import { BLOG_POSTS } from '@/lib/blog/posts';
import { AdSlot } from '@/components/AdSlot';

export default function BlogHubPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Career & Jobs', 'Image & PDF Tools', 'Developers & SEO', 'Finance & Calculators'];

  const filteredPosts = selectedCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(post => post.category === selectedCategory);

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider">
          ToolVerse Knowledge & Career Hub
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          SEO Guides, Career Advice & Tech Tutorials
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          In-depth guides on remote job hunting, browser privacy, barcode standards, image compression, and taxation. Written by experts to help you get work done faster.
        </p>
      </div>

      <AdSlot placement="header" />

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 justify-center pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
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

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map(post => (
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
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold rounded-md">
                  {post.category}
                </span>
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
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  By {post.author}
                </span>
                <a
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform"
                >
                  Read Article →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <AdSlot placement="footer" />
    </div>
  );
}
