'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Camera, CheckCircle2, ShieldCheck, AlertCircle, FileCheck, HelpCircle } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PASSPORT_PRESETS } from '@/lib/image/engine';

export default function PassportPhotosHubPage() {
  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: 'Passport Photo Sizes & Portal Guide' }]} />

      <header className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
          <Camera className="w-4 h-4" /> Global Passport &amp; Visa Photo Specifications
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Passport Photo Sizes, Pixels &amp; Target KB Guide
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Everything you need to size, crop, and compress your official biometric passport photos for the US, UK, Schengen, Canada, and government exam portals. Crop locally in your browser with zero file uploads.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/tools/passport-photo-maker"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-500/20 transition-all"
          >
            Launch Passport Photo Maker <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/tools/compress-image-target-size"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-brand-500 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-all"
          >
            Compress Photo to 50KB / 20KB
          </Link>
        </div>
      </header>

      {/* Quick Comparison Table */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Standard Passport Photo Specifications by Jurisdiction
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold">
              <tr>
                <th className="p-3.5">Country / Region</th>
                <th className="p-3.5">Physical Dimensions</th>
                <th className="p-3.5">Pixels @ 300 DPI</th>
                <th className="p-3.5">Background Color</th>
                <th className="p-3.5">Online Size Cap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🇺🇸</span> United States (US Visa / DS-160)
                </td>
                <td className="p-3.5">2 × 2 inches (51 × 51 mm)</td>
                <td className="p-3.5 font-mono">600 × 600 px</td>
                <td className="p-3.5">Plain White / Off-white</td>
                <td className="p-3.5 font-semibold text-emerald-600">≤ 240 KB</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🇬🇧</span> United Kingdom (HM Passport)
                </td>
                <td className="p-3.5">35 × 45 mm</td>
                <td className="p-3.5 font-mono">413 × 531 px</td>
                <td className="p-3.5">Light Grey or Cream</td>
                <td className="p-3.5 font-semibold text-emerald-600">50 KB – 10 MB</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🇪🇺</span> Schengen Visa (Europe)
                </td>
                <td className="p-3.5">35 × 45 mm</td>
                <td className="p-3.5 font-mono">413 × 531 px</td>
                <td className="p-3.5">Light Grey / White</td>
                <td className="p-3.5 font-semibold text-emerald-600">≤ 2 MB</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🇨🇦</span> Canada (IRCC / Passport)
                </td>
                <td className="p-3.5">50 × 70 mm</td>
                <td className="p-3.5 font-mono">590 × 826 px</td>
                <td className="p-3.5">Pure White / Light</td>
                <td className="p-3.5 font-semibold text-emerald-600">≤ 4 MB</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🇦🇺</span> Australia (Passports Act)
                </td>
                <td className="p-3.5">35 × 45 mm</td>
                <td className="p-3.5 font-mono">413 × 531 px</td>
                <td className="p-3.5">Plain Light Grey / White</td>
                <td className="p-3.5 font-semibold text-emerald-600">≤ 5 MB</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🇮🇳</span> Indian / Pakistani Exam Portals
                </td>
                <td className="p-3.5">3.5 × 4.5 cm</td>
                <td className="p-3.5 font-mono">413 × 531 px</td>
                <td className="p-3.5">White or Light Blue</td>
                <td className="p-3.5 font-bold text-amber-600">20 KB – 50 KB</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed Technical Guides */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* US 2x2 Guide */}
        <article className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-lg">
            <span>🇺🇸</span>
            <h2>US 2×2 Inch Passport &amp; Visa Specifications</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The United States Department of State requires a square 2×2 inch photo for US Passports, Diversity Visa (Green Card Lottery), and non-immigrant DS-160 forms.
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Head Measurement:</strong> Between 1 inch and 1 3/8 inches (25 mm to 35 mm) from the bottom of the chin to the top of the head.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Resolution:</strong> 600×600 px at 300 DPI (minimum) up to 1200×1200 px at 600 DPI.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>File Size:</strong> Must be 240 KB or less for online DS-160/CEAC submission.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Eyeglasses Rule:</strong> Eyeglasses are strictly prohibited in US passport photos since 2016.</span>
            </li>
          </ul>
          <Link
            href="/tools/passport-photo-maker"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline"
          >
            Crop to US 2×2 Inch Preset <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </article>

        {/* UK & Schengen 35x45 Guide */}
        <article className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-lg">
            <span>🇬🇧</span>
            <h2>UK, Schengen &amp; India 35×45 mm Guide</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Standard format across the UK, 29 European Schengen member states, India, Singapore, and Australia.
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Pixel Dimensions:</strong> 413 pixels wide × 531 pixels high when rendered at 300 DPI.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Head Height:</strong> Chin-to-crown must occupy between 32 mm and 36 mm (70%–80% of photo).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Background:</strong> Light grey or cream for UK; white or off-white for Schengen and India.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Facial Biometrics:</strong> Neutral expression, closed mouth, directly facing camera with even lighting.</span>
            </li>
          </ul>
          <Link
            href="/tools/passport-photo-maker"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline"
          >
            Crop to UK/Schengen 35×45 mm Preset <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </article>
      </div>

      {/* The 50KB Exam Portal Workflow */}
      <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-brand-50 to-white dark:from-brand-950/40 dark:to-slate-900 border border-brand-200 dark:border-brand-800 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-brand-600" />
          How to Hit the 20KB – 50KB Exam Portal Cap (Without Blurry Results)
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          State recruitment portals (such as PPSC, UPSC, FPSC, SSC, and medical entrance boards) strictly reject headshots above 50 KB or 20 KB. Follow this verified 3-step pipeline:
        </p>
        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">1</div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Crop to Ratio</h3>
            <p className="text-xs text-slate-500">
              Use <Link href="/tools/passport-photo-maker" className="text-brand-600 underline">Passport Photo Maker</Link> to position eyes and chin to the 35×45mm ratio.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">2</div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Set Target Size</h3>
            <p className="text-xs text-slate-500">
              Open <Link href="/tools/compress-image-target-size" className="text-brand-600 underline">Compress Image to Target Size</Link> and select 50KB or 20KB preset.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">3</div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Download &amp; Upload</h3>
            <p className="text-xs text-slate-500">
              Your compressed JPEG maintains crisp facial clarity while complying with the strict file size ceiling.
            </p>
          </div>
        </div>
      </section>

      {/* Available Presets */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          All Built-in Passport &amp; Visa Sizing Presets
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PASSPORT_PRESETS.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {p.widthPx} × {p.heightPx} px · aspect {p.aspect}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Guarantee */}
      <section className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">Browser-Only Biometric Privacy Guarantee</p>
          <p>
            Passport photos contain sensitive facial biometric indicators. Unlike upload-first cloud tools, ToolVerse processes your camera photos entirely in your local browser memory using HTML5 Canvas. Zero photos are transmitted to external servers.
          </p>
        </div>
      </section>
    </div>
  );
}
