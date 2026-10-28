import React, { useState, useEffect } from 'react';
import { getAllProducts, getAllCategories, getLeaderboardProducts } from '@/lib/products/registry';
import { Product, ProductCategory } from '@/lib/products/types';
import { isUpvoted, toggleUpvote, saveCustomCategory } from '@/lib/products/storageEngine';
import {
  Trophy,
  Medal,
  Sparkles,
  ThumbsUp,
  Search,
  ExternalLink,
  ShieldCheck,
  ArrowUpRight,
  PlusCircle,
  Tag,
  Flame,
  Calendar,
  Layers,
  X,
  Share2,
  Check
} from 'lucide-react';

export default function LeaderboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | 'today' | 'week' | 'new'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Category addition
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

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

  // Compute leaderboard ranked products
  const rankedProducts = React.useMemo(() => {
    let list = getLeaderboardProducts(selectedTimeframe, selectedCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return list;
  }, [products, selectedTimeframe, selectedCategory, searchQuery]);

  const top3 = rankedProducts.slice(0, 3);
  const remaining = rankedProducts.slice(3);

  const totalUpvotes = products.reduce((acc, p) => acc + (p.upvotesCount || 0), 0);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/products/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  };

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto">
      {/* Hero Header */}
      <header className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-amber-500/20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Toolverse Community Rankings
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Software &amp; AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-pink-400">Leaderboard</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore the highest-voted software applications, indie SaaS tools, and AI creations. Vote for tools you love or launch your own product to take the #1 spot.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href="/submit"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                <span>🚀 Submit Your Product Free</span>
              </a>
              <a
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur transition-all"
              >
                Browse All Software
              </a>
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 shadow-xl text-center">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">{products.length}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Products</div>
            </div>
            <div className="p-3 border-x border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-indigo-400">{totalUpvotes}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Upvotes</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{categories.length}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Categories</div>
            </div>
          </div>
        </div>
      </header>

      {/* Top 3 Podium Cards */}
      {top3.length > 0 && selectedTimeframe !== 'new' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Podium Spotlights
            </h2>
            <span className="text-xs text-slate-500 font-medium">Top 3 highest voted entries</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            {/* 2nd Place */}
            {top3[1] && (
              <PodiumCard
                product={top3[1]}
                rank={2}
                badgeClass="bg-slate-300 text-slate-900 border-slate-400"
                medal="🥈"
                medalTitle="Rank #2"
                onVoteChange={loadData}
              />
            )}

            {/* 1st Place (Featured taller & centered) */}
            {top3[0] && (
              <PodiumCard
                product={top3[0]}
                rank={1}
                badgeClass="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-amber-500/20"
                medal="🥇"
                medalTitle="Rank #1 Champion"
                isLeader
                onVoteChange={loadData}
              />
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <PodiumCard
                product={top3[2]}
                rank={3}
                badgeClass="bg-amber-700 text-amber-100 border-amber-600"
                medal="🥉"
                medalTitle="Rank #3"
                onVoteChange={loadData}
              />
            )}
          </div>
        </section>
      )}

      {/* Search & Dynamic Category Filter Bar */}
      <section className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search leaderboard by tool name, keywords, or founder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Timeframe Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setSelectedTimeframe('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTimeframe === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All-Time Top
            </button>
            <button
              onClick={() => setSelectedTimeframe('week')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                selectedTimeframe === 'week'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Trending
            </button>
            <button
              onClick={() => setSelectedTimeframe('today')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                selectedTimeframe === 'today'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Today
            </button>
            <button
              onClick={() => setSelectedTimeframe('new')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTimeframe === 'new'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              New Launches
            </button>
          </div>
        </div>

        {/* Dynamic Category Pill Filters */}
        <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" /> Filter by Dynamic Category ({categories.length}):
            </span>
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold"
            >
              <PlusCircle className="w-3.5 h-3.5" /> + Add Custom Category
            </button>
          </div>

          {/* Expand Category Input */}
          {showAddCategory && (
            <form
              onSubmit={handleCreateCategory}
              className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl flex flex-col sm:flex-row items-center gap-2"
            >
              <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 whitespace-nowrap">
                New Category Name:
              </span>
              <input
                type="text"
                placeholder="e.g. Generative Video, Open Source Databases, Web3..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-lg outline-none text-slate-900 dark:text-white"
                autoFocus
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-500 shadow"
                >
                  Save &amp; Expand
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

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  selectedCategory === c.slug
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <span>{c.name}</span>
                {c.isCustom && <span className="text-[10px] opacity-80">⭐</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Leaderboard List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Leaderboard Standings ({rankedProducts.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">Ranked by verified votes and community signals</span>
        </div>

        <div className="space-y-3">
          {rankedProducts.map((product, idx) => (
            <LeaderboardRow
              key={product.id}
              product={product}
              rank={idx + 1}
              onVoteChange={loadData}
              onCopyLink={() => handleCopyLink(product.slug)}
              isCopied={copiedSlug === product.slug}
            />
          ))}
        </div>

        {rankedProducts.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No products found in this category yet.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the very first maker or founder to submit a product here and claim the #1 spot on the leaderboard!
            </p>
            <div className="pt-2">
              <a
                href="/submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow"
              >
                <span>🚀 Launch Product Now</span>
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// Podium Spotlight Component for Top 3
function PodiumCard({
  product,
  rank,
  badgeClass,
  medal,
  medalTitle,
  isLeader,
  onVoteChange,
}: {
  product: Product;
  rank: number;
  badgeClass: string;
  medal: string;
  medalTitle: string;
  isLeader?: boolean;
  onVoteChange?: () => void;
}) {
  const [upvotes, setUpvotes] = useState(product.upvotesCount);
  const [hasVoted, setHasVoted] = useState(isUpvoted(product.id));

  useEffect(() => {
    setUpvotes(product.upvotesCount);
    setHasVoted(isUpvoted(product.id));
  }, [product.upvotesCount, product.id]);

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault();
    const voted = toggleUpvote(product.id);
    setHasVoted(voted);
    setUpvotes((prev) => (voted ? prev + 1 : prev - 1));
    if (onVoteChange) setTimeout(onVoteChange, 50);
  };

  return (
    <div
      className={`relative bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-xl transition-all duration-300 flex flex-col justify-between ${
        isLeader
          ? 'border-amber-400 dark:border-amber-500/80 shadow-amber-500/10 md:-translate-y-3 z-10 ring-2 ring-amber-400/30'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="space-y-4">
        {/* Top Badge */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${badgeClass}`}>
            <span>{medal}</span>
            <span>{medalTitle}</span>
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{product.categoryName}</span>
        </div>

        {/* Product Identity */}
        <div className="flex items-center gap-3">
          <img
            src={product.logoUrl}
            alt={product.name}
            className="w-14 h-14 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 shadow-md"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                <a href={`/products/${product.slug}`} className="hover:text-indigo-600 transition-colors">
                  {product.name}
                </a>
              </h3>
              {product.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
            </div>
            <span className="text-xs font-medium text-slate-500">{product.pricingModel}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>
      </div>

      {/* Podium Card Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <a
          href={`/products/${product.slug}`}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          View Profile <ArrowUpRight className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={handleVote}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            hasVoted
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{upvotes}</span>
        </button>
      </div>
    </div>
  );
}

// Leaderboard Table / Row Component
function LeaderboardRow({
  product,
  rank,
  onVoteChange,
  onCopyLink,
  isCopied,
}: {
  product: Product;
  rank: number;
  onVoteChange?: () => void;
  onCopyLink: () => void;
  isCopied: boolean;
}) {
  const [upvotes, setUpvotes] = useState(product.upvotesCount);
  const [hasVoted, setHasVoted] = useState(isUpvoted(product.id));

  useEffect(() => {
    setUpvotes(product.upvotesCount);
    setHasVoted(isUpvoted(product.id));
  }, [product.upvotesCount, product.id]);

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault();
    const voted = toggleUpvote(product.id);
    setHasVoted(voted);
    setUpvotes((prev) => (voted ? prev + 1 : prev - 1));
    if (onVoteChange) setTimeout(onVoteChange, 50);
  };

  const getRankBadge = (r: number) => {
    if (r === 1) return <span className="text-xl" title="1st Place">🥇</span>;
    if (r === 2) return <span className="text-xl" title="2nd Place">🥈</span>;
    if (r === 3) return <span className="text-xl" title="3rd Place">🥉</span>;
    return <span className="font-black text-slate-500 text-sm">#{r}</span>;
  };

  return (
    <article className="group p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Left: Rank + Logo + Content */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div className="w-8 flex items-center justify-center shrink-0">
          {getRankBadge(rank)}
        </div>

        <img
          src={product.logoUrl}
          alt={product.name}
          className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0 shadow-sm"
          loading="lazy"
        />

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
              <a href={`/products/${product.slug}`}>{product.name}</a>
            </h3>
            {product.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />}

            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold rounded-md text-[11px]">
              {product.categoryName}
            </span>

            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold rounded-md text-[11px]">
              {product.pricingModel}
            </span>

            {product.isNew && (
              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold rounded-md text-[10px] uppercase">
                New
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 leading-relaxed">
            {product.tagline}
          </p>
        </div>
      </div>

      {/* Right: Actions & Upvote Button */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        <button
          onClick={onCopyLink}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Copy link to product profile"
        >
          {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
        </button>

        <a
          href={product.websiteUrl}
          target="_blank"
          rel="noopener noreferrer nofollow ugc"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold hidden md:flex items-center gap-1"
        >
          Visit <ExternalLink className="w-3 h-3" />
        </a>

        <a
          href={`/products/${product.slug}`}
          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all"
        >
          Profile
        </a>

        {/* Upvote Button */}
        <button
          onClick={handleVote}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            hasVoted
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-white' : ''}`} />
          <span>{upvotes}</span>
        </button>
      </div>
    </article>
  );
}
