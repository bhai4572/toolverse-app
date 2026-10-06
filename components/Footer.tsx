import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Wrench, Lock, Heart } from 'lucide-react';
import { CATEGORIES, TOOLS } from '@/lib/tools/registry';
import { AdSlot } from './AdSlot';

export function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
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

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Tool Categories</h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">More Categories</h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(6).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools & Jobs (Bing Keyword Anchors) */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Popular Tools & Jobs</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/tools/pdf-merge" className="hover:text-white transition-colors">Merge PDF Online</Link></li>
              <li><Link href="/tools/pdf-split" className="hover:text-white transition-colors">Split PDF Pages</Link></li>
              <li><Link href="/tools/compress-image-target-size" className="hover:text-white transition-colors">Compress Image to 50KB</Link></li>
              <li><Link href="/tools/barcode-generator" className="hover:text-white transition-colors">Barcode Generator (Code 128)</Link></li>
              <li><Link href="/tools/pakistan-salary-tax-estimator" className="hover:text-white transition-colors">Pakistan Salary Tax Estimator</Link></li>
              <li><Link href="/jobs/remote-jobs" className="hover:text-white transition-colors">Remote Jobs Worldwide</Link></li>
              <li><Link href="/jobs/usa-jobs" className="hover:text-white transition-colors">Jobs in USA</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">SEO Guides & Blog</Link></li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Trust & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/legal/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/terms-of-use" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link href="/legal/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              <li><Link href="/legal/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="/legal/dmca" className="hover:text-white transition-colors">DMCA / Copyright</Link></li>
              <li><Link href="/legal/security" className="hover:text-white transition-colors">Security & Responsible Disclosure</Link></li>
              <li><Link href="/legal/about" className="hover:text-white transition-colors">About ToolVerse</Link></li>
              <li><Link href="/legal/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Ad Banner Box */}
        <AdSlot slotId="footer-banner" className="my-6" />

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} ToolVerse. All rights reserved. Zero mock data.
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <a
              href="https://omg10.com/4/11966216"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
            >
              ⚡ Featured Deals & Special Offers
            </a>
            <span>•</span>
            <span>Client-side WebAssembly & Web Crypto</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
