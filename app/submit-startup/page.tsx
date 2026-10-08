import React, { useState } from 'react';
import { submitStartup } from '@/lib/startups/registry';
import { PricingModel, FundingStage, ProductPlatform } from '@/lib/startups/types';

export default function SubmitStartupPage() {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [category, setCategory] = useState<string>('SaaS & B2B Software');
  const [country, setCountry] = useState<string>('United States');
  const [city, setCity] = useState<string>('San Francisco');
  const [pricingModel, setPricingModel] = useState<PricingModel>('FREEMIUM');
  const [fundingStage, setFundingStage] = useState<FundingStage>('BOOTSTRAPPED');
  const [teamSize, setTeamSize] = useState<string>('1-5');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [longDescription, setLongDescription] = useState<string>('');
  const [problemSolved, setProblemSolved] = useState<string>('');
  const [keyFeaturesStr, setKeyFeaturesStr] = useState<string>('Automated workflows, Analytics reporting');
  const [founderName, setFounderName] = useState<string>('');
  const [founderEmail, setFounderEmail] = useState<string>('');
  const [submittedSlug, setSubmittedSlug] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStartup = submitStartup({
      name,
      tagline,
      websiteUrl,
      category,
      country,
      city,
      pricingModel,
      fundingStage,
      teamSize,
      shortDescription,
      longDescription,
      problemSolved,
      targetAudience: ['Founders', 'Developers'],
      keyFeatures: keyFeaturesStr.split(',').map(s => s.trim()),
      platforms: ['WEB'],
      founderName,
      founderEmail
    });

    setSubmittedSlug(newStartup.slug);
    setStep(4);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/40 shadow-2xl space-y-4">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
          Startup & Product Launch Studio
        </span>
        <h1 className="text-3xl font-extrabold text-white">Launch Your Startup on Toolverse</h1>
        <p className="text-slate-300 text-sm">
          Get discovered by users, SaaS founders, investors, and writers. Create a public SEO-optimized startup profile.
        </p>
      </div>

      {/* Multi-step Form */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        {step < 4 && (
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-xs font-bold text-slate-400">
            <span className={step >= 1 ? 'text-indigo-400' : ''}>1. Basic Info</span>
            <span>➔</span>
            <span className={step >= 2 ? 'text-indigo-400' : ''}>2. Product Details</span>
            <span>➔</span>
            <span className={step >= 3 ? 'text-indigo-400' : ''}>3. Founder Info</span>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Step 1: Basic Information</h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Startup / Product Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Nexus AI"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">One-Line Tagline</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Autonomous AI Content & SEO Suite for Startups"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Website URL</label>
                <input 
                  type="url"
                  required
                  placeholder="https://yourstartup.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 px-3 py-2.5 rounded-xl border border-slate-700 text-xs"
                  >
                    <option value="SaaS & B2B Software">SaaS & B2B Software</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Developer Tools">Developer Tools</option>
                    <option value="Productivity & Work">Productivity & Work</option>
                    <option value="Marketing & SEO">Marketing & SEO</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Pricing Model</label>
                  <select
                    value={pricingModel}
                    onChange={(e) => setPricingModel(e.target.value as PricingModel)}
                    className="w-full bg-slate-950 text-slate-200 px-3 py-2.5 rounded-xl border border-slate-700 text-xs"
                  >
                    <option value="FREE">FREE</option>
                    <option value="FREEMIUM">FREEMIUM</option>
                    <option value="PAID">PAID</option>
                    <option value="FREE_TRIAL">FREE TRIAL</option>
                    <option value="OPEN_SOURCE">OPEN SOURCE</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!name || !tagline || !websiteUrl}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition"
            >
              Continue to Product Details ➔
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Step 2: Product Description & Features</h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="2-3 sentence overview of what your product does."
                  className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Long Description & Background</label>
                <textarea
                  rows={4}
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Detailed breakdown of your startup product, story, and capabilities."
                  className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Problem Solved</label>
                <input 
                  type="text"
                  placeholder="What main bottleneck or pain point does this solve?"
                  value={problemSolved}
                  onChange={(e) => setProblemSolved(e.target.value)}
                  className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition"
              >
                Continue to Founder Info ➔
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-bold text-white">Step 3: Founder & Contact Info</h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Founder Name</label>
                <input 
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Founder Email</label>
                <input 
                  type="email"
                  required
                  placeholder="founder@yourstartup.com"
                  value={founderEmail}
                  onChange={(e) => setFounderEmail(e.target.value)}
                  className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition"
              >
                🚀 Submit & Publish Startup
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="text-center py-8 space-y-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-2xl font-extrabold text-white">Startup Published Successfully!</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your startup profile is live on Toolverse. baby and ready for community upvotes.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <a
                href={`/startups/${submittedSlug}`}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                View Live Profile ↗
              </a>
              <a
                href="/dashboard"
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Go to Founder Dashboard
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
