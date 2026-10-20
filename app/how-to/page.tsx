import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';

export const HOW_TO_GUIDES = [
  {
    slug: 'how-to-create-a-business-profile',
    title: 'How to Create a Verified Toolverse Business Profile',
    description: 'Step-by-step guide to setting up your business identity, adding services, hours, and location data.',
    category: 'Onboarding & Identity',
  },
  {
    slug: 'how-to-generate-and-print-business-qr',
    title: 'How to Generate & Print Your Toolverse Business QR Badge',
    description: 'Learn how to generate vector SVG badges and print durable QR identity codes for your storefront or counter.',
    category: 'QR Identity System',
  },
  {
    slug: 'how-business-rankings-work',
    title: 'How Business Rankings & Verified Status Work on Toolverse',
    description: 'Understand the difference between organic community trust rankings and transparent sponsored Top 3 placements.',
    category: 'Rankings & Trust',
  },
  {
    slug: 'how-to-verify-business-ownership',
    title: 'How to Complete Risk-Based Business Verification',
    description: 'Everything you need to know about verification levels, document upload requirements, and admin review approval.',
    category: 'Verification & Safety',
  },
  {
    slug: 'how-to-get-a-toolverse-business-id',
    title: 'How to Get a Permanent Toolverse Business ID (TV-BIZ)',
    description: 'Understand how permanent TV-BIZ identifiers work, how they resolve offline scans, and how to claim yours.',
    category: 'Onboarding & Identity',
  },
  {
    slug: 'how-to-collect-honest-customer-reviews',
    title: 'How to Collect Honest Customer Reviews with QR Badges',
    description: 'Strategies to encourage happy customers to scan your QR code and leave authentic, verified feedback.',
    category: 'Reputation & Growth',
  },
  {
    slug: 'how-sponsored-ranking-works',
    title: 'How Sponsored Category Rankings Work Transparently',
    description: 'Learn how daily bidding works for top-of-category placement while preserving organic community integrity.',
    category: 'Rankings & Trust',
  },
  {
    slug: 'how-to-claim-a-business',
    title: 'How to Claim an Existing Business Profile on Toolverse',
    description: 'Claim ownership of your business listing by verifying official domain email or business documentation.',
    category: 'Verification & Safety',
  },
  {
    slug: 'how-to-report-a-fake-business',
    title: 'How to Report a Fake or Inaccurate Business Listing',
    description: 'How our moderation team investigates community reports, removes spam listings, and maintains ecosystem trust.',
    category: 'Moderation & Community',
  },
];

export default function HowToHubPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-bold uppercase">
          <BookOpen className="w-3.5 h-3.5" /> How-To Knowledge &amp; Guide Center
        </div>
        <h1 className="text-3xl sm:text-5xl font-black">Official Toolverse Guides</h1>
        <p className="text-slate-300 text-base max-w-2xl leading-relaxed">
          Comprehensive practical guides explaining business onboarding, permanent QR identity printing, verification levels, and category rankings.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {HOW_TO_GUIDES.map((guide) => (
          <div
            key={guide.slug}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-2xl shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-md">
                {guide.category}
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">
                <a href={`/how-to/${guide.slug}`}>{guide.title}</a>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{guide.description}</p>
            </div>

            <a
              href={`/how-to/${guide.slug}`}
              className="pt-3 font-bold text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 border-t"
            >
              Read Full Guide <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
