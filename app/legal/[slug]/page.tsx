import React from 'react';
import { Breadcrumb } from '@/components/Breadcrumb';
import type { Metadata } from 'next';

const LEGAL_PAGES: Record<string, { title: string; content: string }> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    content: `
      <p class="text-xs text-slate-500 font-medium mb-4">Last Updated: October 6, 2026 | Effective Date: October 6, 2026</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">1. Privacy-First Client Architecture</h2>
      <p class="leading-relaxed">At ToolVerse (accessible via https://toolverse.baby and https://toolverse-app.pages.dev), privacy is built directly into our application architecture. Over 90% of our online utilities (including PDF mergers, image compressors, format converters, text tools, and calculators) process your files 100% locally within your client browser memory using HTML5 Canvas, WebAssembly (WASM), and Web Crypto APIs. Your private files, documents, photos, and media are never transmitted, uploaded, or stored on external cloud servers.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">2. Information We Collect</h2>
      <p class="leading-relaxed">We do not require user account registration, passwords, or personal profile creation for basic tool usage. We do not collect names, phone numbers, or credit card information. Technical server logs (such as IP addresses, browser user-agents, request timestamps, and rate-limiting counters) are processed automatically by our CDN provider (Cloudflare) for network stability, DDoS defense, and abuse prevention.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">3. Local Storage & Browser Preferences</h2>
      <p class="leading-relaxed">We utilize your web browser's native LocalStorage to store non-sensitive user preferences such as your dark mode theme selection, recent tool history, and short link records generated via our URL shortener. This data resides solely on your device and can be cleared at any time via your browser settings.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">4. Google AdSense & Third-Party Advertising Disclosures</h2>
      <p class="leading-relaxed">ToolVerse displays advertisements served by Google AdSense and third-party advertising partners. Google, as a third-party vendor, uses cookies (including the DART cookie and DoubleClick cookies) to serve ads to users based on their visits to ToolVerse and other websites across the Internet.</p>
      <ul class="list-disc pl-5 space-y-1 my-2">
        <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
        <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
        <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" class="text-brand-600 underline">Google Ads Settings</a>. Alternatively, users can opt out of third-party vendor cookies for personalized advertising by visiting <a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer" class="text-brand-600 underline">AboutAds.info</a>.</li>
      </ul>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">5. GDPR & CCPA User Privacy Rights</h2>
      <p class="leading-relaxed">If you reside in the European Economic Area (EEA), United Kingdom, or California, you have the right to request access to, deletion of, or restriction of your personal data. Because ToolVerse does not maintain user accounts or store client files on cloud databases, we store no personal file data to delete or disclose. For technical CDN logs, you may exercise your rights by contacting support@toolverse.baby.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">6. Children's Online Privacy (COPPA Compliance)</h2>
      <p class="leading-relaxed">ToolVerse does not knowingly collect or solicit personal identifiable information from children under the age of 13. If you believe a minor has provided personal data on our platform, please contact us immediately so we can purge the records.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">7. Contact & Privacy Inquiries</h2>
      <p class="leading-relaxed">For questions regarding this Privacy Policy or data inquiries, please email our privacy team at <a href="mailto:support@toolverse.baby" class="text-brand-600 font-semibold underline">support@toolverse.baby</a>.</p>
    `,
  },
  'terms-of-use': {
    title: 'Terms of Use',
    content: `
      <p class="text-xs text-slate-500 font-medium mb-4">Last Updated: October 6, 2026</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">1. Acceptance of Terms</h2>
      <p class="leading-relaxed">By accessing, browsing, or using ToolVerse (https://toolverse.baby), you agree to be bound by these Terms of Use and all applicable laws and regulations.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">2. Permitted Use</h2>
      <p class="leading-relaxed">ToolVerse provides free web utility tools for personal, educational, professional, and commercial workflows. You agree not to misuse the platform for automated web scraping, spam link generation, distributing malicious payloads, or launching denial-of-service (DDoS) attacks against our infrastructure.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">3. Disclaimer of Warranties</h2>
      <p class="leading-relaxed">All tools, converters, and calculators are provided on an "as is" and "as available" basis without warranties of any kind. Financial calculators, tax estimators (such as Pakistan Salary Tax and Zakat), and unit conversions are provided for educational and estimation purposes only.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">4. Limitation of Liability</h2>
      <p class="leading-relaxed">In no event shall ToolVerse or its operators be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our tools or information.</p>
    `,
  },
  'disclaimer': {
    title: 'Disclaimer',
    content: `
      <p class="text-xs text-slate-500 font-medium mb-4">Last Updated: October 6, 2026</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Educational & Estimation Purpose Only</h2>
      <p class="leading-relaxed">All calculators, tax estimators (such as Pakistan Salary Tax FY 2024-25 & 2025-26, Zakat Calculator, and Loan EMI Estimators) on ToolVerse generate estimations based on standardized mathematical formulas and published tax slabs. They do not constitute formal financial, tax, legal, or professional accounting advice.</p>
      
      <p class="leading-relaxed mt-4">Users are advised to confirm official tax obligations and financial decisions with certified tax consultants, legal professionals, or official government portals (such as the Federal Board of Revenue FBR in Pakistan).</p>
    `,
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    content: `
      <p class="text-xs text-slate-500 font-medium mb-4">Last Updated: October 6, 2026</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">1. Essential Local Storage Usage</h2>
      <p class="leading-relaxed">ToolVerse uses essential web browser LocalStorage to maintain basic site features such as remembering your dark mode theme preference, recent tool list, and short link history. LocalStorage data remains on your physical device.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">2. Third-Party Advertising Cookies</h2>
      <p class="leading-relaxed">Google AdSense and third-party advertising partners may set cookies on your browser to measure ad performance and display personalized ads. You can manage or block advertising cookies via your browser security settings or through <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" class="text-brand-600 underline">AboutAds Choices</a>.</p>
    `,
  },
  'dmca': {
    title: 'DMCA / Copyright Policy',
    content: `
      <p class="text-xs text-slate-500 font-medium mb-4">Last Updated: October 6, 2026</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Intellectual Property Respect</h2>
      <p class="leading-relaxed">ToolVerse respects the intellectual property rights of creators. Because our tools process images, PDFs, and text locally inside user browser memory, ToolVerse does not host, index, or store user-uploaded media files on public servers.</p>
      
      <p class="leading-relaxed mt-4">If you believe any static content or link on ToolVerse infringes upon your copyrighted material, please send a formal DMCA Takedown Notice to our abuse team at <a href="mailto:support@toolverse.baby" class="text-brand-600 font-semibold underline">support@toolverse.baby</a> with proof of copyright ownership.</p>
    `,
  },
  'about': {
    title: 'About ToolVerse',
    content: `
      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">What is ToolVerse?</h2>
      <p class="leading-relaxed"><strong>ToolVerse</strong> (https://toolverse.baby) is a privacy-first suite of 95+ free online utilities for PDFs, images, calculators, writing, SEO helpers, developer tools, and regional finance estimates. Most file tools process data in your browser with Canvas, WebAssembly, and Web Crypto — so sensitive documents do not need to be uploaded for core conversions.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Our Mission</h2>
      <p class="leading-relaxed">Everyday conversions and calculators should be free, fast, and private. We focus on practical tools people actually search for — target-size image compression, PDF merge/split, QR and barcodes, Pakistan salary tax estimates, and more — without signup walls for basic use.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Privacy & Security First</h2>
      <p class="leading-relaxed">Unlike upload-first converter sites, ToolVerse is designed so client-side tools keep files in browser memory for that session. Advertising partners (such as Google AdSense) may use cookies as described in our Privacy Policy. Contact: <a href="mailto:support@toolverse.baby" class="text-brand-600 font-semibold underline">support@toolverse.baby</a>.</p>
    `,
  },
  'contact': {
    title: 'Contact Support',
    content: `
      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Get in Touch</h2>
      <p class="leading-relaxed">Have questions, feedback, or tool feature requests? We would love to hear from you!</p>
      
      <div class="p-6 bg-slate-100 dark:bg-slate-800 rounded-xl my-6 space-y-3">
        <div><strong class="text-slate-900 dark:text-white">Official Support Email:</strong> <a href="mailto:support@toolverse.baby" class="text-brand-600 font-semibold underline">support@toolverse.baby</a></div>
        <div><strong class="text-slate-900 dark:text-white">Response Time:</strong> Within 24-48 business hours</div>
        <div><strong class="text-slate-900 dark:text-white">Primary Domain:</strong> https://toolverse.baby</div>
      </div>
    `,
  },
  'editorial-policy': {
    title: 'Editorial & Quality Policy',
    content: `
      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">High Standards & Ethical Integrity</h2>
      <p class="leading-relaxed">ToolVerse is committed to providing accurate, reliable, and verified utilities and information. All calculators (such as FBR Salary Tax and Zakat) are verified against official published government tax slabs and mathematical formulas.</p>
      <p class="leading-relaxed mt-2">We strictly prohibit deceptive claims, AI-generated spam content, Turnitin evasion claims, or deceptive advertising tricks.</p>
    `,
  },
  'security': {
    title: 'Security & Responsible Disclosure',
    content: `
      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Security Architecture</h2>
      <p class="leading-relaxed">We enforce strict HTTP Security Headers, Content Security Policies (CSP), subresource integrity, and Cloudflare DDoS defense. If you discover a potential vulnerability, please report it responsibly to security@toolverse.baby.</p>
    `,
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = LEGAL_PAGES[params.slug];
  if (!page) return { title: 'Page Not Found — ToolVerse' };

  return {
    title: `${page.title} — ToolVerse`,
  };
}

export default function LegalPage({ params }: { params: { slug: string } }) {
  const page = LEGAL_PAGES[params.slug];
  if (!page) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Page Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">The requested legal or information page does not exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <Breadcrumb items={[{ label: page.title }]} />
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{page.title}</h1>
      <div
        className="prose dark:prose-invert max-w-none text-sm leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}
