import React from 'react';
import { HOW_TO_GUIDES } from '../page';

interface HowToDetailPageProps {
  params: { slug: string };
}

export default function HowToGuideDetailPage({ params }: HowToDetailPageProps) {
  const guide = HOW_TO_GUIDES.find((g) => g.slug === params.slug);

  if (!guide) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-slate-800">Guide Not Found</h1>
        <p className="text-slate-500 text-sm">The requested guide does not exist.</p>
        <a href="/how-to" className="inline-block text-indigo-600 font-bold hover:underline">
          &larr; Back to How-To Guides
        </a>
      </div>
    );
  }

  return (
    <article className="space-y-8 max-w-4xl mx-auto text-xs text-slate-700 dark:text-slate-300">
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 space-x-2">
        <a href="/" className="hover:underline">Home</a> &gt;
        <a href="/how-to" className="hover:underline">How-To</a> &gt;
        <span className="text-slate-800 dark:text-slate-200 font-semibold">{guide.title}</span>
      </nav>

      <header className="space-y-3 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-full">
          {guide.category}
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">{guide.title}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">{guide.description}</p>
      </header>

      <section className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 leading-relaxed text-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Overview &amp; Practical Instructions</h2>
        <p>
          Toolverse provides every eligible business with a permanent digital identity code (`TV-BIZ-XXXXXX`). By registering your business profile, you establish a canonical presence that connects offline customers to online reviews and category rankings.
        </p>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Registering Your Profile</h3>
        <p>
          Navigate to `/business/register` and complete the 4-step onboarding form. Provide your official website, physical address (or global online coverage), services, and operating hours.
        </p>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Printing Your QR Badge</h3>
        <p>
          Visit `/business-qr`, choose your design template (Minimal, Premium, Dark, Verified), and download high-resolution vector SVG or PNG files suitable for 10x10cm window decals or countertop stands.
        </p>
      </section>
    </article>
  );
}
