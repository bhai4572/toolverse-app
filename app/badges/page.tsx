import React, { useState } from 'react';
import { Sparkles, Copy, Check, Code, ShieldCheck } from 'lucide-react';

export default function BadgesGeneratorPage() {
  const [productSlug, setProductSlug] = useState('canva');
  const [badgeType, setBadgeType] = useState<'featured' | 'listed' | 'top'>('featured');
  const [copied, setCopied] = useState(false);

  const targetUrl = `https://toolverse.baby/products/${productSlug}`;
  
  const embedCode = `<a href="${targetUrl}" target="_blank" rel="noopener" title="Featured on Toolverse Product Discovery">
  <img src="https://toolverse.baby/badges/${badgeType}-badge.svg" alt="Featured on Toolverse" width="180" height="42" />
</a>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="p-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl space-y-4 shadow-xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-bold uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Lightweight Web Widgets
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">Embeddable Toolverse Badges</h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
          Showcase your product profile on your official website or GitHub README with responsive SVG badges.
        </p>
      </header>

      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Product Slug</label>
            <input
              type="text"
              value={productSlug}
              onChange={(e) => setProductSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="e.g. canva, chatgpt, notion"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Badge Style</label>
            <select
              value={badgeType}
              onChange={(e) => setBadgeType(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
            >
              <option value="featured">Featured on Toolverse</option>
              <option value="listed">Listed on Toolverse</option>
              <option value="top">Top Product on Toolverse</option>
            </select>
          </div>
        </div>

        {/* Badge Interactive Preview */}
        <div className="p-6 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border text-center space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Badge Preview</h3>
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-lg border border-indigo-500/40">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Verified Product</div>
              <div className="text-xs font-black text-indigo-200 capitalize">{badgeType} on Toolverse</div>
            </div>
          </div>
        </div>

        {/* Embed Code Output */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-indigo-600" /> HTML Embed Code
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-1 shadow"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>

          <pre className="p-4 bg-slate-950 text-indigo-300 rounded-xl overflow-x-auto font-mono text-[11px] leading-relaxed border border-slate-800">
            {embedCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
