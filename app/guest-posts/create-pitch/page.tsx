import React, { useState } from 'react';
import { submitGuestPostPitch, SAMPLE_PUBLISHERS } from '@/lib/guestposts/registry';

export default function CreatePitchPage() {
  const [selectedPublisherId, setSelectedPublisherId] = useState<string>(SAMPLE_PUBLISHERS[0].id);
  const [applicantName, setApplicantName] = useState<string>('');
  const [applicantEmail, setApplicantEmail] = useState<string>('');
  const [applicantCompany, setApplicantCompany] = useState<string>('');
  const [proposedTitle, setProposedTitle] = useState<string>('');
  const [articleOutline, setArticleOutline] = useState<string>('');
  const [pitchMessage, setPitchMessage] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [desiredAnchorText, setDesiredAnchorText] = useState<string>('');
  const [authorBio, setAuthorBio] = useState<string>('');
  const [originalityDeclaration, setOriginalityDeclaration] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const targetPub = SAMPLE_PUBLISHERS.find(p => p.id === selectedPublisherId) || SAMPLE_PUBLISHERS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitGuestPostPitch({
      publisherId: targetPub.id,
      publisherName: targetPub.websiteName,
      applicantName,
      applicantEmail,
      applicantCompany,
      proposedTitle,
      alternativeTitles: [`Alternative Title for ${proposedTitle}`],
      articleOutline,
      pitchMessage,
      targetUrl,
      desiredAnchorText,
      authorBio,
      sampleWritingUrls: [targetUrl]
    });

    setIsSubmitted(true);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/40 shadow-2xl space-y-4">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
          Editorial Guest Article Pitch Creator
        </span>
        <h1 className="text-3xl font-extrabold text-white">Submit a Guest Post Pitch</h1>
        <p className="text-slate-300 text-sm">
          Pitch high-quality, original technical content directly to verified publishers. Transparency and editorial quality guaranteed.
        </p>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">1. Select Target Publisher</h2>
            
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Publisher Website</label>
              <select
                value={selectedPublisherId}
                onChange={(e) => setSelectedPublisherId(e.target.value)}
                className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm"
              >
                {SAMPLE_PUBLISHERS.map(p => (
                  <option key={p.id} value={p.id}>{p.websiteName} ({p.niche} • DR {p.domainRatingDR})</option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div><span className="text-slate-500">Editorial Guidelines:</span> {targetPub.editorialGuidelines}</div>
              <div><span className="text-slate-500">Min Words:</span> {targetPub.minimumWordCount} words | <span className="text-slate-500">Max Links:</span> {targetPub.maximumExternalLinks}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">2. Pitch & Article Outline</h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Proposed Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to Build an Autonomous AI Content Pipeline"
                  value={proposedTitle}
                  onChange={(e) => setProposedTitle(e.target.value)}
                  className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Article Key Outline / Main Takeaways</label>
                <textarea
                  rows={3}
                  required
                  placeholder="1. Introduction to topic&#10;2. Step-by-step tutorial or data analysis&#10;3. Conclusion and takeaways"
                  value={articleOutline}
                  onChange={(e) => setArticleOutline(e.target.value)}
                  className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Pitch Message for Publisher Editor</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief note explaining why this topic fits their readers."
                  value={pitchMessage}
                  onChange={(e) => setPitchMessage(e.target.value)}
                  className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-700 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">3. Link & Author Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target URL for Link Context</label>
                <input
                  type="url"
                  required
                  placeholder="https://yourstartup.com/blog/case-study"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Desired Anchor Text</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexus AI architecture"
                  value={desiredAnchorText}
                  onChange={(e) => setDesiredAnchorText(e.target.value)}
                  className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Startup</label>
                <input
                  type="text"
                  value={applicantCompany}
                  onChange={(e) => setApplicantCompany(e.target.value)}
                  className="w-full bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-700 text-xs"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2 text-xs text-slate-300">
              <input
                type="checkbox"
                required
                checked={originalityDeclaration}
                onChange={(e) => setOriginalityDeclaration(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-indigo-600 bg-slate-950"
              />
              <span>I declare that all content submitted will be 100% original, non-spammy, and strictly adhere to editorial guidelines.</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!originalityDeclaration}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition"
          >
            ✉️ Send Pitch to {targetPub.websiteName} Editor
          </button>
        </form>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center py-12 space-y-4">
          <div className="text-5xl">✉️</div>
          <h2 className="text-2xl font-extrabold text-white">Pitch Sent to Editor!</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your guest article pitch has been delivered to {targetPub.websiteName}. Typical response time is within {targetPub.publishingTurnaroundDays} business days.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <a
              href="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Track Pitch in Dashboard ➔
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
