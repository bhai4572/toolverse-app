'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Landmark,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileText,
  Briefcase,
} from 'lucide-react';
import { getAllCountries } from '@/lib/travel/countryRegistry';

const WORK_DESTINATIONS = ['AE', 'SA', 'GB', 'CA', 'DE', 'QA', 'OM', 'US'] as const;

export default function ImmigrationPage() {
  const countries = getAllCountries().filter((c) =>
    WORK_DESTINATIONS.includes(c.iso2 as (typeof WORK_DESTINATIONS)[number])
  );

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto">
      <header className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
          <Landmark className="w-4 h-4" /> Global Visa &amp; Immigration Document Hub
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Immigration Document Prep &amp; Upload Rules
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Verified file size limits, document bundling strategies, and upload checklists for UKVI, Canada IRCC, US CEAC, and VFS Global portals. Prepare application bundles privately without cloud uploads.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/tools/compress-pdf-to-200kb"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-500/20 transition-all"
          >
            Compress PDF to 200KB <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/tools/pdf-merge"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-brand-500 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-all"
          >
            Merge Application Documents
          </Link>
        </div>
      </header>

      {/* Official Portal Upload Caps Table */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-brand-600" />
          Official Immigration Portal Upload Limits
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold">
              <tr>
                <th className="p-3.5">Immigration Portal</th>
                <th className="p-3.5">Per-File Limit</th>
                <th className="p-3.5">Accepted Formats</th>
                <th className="p-3.5">Key Upload Advice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                  🇬🇧 UKVI (GOV.UK Visa &amp; Immigration)
                </td>
                <td className="p-3.5 font-mono font-bold text-brand-600">5 MB (prefer ≤ 200KB)</td>
                <td className="p-3.5">PDF, PNG, JPEG</td>
                <td className="p-3.5">Payslips and sponsor letters should be combined into one PDF per slot.</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                  🇨🇦 Canada IRCC (Express Entry &amp; Permits)
                </td>
                <td className="p-3.5 font-mono font-bold text-brand-600">4 MB per slot</td>
                <td className="p-3.5">PDF, JPG, TIFF</td>
                <td className="p-3.5">Strict limit: multi-page proof of funds must stay sharp under 4 MB.</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                  🇺🇸 US CEAC (DS-260 &amp; DS-160 Immigrant)
                </td>
                <td className="p-3.5 font-mono font-bold text-brand-600">2 MB per document</td>
                <td className="p-3.5">PDF, JPEG</td>
                <td className="p-3.5">Black-and-white or greyscale scans recommended to stay under 2 MB.</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                  🌐 VFS Global &amp; TLScontact
                </td>
                <td className="p-3.5 font-mono font-bold text-brand-600">2 MB – 5 MB</td>
                <td className="p-3.5">PDF, JPEG</td>
                <td className="p-3.5">Upload all supporting evidence before the biometric appointment.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* The Application Pack Bundling Workflow */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-600" />
          How to Build a Clean Visa Application Pack
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Visa officers typically reject applications with dozens of disjointed image files. Portals provide single upload slots labeled “Employment Proof” or “Educational Credentials.” Here is the proven workflow:
        </p>

        <div className="grid sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase">Step 1</span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Convert Photos to PDF</h3>
            <p className="text-xs text-slate-500">
              Convert smartphone photos of degrees, transcripts, or contracts using <Link href="/tools/images-to-pdf" className="text-brand-600 underline">Images to PDF</Link>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase">Step 2</span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Merge &amp; Order Pages</h3>
            <p className="text-xs text-slate-500">
              Combine CV, offer letters, and payslips chronologically using <Link href="/tools/pdf-merge" className="text-brand-600 underline">Merge PDF</Link>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase">Step 3</span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Compress to Target Cap</h3>
            <p className="text-xs text-slate-500">
              Pass the bundle through <Link href="/tools/compress-pdf-to-200kb" className="text-brand-600 underline">Compress PDF to 200KB</Link> to ensure instant portal acceptance.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Work & Visa Corridors */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Popular Work &amp; Immigration Corridors
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {countries.map((c) => (
            <Link
              key={c.iso2}
              href={`/travel/PK/${c.iso2}`}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/60 transition-all group"
            >
              <div className="text-2xl">{c.flagEmoji}</div>
              <div className="font-bold text-sm mt-1 text-slate-900 dark:text-white group-hover:text-brand-600">
                {c.commonName}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Visa rules &amp; checklist</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Privacy Guarantee */}
      <section className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">Zero Server Upload Privacy Guarantee</p>
          <p>
            Immigration packets contain your most private personal documents: passports, tax returns, bank statements, and family records. ToolVerse performs PDF merging, page splitting, and compression 100% locally in your web browser memory. Your documents never touch our servers.
          </p>
        </div>
      </section>
    </div>
  );
}
