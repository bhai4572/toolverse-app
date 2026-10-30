'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getAllCategories, getAllProducts } from '@/lib/products/registry';
import { PricingModel, TargetPlatform, Product, ProductCategory } from '@/lib/products/types';
import { saveCustomProduct, saveCustomCategory } from '@/lib/products/storageEngine';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Send,
  PlusCircle,
  ExternalLink,
  Trophy,
  ArrowRight,
  Globe,
  Tag,
  FolderPlus,
  Search,
  Building2,
  TrendingUp,
  Star,
  Users,
  Award,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function ProductSubmissionPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);

  // Filter state for showcase
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    productName: '',
    websiteUrl: '',
    tagline: '',
    description: '',
    logoUrl: '',
    categorySlug: 'ai-tools',
    pricingModel: 'Freemium' as PricingModel,
    platforms: ['Web'] as TargetPlatform[],
    country: 'United States',
    companyName: '',
    founderName: '',
    contactEmail: '',
  });

  // Custom Category State
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  // Load dynamic categories & products on mount & listen to changes
  useEffect(() => {
    const refreshData = () => {
      const cats = getAllCategories();
      const prods = getAllProducts();
      setCategories(cats);
      setAllProducts(prods);
    };

    refreshData();
    window.addEventListener('toolverse_products_changed', refreshData);
    return () => window.removeEventListener('toolverse_products_changed', refreshData);
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomCategory(true);
    } else {
      setIsCustomCategory(false);
      setFormData({ ...formData, categorySlug: val });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName.trim() || !formData.websiteUrl.trim() || !formData.description.trim()) {
      return;
    }

    let finalCategorySlug = formData.categorySlug;
    let finalCategoryName = '';

    if (isCustomCategory && customCategoryName.trim()) {
      const newCat = saveCustomCategory(customCategoryName.trim());
      finalCategorySlug = newCat.slug;
      finalCategoryName = newCat.name;
    } else {
      const matched = categories.find((c) => c.slug === formData.categorySlug);
      finalCategoryName = matched ? matched.name : formData.categorySlug;
    }

    const newProd = saveCustomProduct({
      productName: formData.productName.trim(),
      websiteUrl: formData.websiteUrl.trim(),
      tagline: formData.tagline.trim(),
      description: formData.description.trim(),
      logoUrl: formData.logoUrl.trim(),
      categorySlug: finalCategorySlug,
      categoryName: finalCategoryName,
      pricingModel: formData.pricingModel,
      platforms: formData.platforms,
      country: formData.country.trim() || 'Global',
      companyName: formData.companyName.trim(),
      founderName: formData.founderName.trim(),
      contactEmail: formData.contactEmail.trim(),
    });

    setCreatedProduct(newProd);
    setSubmitted(true);
  };

  // Filter showcase products
  const filteredShowcase = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.categorySlug === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.companyName?.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [allProducts, selectedCategory, searchQuery]);

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-4 px-4 sm:px-6">
      {/* Header Banner */}
      <header className="p-8 sm:p-12 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl space-y-4 shadow-2xl text-center border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> High-Authority Product Directory
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            List Your Product Alongside 100+ World-Famous Tech Giants
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Get your tool discovered by thousands of tech founders, developers, and professionals daily. Indexed with Google Schema.org SEO, community upvotes, and permanent do-follow backlinks.
          </p>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-indigo-500/20 text-left">
            <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-indigo-400">100+</div>
              <div className="text-xs text-slate-400 font-medium">World-Famous Products</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">Instant Live Indexing</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-amber-400">8</div>
              <div className="text-xs text-slate-400 font-medium">Major Tech Categories</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-pink-400">1.2M+</div>
              <div className="text-xs text-slate-400 font-medium">Monthly Discovery Reach</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Submission Form */}
      <div className="max-w-3xl mx-auto w-full">
        {submitted && createdProduct ? (
          <div className="p-8 sm:p-10 bg-white dark:bg-slate-900 border border-emerald-500/40 rounded-3xl text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                🎉 Product Published &amp; Live!
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                <strong>{createdProduct.name}</strong> is now live on Toolverse! Your product is immediately visible on the live product directory, Leaderboard, and has its own dedicated SEO profile page.
              </p>
            </div>

            {/* Product Preview Card */}
            <div className="max-w-md mx-auto p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-left flex items-start gap-4 shadow-sm">
              <img
                src={createdProduct.logoUrl}
                alt={createdProduct.name}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                    {createdProduct.name}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{createdProduct.tagline}</p>
                <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold">
                  <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded">
                    {createdProduct.categoryName}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded">
                    {createdProduct.pricingModel}
                  </span>
                  <span className="text-amber-500 font-bold">▲ {createdProduct.upvotesCount} vote</span>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/products/${createdProduct.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                <span>🚀 View Live Product Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/leaderboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all"
              >
                <Trophy className="w-4 h-4" />
                <span>View on Leaderboard</span>
              </Link>

              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-xl transition-all"
              >
                <span>All Products</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              ✅ Automatically indexed with Schema.org SoftwareApplication, OpenGraph metadata, and direct social preview tags.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6 text-xs">
            <div className="space-y-1 pb-2 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Submit Your Product / SaaS</h2>
              <p className="text-slate-500">Provide accurate details to rank alongside industry leaders on search engines and ToolVerse leaderboards.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Supabase, ChatGPT, Figma"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Official Website URL *</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  required
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tagline (Catchy 1-sentence value prop) *</label>
              <input
                type="text"
                placeholder="e.g. Open source Firebase alternative with Postgres and instant APIs"
                required
                maxLength={140}
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Detailed Description *</label>
              <textarea
                rows={3}
                placeholder="Describe what your tool does, key differentiators, problem it solves, and ideal users..."
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            {/* Category Dropdown with Custom Add Option */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
              <select
                value={isCustomCategory ? '__custom__' : formData.categorySlug}
                onChange={handleCategoryChange}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
                <option value="__custom__">➕ + Add New Custom Category...</option>
              </select>

              {isCustomCategory && (
                <div className="mt-3 p-3 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                    <FolderPlus className="w-4 h-4" />
                    <span>Create a New Category</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Blockchain & Web3, BioTech Tools, CyberSecurity"
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      className="flex-1 p-2 bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-lg text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!customCategoryName.trim()) return;
                        const newCat = saveCustomCategory(customCategoryName.trim());
                        setCategories(getAllCategories());
                        setIsCustomCategory(false);
                        setFormData({ ...formData, categorySlug: newCat.slug });
                      }}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shrink-0 transition-colors"
                    >
                      Save Category
                    </button>
                  </div>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400">
                    ✨ This new category will be permanently added to the Toolverse category registry and filters!
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pricing Model *</label>
                <select
                  value={formData.pricingModel}
                  onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as PricingModel })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Free">Free (100% Free)</option>
                  <option value="Freemium">Freemium (Free tier + paid upgrades)</option>
                  <option value="Paid">Paid (Subscription or one-time fee)</option>
                  <option value="Free Trial">Free Trial</option>
                  <option value="Open Source">Open Source</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Logo URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company / Team Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Founder / Maker Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={formData.founderName}
                  onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Email *</label>
                <input
                  type="email"
                  placeholder="founder@example.com"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-slate-500 font-medium text-xs">
                ⚡ Your product will be immediately live, ranked on the Leaderboard, and indexable by search engines.
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                <Send className="w-4 h-4" /> Publish Product Instantly
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 100 World-Famous Tech Companies Showcase Directory Section */}
      {/* ========================================================================= */}
      <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wide">
              <Award className="w-3.5 h-3.5" /> Elite Tech Ecosystem
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              100 World-Famous Companies Listed on ToolVerse
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl leading-relaxed">
              Explore profiles of global software leaders spanning Artificial Intelligence, Cloud Infrastructure, Product Design, and E-Commerce. When you submit your tool, your profile gains direct topical relevance next to these industry benchmarks.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search 100 top tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-400'
            }`}
          >
            All Top 100 ({allProducts.length})
          </button>
          {categories.map((c) => {
            const count = allProducts.filter((p) => p.categorySlug === c.slug).length;
            return (
              <button
                key={c.slug}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                  selectedCategory === c.slug
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                }`}
              >
                {c.name} {count > 0 ? `(${count})` : ''}
              </button>
            );
          })}
        </div>

        {/* Directory Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredShowcase.map((p) => (
            <div
              key={p.id}
              className="p-5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 rounded-2xl transition-all duration-200 hover:shadow-lg flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                {/* Logo + Header */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                    {p.logoUrl ? (
                      <img src={p.logoUrl} alt={p.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <Building2 className="w-6 h-6 text-indigo-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Link
                        href={`/products/${p.slug}`}
                        className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {p.name}
                      </Link>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Verified Listing" />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span>{p.companyName || 'Independent'}</span>
                      {p.country && <span>• {p.country}</span>}
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {p.tagline}
                </p>

                {/* Badges */}
                <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                  <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-semibold rounded-md border border-indigo-200/50 dark:border-indigo-800/40">
                    {p.categoryName}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 font-semibold rounded-md border border-emerald-200/50 dark:border-emerald-800/40">
                    {p.pricingModel}
                  </span>
                  {p.ratingAverage && (
                    <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 font-semibold rounded-md flex items-center gap-1 border border-amber-200/50 dark:border-amber-800/40">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      {p.ratingAverage}
                    </span>
                  )}
                </div>

                {/* Key feature bullets */}
                {p.features && p.features.length > 0 && (
                  <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    {p.features.slice(0, 2).map((f, idx) => (
                      <li key={idx} className="line-clamp-1 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-indigo-500 shrink-0"></span>
                        <strong className="text-slate-700 dark:text-slate-300 font-medium">{f.title}:</strong>
                        <span>{f.description}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                <Link
                  href={`/products/${p.slug}`}
                  className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>Full Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {p.websiteUrl && (
                  <a
                    href={p.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    <span>Website</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredShowcase.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Search className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-900 dark:text-white">No products found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search terms or category filter.</p>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SEO Traffic & Authority Guide for Product Owners */}
      {/* ========================================================================= */}
      <section className="p-8 sm:p-10 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl border border-indigo-500/20 space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Why Submitting to ToolVerse Continuously Increases Your Organic Google Traffic
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
            ToolVerse has engineered a comprehensive directory architecture built specifically to capture high-intent search traffic and pass topical authority to listed software.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
            <div className="font-bold text-indigo-300 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Schema.org Structured Data
            </div>
            <p className="text-slate-300 leading-relaxed">
              Every product receives automated JSON-LD SoftwareApplication schemas with review stars, pricing models, feature lists, and operating system tags that Google indexes for rich search snippets.
            </p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
            <div className="font-bold text-emerald-300 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> High-Intent Search Volume
            </div>
            <p className="text-slate-300 leading-relaxed">
              By listing your software next to search giants like Stripe, Notion, Figma, and ChatGPT, search engine algorithms correlate your domain with industry-leading entities, boosting discovery impressions.
            </p>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
            <div className="font-bold text-amber-300 text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" /> Community Leaderboard & Upvotes
            </div>
            <p className="text-slate-300 leading-relaxed">
              Engage your users to upvote your listing on the ToolVerse Leaderboard. Top trending products earn premium placement on the home page, category hubs, and weekly newsletter roundups.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
