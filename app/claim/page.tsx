import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Send, Building } from 'lucide-react';

export default function ProductClaimPage() {
  const [claimed, setClaimed] = useState(false);
  const [productName, setProductName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [role, setRole] = useState('Founder / CEO');
  const [proofUrl, setProofUrl] = useState('');

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimed(true);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <header className="p-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl space-y-4 shadow-xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-bold uppercase">
          <ShieldCheck className="w-3.5 h-3.5" /> Founder &amp; Business Verification
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">Claim Your Product Profile</h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          Verify company ownership to update product specs, respond to user reviews, answer community questions, and add verified badges.
        </p>
      </header>

      {claimed ? (
        <div className="p-8 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-3xl text-center space-y-3 shadow-md">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-200">Verification Request Submitted!</h2>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Our team will verify your corporate domain email (<strong>{workEmail}</strong>) within 24 hours. Once verified, your product profile will show the official Verified Company Badge.
          </p>
        </div>
      ) : (
        <form onSubmit={handleClaim} className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Product Name to Claim *</label>
            <input
              type="text"
              placeholder="e.g. Canva, Supabase, Notion"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Official Corporate Work Email *</label>
            <input
              type="email"
              placeholder="name@companydomain.com"
              required
              value={workEmail}
              onChange={(e) => setWorkEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
            <p className="text-[11px] text-slate-400 mt-1">Must match official company domain (no generic gmail/yahoo accounts).</p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
            >
              <option value="Founder / CEO">Founder / CEO</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Marketing Lead">Marketing Lead</option>
              <option value="Lead Developer">Lead Developer</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Verification Proof URL (LinkedIn or Official Site)</label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              Submit Founder Claim Request &rarr;
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
