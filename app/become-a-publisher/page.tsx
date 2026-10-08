import React, { useState } from 'react';
import { registerPublisherWebsite } from '@/lib/guestposts/registry';

export default function BecomeAPublisherPage() {
  const [websiteName, setWebsiteName] = useState<string>('');
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [niche, setNiche] = useState<string>('SaaS & Software');
  const [monthlyTrafficRange, setMonthlyTrafficRange] = useState<string>('10,000 - 50,000 monthly visits');
  const [domainRatingDR, setDomainRatingDR] = useState<number>(45);
  const [editorialGuidelines, setEditorialGuidelines] = useState<string>('');
  const [verificationMethod, setVerificationMethod] = useState<'DNS_TXT' | 'META_TAG' | 'HTML_FILE'>('DNS_TXT');
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerPublisherWebsite({
      websiteName,
      websiteUrl,
      niche,
      monthlyTrafficRange,
      domainRatingDR,
      editorialGuidelines,
      verificationMethod
    });

    setIsRegistered(true);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/40 shadow-2xl space-y-4">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
          Publisher & Website Owner Registration
        </span>
        <h1 className="text-3xl font-extrabold text-white">List Your Website as a Verified Publisher</h1>
        <p className="text-slate-300 text-sm">
          Receive high-quality guest post proposals from verified startup founders, SaaS creators, and technical writers. You control editorial guidelines and link policies.
        </p>
      </div>

      {!isRegistered ? (
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Website & Domain Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Website Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TechVision Journal"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Website Domain URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://yourwebsite.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Niche</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 px-3 py-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="SaaS & Software">SaaS & Software</option>
                  <option value="Startup Launch & Growth">Startup Launch & Growth</option>
                  <option value="Marketing & SEO">Marketing & SEO</option>
                  <option value="Developer Tools">Developer Tools</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Domain Rating (DR / DA)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={domainRatingDR}
                  onChange={(e) => setDomainRatingDR(Number(e.target.value))}
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Verification Method</label>
                <select
                  value={verificationMethod}
                  onChange={(e) => setVerificationMethod(e.target.value as any)}
                  className="w-full bg-slate-950 text-slate-200 px-3 py-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="DNS_TXT">DNS TXT Record</option>
                  <option value="META_TAG">HTML Meta Tag</option>
                  <option value="HTML_FILE">HTML File Upload</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Editorial Guidelines & Content Rules</label>
              <textarea
                rows={3}
                required
                placeholder="Explain what topics you accept, minimum word count, and link guidelines."
                value={editorialGuidelines}
                onChange={(e) => setEditorialGuidelines(e.target.value)}
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-700 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition"
          >
            🏢 Register Website & Verify Ownership
          </button>
        </form>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center py-12 space-y-4">
          <div className="text-5xl">🏢</div>
          <h2 className="text-2xl font-extrabold text-white">Publisher Profile Registered!</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your website domain has been registered and verified on Toolverse. You can now manage incoming pitch requests from your Publisher Dashboard.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <a
              href="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Go to Publisher Dashboard ➔
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
