import React from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import CvMakerTool from '../../features/tools/cv-builder/CvMakerTool';
import { CV_TEMPLATES } from '../../lib/cv/templatesCatalog';

export default function CvMakerPage() {
  return (
    <div className="space-y-10">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Career & Productivity Tools', href: '/category/text-tools' },
          { label: 'Free CV Maker & Resume Builder' },
        ]}
      />

      {/* Hero Header */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-indigo-900/50">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-wider">
              100% Free Forever • Zero Watermarks
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold">
              25 ATS & Executive Templates
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-bold">
              Unlimited Custom Sections & Fields
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Free CV Maker Online – Create Professional Resumes
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Build a job-winning Curriculum Vitae or professional resume in minutes. Choose from 25
            genuinely distinct templates, add unlimited custom sections and fields, preview
            multi-page layouts in real time, and download high-resolution PDF, PNG, or JPG files
            with no registration and no watermark.
          </p>
        </div>
      </header>

      {/* Main Interactive Studio */}
      <section aria-label="Interactive CV and Resume Builder Studio">
        <CvMakerTool />
      </section>

      {/* SEO & User Guide Content */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-8">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-2xl font-extrabold text-slate-900">
            How to Build an ATS-Friendly CV & Resume Online for Free
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Recruiters and Applicant Tracking Systems (ATS) scan resumes for clear hierarchy,
            standardized section headings, verifiable dates, and role-relevant keywords. Toolverse’s
            Free CV Maker gives you complete control over both structure and visual presentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Step 1 • Enter Career Details
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Complete Core & Specialized Sections
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Add your personal contact details, executive summary, work experience, education,
              categorized skills, and choose from 20 specialized sections including Projects,
              Certifications, Publications, Research, Clinical Experience, and Patents.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Step 2 • Unlimited Custom Fields
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Tailor Every Section to Your Industry
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every profession is unique. Use the Custom Section & Field Builder to create custom
              sections with single-line text, dates, URLs, bullet lists, or multiline descriptions,
              and drag-and-drop sections into your preferred order.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Step 3 • Instant Multi-Format Export
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Download PDF, PNG, JPG, or Print
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Switch effortlessly among 25 templates without losing a single character of data.
              Export in A4 or US Letter PDF with selectable text, high-DPI PNG/JPG images, or print
              directly from your browser.
            </p>
          </div>
        </div>

        {/* All 25 Templates Overview */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900">
            Explore All 25 Professional CV & Resume Templates
          </h2>
          <p className="text-xs text-slate-600">
            Every template below is included for free and engineered for specific career stages,
            industries, and regional standards (US, UK/EU Europass, Canada, Australia, and
            International).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CV_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3"
              >
                <span
                  className="w-7 h-7 rounded-lg text-white text-xs font-extrabold flex items-center justify-center shrink-0"
                  style={{ backgroundColor: tpl.defaultAccent }}
                >
                  {tpl.number}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900">{tpl.name}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{tpl.description}</div>
                  <div className="text-[10px] font-semibold text-indigo-700 mt-1">
                    {tpl.category} • {tpl.tagline}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900">
            Frequently Asked Questions — Free Online CV Builder
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-sm font-bold text-slate-900">
                Is the Toolverse CV Maker really 100% free without watermarks?
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Yes. All 25 templates, custom sections, and PDF, PNG, and JPG downloads are
                completely free. We never add watermarks, never lock templates behind a paywall, and
                never require account registration.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-sm font-bold text-slate-900">
                Where is my personal CV information stored?
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Your privacy comes first. All CV editing and document generation run locally in your
                browser. Your draft is saved only in your own browser’s localStorage, and you can
                export a JSON backup or clear all data with one click.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-sm font-bold text-slate-900">
                Can I switch templates after entering my information?
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Absolutely. Your CV content is stored independently from the visual template design.
                You can switch between all 25 templates—from ATS Standard to Modern Two-Column or
                Academic CV—without losing any fields or custom sections.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h3 className="text-sm font-bold text-slate-900">
                Does the CV Builder support multi-page CVs and RTL languages?
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Yes. The preview and export engine automatically expand across multiple A4 or US
                Letter pages as your content grows, and support English, French, German, Spanish,
                Arabic (RTL), and Urdu (RTL) section headings.
              </p>
            </div>
          </div>
        </div>

        {/* Related Career & Document Tools Internal Links */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <h2 className="text-base font-extrabold text-slate-900">
            Related Career, Outreach & Document Tools on Toolverse
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/tools/email-finder"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-xs font-semibold text-slate-800 hover:text-indigo-700 border border-slate-200 transition"
            >
              🔍 B2B Email Finder & Company Intelligence
            </Link>
            <Link
              href="/tools/word-counter"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-xs font-semibold text-slate-800 hover:text-indigo-700 border border-slate-200 transition"
            >
              📝 Word & Character Counter
            </Link>
            <Link
              href="/tools/merge-pdf"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-xs font-semibold text-slate-800 hover:text-indigo-700 border border-slate-200 transition"
            >
              📄 Merge PDF Documents
            </Link>
            <Link
              href="/tools/compress-pdf"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-xs font-semibold text-slate-800 hover:text-indigo-700 border border-slate-200 transition"
            >
              🗜️ Compress PDF Size
            </Link>
            <Link
              href="/tools/image-compressor"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-xs font-semibold text-slate-800 hover:text-indigo-700 border border-slate-200 transition"
            >
              🖼️ Profile Image Compressor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
