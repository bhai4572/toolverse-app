'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Car, ExternalLink, Fuel, Shield, Wrench } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { UnderCtaAdBand } from '@/components/ads/UnderCtaAdBand';
import {
  BUYING_DOCUMENTS,
  CARS_DISCLAIMER,
  CARS_FAQS,
  EV_VS_GAS_COMPARE,
  FIRST_CAR_BUDGET_LINES,
  INSPECTION_CHECKLIST,
  INSURANCE_RANGES,
  MAINTENANCE_BASICS,
  OFFICIAL_LINKS,
  REGISTRATION_RANGES,
} from '@/lib/cars/data';

const TOOL_LINKS = [
  { href: '/tools/car-loan-calculator', label: 'Car loan / payment calculator' },
  { href: '/tools/fuel-trip-cost-calculator', label: 'Fuel trip cost (MPG / L/100km)' },
  { href: '/tools/loan-payoff-calculator', label: 'Loan payoff (extra payments)' },
  { href: '/tools/tip-calculator', label: 'Tip calculator' },
  { href: '/tools/us-paycheck-calculator', label: 'US paycheck estimator' },
  { href: '/tools/us-sales-tax-calculator', label: 'US sales tax' },
  { href: '/tools/pdf-merge', label: 'Merge purchase PDFs' },
  { href: '/tools/pdf-compress', label: 'Compress PDF' },
];

const GUIDE_LINKS = [
  { href: '/blog/used-car-inspection-checklist', label: 'Used car inspection checklist' },
  { href: '/blog/first-car-budget-usa', label: 'First car budget (US)' },
  { href: '/blog/uk-road-tax-mot-basics', label: 'UK road tax & MOT basics' },
];

