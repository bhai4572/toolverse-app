import React, { useState, useEffect } from 'react';
import { getAllProducts, getAllCategories } from '@/lib/products/registry';
import { Product, ProductCategory, PricingModel } from '@/lib/products/types';
import { isUpvoted, toggleUpvote, saveCustomCategory } from '@/lib/products/storageEngine';
import {
  Sparkles,
  ExternalLink,
  ThumbsUp,
  ShieldCheck,
  Search,
  ArrowUpRight,
  Trophy,
  PlusCircle,
  Tag,
  X
} from 'lucide-react';

export default function ProductDiscoveryHubPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'trending' | 'new' | 'featured'>('all');

  // Quick Add Category Modal / Inline Input
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const loadData = () => {
    setProducts(getAllProducts());
    setCategories(getAllCategories());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('toolverse_products_changed', loadData);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('toolverse_products_changed', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const cat = saveCustomCategory(newCatName.trim());
    setCategories(getAllCategories());
    setSelectedCategory(cat.slug);
    setNewCatName('');
    setShowAddCategory(false);
  };

  const filteredProducts = products.filter((p) => {
    if (p.status !== 'approved') return false;
    if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) return false;
    if (selectedPricing !== 'all' && p.pricingModel !== selectedPricing) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (activeTab === 'popular') return p.viewsCount > 20000 || p.upvotesCount > 500;
    if (activeTab === 'trending') return p.isTrending;
    if (activeTab === 'new') return p.isNew;
    if (activeTab === 'featured') return p.isFeatured;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <header className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Product Discovery &amp; Software Directory
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Useful Software, AI Tools &amp; SaaS</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Compare verified applications, explore community product rankings, vote for your favorite tools, and publish your own software free with instant indexing.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="/submit"
              className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              <span>🚀 Submit &amp; List Product Free</span>
            </a>
            <a
              href="/leaderboard"
              className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              <Trophy className="w-4 h-4 text-slate-950" />
              <span>Explore Leaderboard</span>
            </a>
            <a
              href="/alternatives"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur transition-all"
            >
              Software Alternatives
            </a>
          </div>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <section className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products, AI tools, SaaS, developer tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} {c.isCustom ? '⭐' : ''}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="px-3 py-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold hover:bg-indigo-100 flex items-center gap-1.5 transition-all"
              title="Add custom category"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Category</span>
            </button>

            <select
              value={selectedPricing}
              onChange={(e) => setSelectedPricing(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Pricing</option>
              <option value="Free">Free</option>
              <option value="Freemium">Freemium</option>
              <option value="Paid">Paid</option>
              <option value="Free Trial">Free Trial</option>
              <option value="Open Source">Open Source</option>
            </select>
          </div>
        </div>

        {/* Expand Category Modal / Drawer */}
        {showAddCategory && (
          <form
            onSubmit={handleCreateCategory}
            className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl flex flex-col sm:flex-row items-center gap-2"
          >
            <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 whitespace-nowrap flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-indigo-600" /> New Category:
            </span>
            <input
              type="text"
              placeholder="e.g. Video AI, Finance API, Crypto Tools..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-lg outline-none"
              autoFocus
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="submit"
                className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-500 shadow"
              >
                Add Category
              </button>
              <button
                type="button"
                onClick={() => setShowAddCategory(false)}
                className="p-1.5 text-slate-500 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 dark:border-slate-800 pt-3">
          {(['all', 'featured', 'trending', 'popular', 'new'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab === 'all' ? 'All Products' : tab}
            </button>
          ))}
        </div>
      </section>

      {/* Product Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Showing {filteredProducts.length} Verified Products
          </h2>
          <span className="text-xs text-slate-500">Live community submissions and rankings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onVoteChange={loadData} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <p className="text-slate-500 font-semibold text-sm">No products found matching your search filters.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedPricing('all');
                  setActiveTab('all');
                }}
                className="text-indigo-600 font-bold text-xs hover:underline"
              >
                Reset Filters
              </button>
              <span className="text-slate-400">&bull;</span>
              <a href="/submit" className="text-indigo-600 font-bold text-xs hover:underline">
                Be the first to submit a product in this category &rarr;
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function ProductCard({ product, onVoteChange }: { product: Product; onVoteChange?: () => void }) {
  const [upvotes, setUpvotes] = useState(product.upvotesCount);
  const [hasVoted, setHasVoted] = useState(isUpvoted(product.id));

  // Sync state if prop changes
  useEffect(() => {
    setUpvotes(product.upvotesCount);
    setHasVoted(isUpvoted(product.id));
  }, [product.upvotesCount, product.id]);

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const voted = toggleUpvote(product.id);
    setHasVoted(voted);
    setUpvotes((prev) => (voted ? prev + 1 : prev - 1));
    if (onVoteChange) {
      setTimeout(onVoteChange, 50);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={product.logoUrl}
              alt={`${product.name} logo`}
              className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shadow-sm"
              loading="lazy"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  <a href={`/products/${product.slug}`}>{product.name}</a>
                </h3>
                {product.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-500" title="Verified Product" />
                )}
              </div>
              <span className="text-xs font-medium text-slate-500">{product.categoryName}</span>
            </div>
          </div>

          <button
            onClick={handleVote}
            className={`flex flex-col items-center px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              hasVoted
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5 mb-0.5" />
            <span>{upvotes}</span>
          </button>
        </div>

        {/* Tagline & Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>

        {/* Key Features Pill */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold rounded-md text-[11px]">
            {product.pricingModel}
          </span>
          {product.platforms.slice(0, 2).map((plt) => (
            <span
              key={plt}
              className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium rounded-md text-[11px]"
            >
              {plt}
            </span>
          ))}
          {product.isNew && (
            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold rounded-md text-[10px] uppercase">
              New Launch
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <a
          href={`/products/${product.slug}`}
          className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          View Profile &amp; Reviews <ArrowUpRight className="w-3.5 h-3.5" />
        </a>

        <a
          href={product.websiteUrl}
          target="_blank"
          rel="noopener noreferrer nofollow ugc"
          className="text-slate-400 hover:text-slate-600 flex items-center gap-1 font-medium"
        >
          Official Web <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
