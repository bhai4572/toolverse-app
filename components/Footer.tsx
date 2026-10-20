'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Wrench } from 'lucide-react';
import { CATEGORIES, TOOLS } from '@/lib/tools/registry';
import { FooterAdBar } from './ads/FooterAdBar';

export function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 max-w-2xl space-y-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Wrench className="w-4 h-4" />
            </div>
            <span>ToolVerse</span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            {TOOLS.length}+ free browser utilities for PDFs, images, calculators, SEO helpers, and
            regional estimates. Most file tools process locally — we do not sell fake reviews or
            gate core tools behind paywalls.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span>Files processed locally in browser</span>
          </div>
        </div>

        {/* Link columns only — no per-column ads (ad-farm look) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/tools" className="hover:text-white transition-colors">Tools hub</Link></li>
              <li><Link href="/workspace" className="hover:text-white transition-colors">SEO Dashboard</Link></li>
              <li><Link href="/study" className="hover:text-white transition-colors">Study Abroad</Link></li>
              <li><Link href="/immigration" className="hover:text-white transition-colors">Immigration</Link></li>
              <li><Link href="/cars" className="hover:text-white transition-colors">Cars</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/travel" className="hover:text-white transition-colors">Travel</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Tool Categories</h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Popular Tools</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/tools/pdf-compress" className="hover:text-white transition-colors">Compress PDF</Link></li>
              <li><Link href="/tools/pdf-merge" className="hover:text-white transition-colors">Merge PDF</Link></li>
              <li><Link href="/tools/compress-image-target-size" className="hover:text-white transition-colors">Compress Image to Size</Link></li>
              <li><Link href="/tools/us-paycheck-calculator" className="hover:text-white transition-colors">US Paycheck Estimator</Link></li>
              <li><Link href="/tools/uk-take-home-pay-calculator" className="hover:text-white transition-colors">UK Take-Home Pay</Link></li>
              <li><Link href="/tools/global-job-finder" className="hover:text-white transition-colors">Job Finder</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Guides & Blog</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">News headlines</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Trust & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/legal/about" className="hover:text-white transition-colors">About ToolVerse</Link></li>
              <li><Link href="/legal/about-our-tools" className="hover:text-white transition-colors">About our tools</Link></li>
              <li><Link href="/legal/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/legal/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/terms-of-use" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link href="/legal/editorial-policy" className="hover:text-white transition-colors">Editorial Policy</Link></li>
              <li><Link href="/legal/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              <li><Link href="/legal/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="/legal/security" className="hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <FooterAdBar />

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} ToolVerse. Free tools · local file processing · honest labels.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-500">
            <Link href="/legal/about" className="hover:text-white transition-colors">About</Link>
            <span aria-hidden>•</span>
            <Link href="/legal/contact" className="hover:text-white transition-colors">Contact</Link>
            <span aria-hidden>•</span>
            <Link href="/legal/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
