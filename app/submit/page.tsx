import React, { useState } from 'react';
import { PRODUCT_CATEGORIES } from '@/lib/products/registry';
import { PricingModel, TargetPlatform } from '@/lib/products/types';
import { saveSubmission } from '@/lib/products/storageEngine';
import { Sparkles, ShieldCheck, CheckCircle2, Send } from 'lucide-react';

export default function ProductSubmissionPage() {
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.websiteUrl || !formData.description) return;

    saveSubmission(formData);
    setSubmitted(true);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <header className="p-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl space-y-4 shadow-xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-bold uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Product Launch Platform
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">List Your Product on Toolverse</h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
          Create a verified public profile for your SaaS, AI tool, developer application, or website. Gain genuine product discovery and user feedback.
        </p>
      </header>

      {submitted ? (
        <div className="p-10 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-3xl text-center space-y-4 shadow-lg">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-200">Submission Received!</h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Thank you! Your product submission has entered the Toolverse Quality Gate moderation queue. Our team reviews all submissions to prevent spam and verify accurate metadata.
          </p>
          <div className="pt-2">
            <a href="/products" className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow">
              Explore Live Products &rarr;
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6 text-xs">
          <div className="space-y-1 pb-2 border-b">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Product Information</h2>
            <p className="text-slate-500">Provide accurate product details for search engines and potential users.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Product Name *</label>
              <input
                type="text"
                placeholder="e.g. Supabase"
                required
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
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
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tagline (One Line Summary) *</label>
            <input
              type="text"
              placeholder="e.g. The open source Firebase alternative with Postgres database"
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Description *</label>
            <textarea
              rows={4}
              placeholder="Explain key features, target audience, and primary problem your product solves..."
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
              <select
                value={formData.categorySlug}
                onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pricing Model *</label>
              <select
                value={formData.pricingModel}
                onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as PricingModel })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
              >
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Paid">Paid</option>
                <option value="Free Trial">Free Trial</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company / Team Name</label>
              <input
                type="text"
                placeholder="e.g. Supabase Inc"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Founder / Maker Name</label>
              <input
                type="text"
                placeholder="e.g. Paul Copplestone"
                value={formData.founderName}
                onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
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
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-between">
            <span className="text-slate-500 font-medium">Zero automated spam. Quality controlled.</span>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              <Send className="w-4 h-4" /> Submit Product Profile
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
