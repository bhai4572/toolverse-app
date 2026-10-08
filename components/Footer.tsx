import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Wrench } from 'lucide-react';
import { CATEGORIES, TOOLS } from '@/lib/tools/registry';
import { FooterAdBar } from './ads/FooterAdBar';
import { FooterColumnAd } from './ads/FooterColumnAd';
import { AdsterraSmartLink } from './ads/AdsterraSmartLink';

export function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Brand strip */}
        <div className="mb-10 space-y-4 max-w-xl">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Wrench className="w-4 h-4" />
            </div>
            <span>ToolVerse</span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            {TOOLS.length}+ free and privacy-first online utilities for files, images, PDFs, writing &amp; academic integrity, calculators, developers, and creators worldwide.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span>Files processed locally in browser</span>
          </div>
        </div>

        {/* Exact 4-column grid — ads fill empty space under each column */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* 1. Product */}
          <div className="flex flex-col">
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/tools" className="hover:text-white transition-colors">Tools hub</Link></li>
              <li><Link href="/workspace" className="hover:text-white transition-colors">SEO Dashboard</Link></li>
              <li><Link href="/seo" className="hover:text-white transition-colors">SEO Suite</Link></li>
              <li><Link href="/study" className="hover:text-white transition-colors">Study Abroad</Link></li>
              <li><Link href="/immigration" className="hover:text-white transition-colors">Immigration</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/travel" className="hover:text-white transition-colors">Travel</Link></li>
              <li><Link href="/us" className="hover:text-white transition-colors">US tools</Link></li>
              <li><Link href="/uk" className="hover:text-white transition-colors">UK tools</Link></li>
              <li><Link href="/ca" className="hover:text-white transition-colors">Canada tools</Link></li>
              <li><Link href="/au" className="hover:text-white transition-colors">Australia tools</Link></li>
              <li><Link href="/passport-photos" className="hover:text-white transition-colors">Passport photo sizes</Link></li>
            </ul>
            <FooterColumnAd size="160x300" />
          </div>

          {/* 2. Tool Categories */}
          <div className="flex flex-col">
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
            <FooterColumnAd size="300x250" />
          </div>

          {/* 3. Popular Tools & Jobs */}
          <div className="flex flex-col">
            <h4 className="text-white font-semibold text-sm mb-4">Popular Tools & Jobs</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/tools/pdf-compress" className="hover:text-white transition-colors">Compress PDF Online</Link></li>
              <li><Link href="/tools/pdf-merge" className="hover:text-white transition-colors">Merge PDF Online</Link></li>
              <li><Link href="/tools/tip-calculator" className="hover:text-white transition-colors">Tip Calculator</Link></li>
              <li><Link href="/tools/us-paycheck-calculator" className="hover:text-white transition-colors">US Paycheck Estimator</Link></li>
              <li><Link href="/tools/uk-take-home-pay-calculator" className="hover:text-white transition-colors">UK Take-Home Pay</Link></li>
              <li><Link href="/tools/wifi-qr-code-generator" className="hover:text-white transition-colors">Wi‑Fi QR Code</Link></li>
              <li><Link href="/tools/compress-image-target-size" className="hover:text-white transition-colors">Compress Image to 50KB</Link></li>
              <li><Link href="/tools/pakistan-salary-tax-estimator" className="hover:text-white transition-colors">Pakistan Salary Tax Estimator</Link></li>
              <li><Link href="/jobs/remote-jobs" className="hover:text-white transition-colors">Remote Jobs Worldwide</Link></li>
              <li><Link href="/jobs/usa-jobs" className="hover:text-white transition-colors">Jobs in USA</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">SEO Guides & Blog</Link></li>
            </ul>
            <FooterColumnAd size="160x300" />
          </div>

          {/* 4. Trust & Legal */}
          <div className="flex flex-col">
            <h4 className="text-white font-semibold text-sm mb-4">Trust & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/legal/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/terms-of-use" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link href="/legal/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              <li><Link href="/legal/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="/legal/dmca" className="hover:text-white transition-colors">DMCA / Copyright</Link></li>
              <li><Link href="/legal/security" className="hover:text-white transition-colors">Security & Responsible Disclosure</Link></li>
              <li><Link href="/legal/about" className="hover:text-white transition-colors">About ToolVerse</Link></li>
              <li><Link href="/legal/editorial-policy" className="hover:text-white transition-colors">Editorial Policy</Link></li>
              <li><Link href="/legal/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
            <FooterColumnAd size="300x250" />
          </div>
        </div>

        {/* Full-width footer leaderboard + 300x250 row */}
        <FooterAdBar />

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} ToolVerse. All rights reserved. Zero mock data.
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <AdsterraSmartLink className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              Sponsored
            </AdsterraSmartLink>
            <span>•</span>
            <span>Client-side WebAssembly & Web Crypto</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
