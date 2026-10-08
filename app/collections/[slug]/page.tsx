import React from 'react';
import { getCollectionBySlug } from '@/lib/products/collectionsRegistry';
import { getProductBySlug } from '@/lib/products/registry';
import { getToolBySlug } from '@/lib/tools/registry';
import { ExternalLink, Sparkles, CheckCircle, Bookmark } from 'lucide-react';

interface CollectionDetailPageProps {
  params: { slug: string };
}

export default function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const collection = getCollectionBySlug(params.slug);

  if (!collection) {
    return (
      <div className="p-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Collection Not Found</h1>
        <p className="text-slate-500 text-sm">The requested collection does not exist.</p>
        <a href="/collections" className="inline-block text-indigo-600 font-bold hover:underline">
          &larr; Back to Collections Hub
        </a>
      </div>
    );
  }

  return (
    <article className="space-y-8 max-w-5xl mx-auto">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 space-x-2">
        <a href="/" className="hover:underline">Home</a> &gt;
        <a href="/collections" className="hover:underline">Collections</a> &gt;
        <span className="text-slate-800 dark:text-slate-200 font-semibold">{collection.title}</span>
      </nav>

      <header className="p-8 sm:p-12 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Bookmark className="w-4 h-4" /> Curated Collection &bull; {collection.items.length} Items
        </div>
        <h1 className="text-3xl sm:text-5xl font-black">{collection.title}</h1>
        <p className="text-slate-300 text-base max-w-3xl leading-relaxed">{collection.description}</p>
        <p className="text-xs text-slate-400">Curated by {collection.authorName} &bull; Updated {collection.lastUpdated}</p>
      </header>

      {/* Collection Items Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Included Products &amp; Tools</h2>

        <div className="space-y-4">
          {collection.items.map((item, idx) => {
            if (item.type === 'product') {
              const prod = getProductBySlug(item.slug);
              if (!prod) return null;
              return (
                <div key={idx} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={prod.logoUrl} alt={prod.name} className="w-10 h-10 rounded-xl object-cover border" />
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                          <a href={`/products/${prod.slug}`} className="hover:text-indigo-600">{prod.name}</a>
                        </h3>
                        <span className="text-xs text-slate-500">{prod.categoryName} &bull; {prod.pricingModel}</span>
                      </div>
                    </div>

                    <a href={prod.websiteUrl} target="_blank" rel="noopener noreferrer nofollow ugc" className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1">
                      Official Site <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {item.note && (
                    <p className="text-xs text-indigo-900 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800/40">
                      <strong>Curator Note:</strong> {item.note}
                    </p>
                  )}
                </div>
              );
            } else {
              const tool = getToolBySlug(item.slug);
              if (!tool) return null;
              return (
                <div key={idx} className="p-6 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-slate-900 dark:to-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="px-2 py-0.5 bg-indigo-600 text-white font-bold text-[10px] rounded uppercase">Free Online Tool</span>
                      <h3 className="font-extrabold text-base text-indigo-950 dark:text-indigo-200 mt-1">
                        <a href={`/tools/${tool.slug}`} className="hover:underline">{tool.canonicalName}</a>
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{tool.shortDescription}</p>
                    </div>

                    <a href={`/tools/${tool.slug}`} className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow hover:bg-indigo-700 shrink-0">
                      Open Tool &rarr;
                    </a>
                  </div>

                  {item.note && (
                    <p className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border">
                      <strong>Curator Note:</strong> {item.note}
                    </p>
                  )}
                </div>
              );
            }
          })}
        </div>
      </section>
    </article>
  );
}
