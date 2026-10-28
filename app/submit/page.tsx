import React, { useState, useEffect } from 'react';
import { getAllCategories } from '@/lib/products/registry';
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
  FolderPlus
} from 'lucide-react';

export default function ProductSubmissionPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);

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

  // Load dynamic categories on mount & listen to changes
  useEffect(() => {
    const refreshCategories = () => {
      const cats = getAllCategories();
      setCategories(cats);
    };

    refreshCategories();
    window.addEventListener('toolverse_products_changed', refreshCategories);
    return () => window.removeEventListener('toolverse_products_changed', refreshCategories);
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

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-2">
      {/* Header Banner */}
      <header className="p-8 sm:p-10 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl space-y-4 shadow-xl text-center border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Instant Community Launch
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">List Your Product on Toolverse</h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Create a verified public profile and compete on the Community Leaderboard. Indexed with Schema.org SEO, user upvotes, and instant discovery.
          </p>
        </div>
      </header>

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
            <a
              href={`/products/${createdProduct.slug}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              <span>🚀 View Live Product Profile</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="/leaderboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all"
            >
              <Trophy className="w-4 h-4" />
              <span>View on Leaderboard</span>
            </a>

            <a
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-xl transition-all"
            >
              <span>All Products</span>
            </a>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            ✅ Automatically indexed with Schema.org SoftwareApplication, OpenGraph metadata, and direct social preview tags.
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6 text-xs">
          <div className="space-y-1 pb-2 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Product &amp; Company Details</h2>
            <p className="text-slate-500">Provide accurate details for search engines, community voters, and potential customers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Product Name *</label>
              <input
                type="text"
                placeholder="e.g. Supabase, Flowise AI, Typora"
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
                placeholder="https://yourproduct.com"
                required
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tagline (One-Line Summary) *</label>
            <input
              type="text"
              placeholder="e.g. Next-generation AI image editor and background remover"
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Description *</label>
            <textarea
              rows={4}
              placeholder="Explain key features, what makes your software unique, and what problem it solves..."
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
            ></textarea>
          </div>

          {/* Dynamic Category System */}
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" /> Category *
              </label>
              {!isCustomCategory && (
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(true)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> + Type New Category
                </button>
              )}
            </div>

            {!isCustomCategory ? (
              <select
                value={formData.categorySlug}
                onChange={handleCategoryChange}
                className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} {c.isCustom ? '⭐ (Community)' : ''}
                  </option>
                ))}
                <option value="__custom__">+ Enter Custom Category...</option>
              </select>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Voice AI, Crypto & Web3, Education Tech, 3D Modeling..."
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    className="flex-1 p-2.5 bg-white dark:bg-slate-800 border border-indigo-400 rounded-xl font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCategory(false);
                      setCustomCategoryName('');
                    }}
                    className="px-3 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-300 text-xs"
                  >
                    Select Existing
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
  );
}