export default function CarsHubPage() {
  return (
    <div className="space-y-10 py-4">
      <Breadcrumb items={[{ label: 'Cars' }]} />

      <header className="max-w-3xl space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
          <Car className="w-3.5 h-3.5" /> Cars data hub
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Car costs you can actually budget
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Loan payments, fuel trips, insurance/registration bands, EV vs gas ranges, buying docs, and maintenance intervals — maintained ranges plus official links (NHTSA, GOV.UK, fueleconomy.gov). No fake dealer inventory. No scraped listings.
        </p>
        <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800 rounded-lg px-3 py-2 leading-relaxed">
          {CARS_DISCLAIMER}
        </p>
      </header>

      <section className="grid sm:grid-cols-2 gap-3" aria-labelledby="car-tools-heading">
        <h2 id="car-tools-heading" className="sr-only">
          Calculators
        </h2>
        <Link
          href="/tools/car-loan-calculator"
          className="p-5 rounded-2xl border border-brand-300/70 dark:border-brand-700/50 bg-gradient-to-br from-brand-50 to-white dark:from-brand-950/40 dark:to-slate-900 hover:border-brand-500 transition-colors"
        >
          <Shield className="w-5 h-5 text-brand-600 mb-2" />
          <h2 className="font-bold text-slate-900 dark:text-white">Car loan / payment</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">Price, down payment, trade-in, tax %, APR, and term → monthly estimate.</p>
          <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-brand-600">
            Open calculator <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
        <Link
          href="/tools/fuel-trip-cost-calculator"
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/50 transition-colors"
        >
          <Fuel className="w-5 h-5 text-brand-600 mb-2" />
          <h2 className="font-bold text-slate-900 dark:text-white">Fuel trip cost</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">MPG or L/100km, distance, and pump price → fuel needed and trip cost.</p>
          <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-brand-600">
            Open calculator <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </section>

      <section className="space-y-3" aria-labelledby="insurance-heading">
        <h2 id="insurance-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Insurance cost bands (planning)
        </h2>
        <div className="space-y-4">
          {INSURANCE_RANGES.map((block) => (
            <div key={block.region}>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">{block.region}</h3>
              <ul className="space-y-2">
                {block.bands.map((b) => (
                  <li key={b.label} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{b.label}:</span> {b.range}
                    {b.note ? <span className="block text-xs text-slate-500 mt-0.5">{b.note}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="reg-heading">
        <h2 id="reg-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Registration, tax & MOT-style costs
        </h2>
        <ul className="space-y-2">
          {REGISTRATION_RANGES.map((b) => (
            <li key={b.label} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <span className="font-medium text-slate-800 dark:text-slate-200">{b.label}:</span> {b.range}
              {b.note ? <span className="block text-xs text-slate-500 mt-0.5">{b.note}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="ev-heading">
        <h2 id="ev-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          {EV_VS_GAS_COMPARE.title}
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/80">
              <tr>
                <th className="p-3 font-semibold text-slate-700 dark:text-slate-200">Factor</th>
                <th className="p-3 font-semibold text-slate-700 dark:text-slate-200">Gas / ICE</th>
                <th className="p-3 font-semibold text-slate-700 dark:text-slate-200">EV</th>
              </tr>
            </thead>
            <tbody>
              {EV_VS_GAS_COMPARE.rows.map((row) => (
                <tr key={row.factor} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="p-3 font-medium text-slate-800 dark:text-slate-200 align-top">{row.factor}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 align-top">{row.gas}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 align-top">{row.ev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="budget-heading">
        <h2 id="budget-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          First-car budget lines (US, illustrative)
        </h2>
        <ul className="space-y-2">
          {FIRST_CAR_BUDGET_LINES.map((b) => (
            <li key={b.label} className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium text-slate-800 dark:text-slate-200">{b.label}:</span> {b.range}
              {b.note ? <span className="block text-xs text-slate-500 mt-0.5">{b.note}</span> : null}
            </li>
          ))}
        </ul>
        <Link href="/blog/first-car-budget-usa" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
          Full first-car budget guide <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      <section className="space-y-3" aria-labelledby="docs-heading">
        <h2 id="docs-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Buying document checklist
        </h2>
        <ul className="grid sm:grid-cols-2 gap-2">
          {BUYING_DOCUMENTS.map((d) => (
            <li key={d} className="text-sm text-slate-600 dark:text-slate-400 flex gap-2">
              <span className="text-brand-600 shrink-0">✓</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500">
          Merge invoices and title scans with{' '}
          <Link href="/tools/pdf-merge" className="text-brand-600 font-semibold hover:underline">
            PDF Merge
          </Link>{' '}
          (browser-side).
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="inspect-heading">
        <h2 id="inspect-heading" className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-4 h-4 text-brand-600" /> Inspection snapshot
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {INSPECTION_CHECKLIST.map((block) => (
            <div key={block.area}>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{block.area}</h3>
              <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                {block.checks.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link href="/blog/used-car-inspection-checklist" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
          Full used-car checklist <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      <section className="space-y-3" aria-labelledby="maint-heading">
        <h2 id="maint-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Maintenance interval basics
        </h2>
        <ul className="space-y-2">
          {MAINTENANCE_BASICS.map((m) => (
            <li key={m.item} className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium text-slate-800 dark:text-slate-200">{m.interval}</span> — {m.item}
              <span className="block text-xs text-slate-500 mt-0.5">{m.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="official-heading">
        <h2 id="official-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Official links
        </h2>
        <ul className="space-y-2">
          {OFFICIAL_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
              >
                {l.label} <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {l.note ? <span className="block text-xs text-slate-500 ml-0">{l.note}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="guides-heading">
        <h2 id="guides-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Guides
        </h2>
        <div className="flex flex-wrap gap-2">
          {GUIDE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:border-brand-500 text-slate-700 dark:text-slate-200"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="related-tools-heading">
        <h2 id="related-tools-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Related tools
        </h2>
        <div className="flex flex-wrap gap-2">
          {TOOL_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:border-brand-500 text-slate-700 dark:text-slate-200"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="faq-heading" id="faq">
        <h2 id="faq-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          FAQs
        </h2>
        <div className="space-y-3">
          {CARS_FAQS.map((f) => (
            <details key={f.question} className="group rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <summary className="cursor-pointer font-semibold text-sm text-slate-900 dark:text-white list-none flex justify-between gap-2">
                {f.question}
                <span className="text-slate-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <UnderCtaAdBand />
    </div>
  );
}
