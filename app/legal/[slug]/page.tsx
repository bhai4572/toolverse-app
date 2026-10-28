import React from 'react';
import { Breadcrumb } from '@/components/Breadcrumb';
import type { Metadata } from 'next';

export const LEGAL_PAGES: Record<string, { title: string; content: string }> = {
  'privacy-policy': {
    title: 'Privacy Policy',
    content: `
      <p class="text-xs text-slate-500 font-medium mb-4">Last Updated: October 20, 2026 | Effective Date: October 6, 2026</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">1. Privacy-First Client Architecture</h2>
      <p class="leading-relaxed">At ToolVerse (accessible via https://toolverse.baby and https://toolverse-app.pages.dev), privacy is built directly into our application architecture. Over 90% of our online utilities (including PDF mergers, image compressors, format converters, text tools, and calculators) process your files 100% locally within your client browser memory using HTML5 Canvas, WebAssembly (WASM), and Web Crypto APIs. Your private files, documents, photos, and media are never transmitted, uploaded, or stored on external cloud servers for those client-side tools.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">2. Information We Collect</h2>
      <p class="leading-relaxed">We do not require user account registration, passwords, or personal profile creation for basic tool usage. We do not collect names, phone numbers, or credit card information for free tools. Technical server logs (such as IP addresses, browser user-agents, request timestamps, and rate-limiting counters) are processed automatically by our CDN provider (Cloudflare) for network stability, DDoS defense, and abuse prevention.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">3. Local Storage & Browser Preferences</h2>
      <p class="leading-relaxed">We utilize your web browser's native LocalStorage to store non-sensitive user preferences such as your dark mode theme selection, recent tool history, and short link records generated via our URL shortener. This data resides solely on your device and can be cleared at any time via your browser settings.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">4. Advertising & Third-Party Disclosures</h2>
      <p class="leading-relaxed">ToolVerse is supported by display advertising (and may include Google AdSense when approved). Advertising partners may use cookies to measure performance and, where permitted, personalize ads. We aim for content-first layouts: tools remain usable without ads covering controls.</p>
      <ul class="list-disc pl-5 space-y-1 my-2">
        <li>Third-party vendors, including Google (when AdSense is live), may use cookies to serve ads based on prior visits.</li>
        <li>Users may opt out of personalized advertising via <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" class="text-brand-600 underline">Google Ads Settings</a> or <a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer" class="text-brand-600 underline">AboutAds.info</a>.</li>
        <li>See also our <a href="/legal/cookie-policy" class="text-brand-600 underline">Cookie Policy</a>.</li>
      </ul>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">5. GDPR & CCPA User Privacy Rights</h2>
      <p class="leading-relaxed">If you reside in the European Economic Area (EEA), United Kingdom, or California, you have the right to request access to, deletion of, or restriction of your personal data. Because ToolVerse does not maintain user accounts or store client files on cloud databases for core tools, we store no personal file data to delete or disclose. For technical CDN logs, you may exercise your rights by contacting support@toolverse.baby.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">6. Children's Online Privacy (COPPA Compliance)</h2>
      <p class="leading-relaxed">ToolVerse does not knowingly collect or solicit personal identifiable information from children under the age of 13. If you believe a minor has provided personal data on our platform, please contact us immediately so we can purge the records.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">7. Contact & Privacy Inquiries</h2>
      <p class="leading-relaxed">For questions regarding this Privacy Policy or data inquiries, please email our privacy team at <a href="mailto:support@toolverse.baby" class="text-brand-600 font-semibold underline">support@toolverse.baby</a>.</p>
    `,
  },
  'terms-of-use': {
    title: 'Terms of Use',
    content: `
      <p class="text-xs text-slate-500 font-medium mb-4">Last Updated: October 20, 2026</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">1. Acceptance of Terms</h2>
      <p class="leading-relaxed">By accessing, browsing, or using ToolVerse (https://toolverse.baby), you agree to be bound by these Terms of Use and all applicable laws and regulations.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">2. Permitted Use</h2>
      <p class="leading-relaxed">ToolVerse provides free web utility tools for personal, educational, professional, and commercial workflows. You agree not to misuse the platform for automated web scraping, spam link generation, distributing malicious payloads, or launching denial-of-service (DDoS) attacks against our infrastructure.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">3. Disclaimer of Warranties</h2>
      <p class="leading-relaxed">All tools, converters, and calculators are provided on an "as is" and "as available" basis without warranties of any kind. Financial calculators, tax estimators (such as Pakistan Salary Tax and Zakat), and unit conversions are provided for educational and estimation purposes only.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">4. Aggregated headlines & job listings</h2>
      <p class="leading-relaxed">News headlines and some job listings are aggregated from third-party public feeds or sources and link out to original publishers/employers. ToolVerse is not the author of those articles and is not the hiring employer unless explicitly stated.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">5. Limitation of Liability</h2>
      <p class="leading-relaxed">In no event shall ToolVerse or its operators be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our tools or information.</p>
    `,
  },
  'disclaimer': {
    title: 'Disclaimer',
    content: `
      <p class="text-xs text-slate-500 font-medium mb-4">Last Updated: October 20, 2026</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Educational & Estimation Purpose Only</h2>
      <p class="leading-relaxed">All calculators, tax estimators (such as Pakistan Salary Tax FY 2024-25 & 2025-26, Zakat Calculator, US/UK paycheck estimators, and Loan EMI Estimators) on ToolVerse generate estimations based on standardized mathematical formulas and published tax slabs. They do not constitute formal financial, tax, legal, or professional accounting advice.</p>
      
      <p class="leading-relaxed mt-4">Users are advised to confirm official tax obligations and financial decisions with certified tax consultants, legal professionals, or official government portals (such as the Federal Board of Revenue FBR in Pakistan, HMRC in the UK, or the IRS in the United States).</p>
    `,
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    content: `
      <p class="text-xs text-slate-500 font-medium mb-4">Last Updated: October 20, 2026</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">1. Essential Local Storage Usage</h2>
      <p class="leading-relaxed">ToolVerse uses essential web browser LocalStorage to maintain basic site features such as remembering your dark mode theme preference, recent tool list, and short link history. LocalStorage data remains on your physical device.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">2. Third-Party Advertising Cookies</h2>
      <p class="leading-relaxed">Google AdSense (when live) and other advertising partners may set cookies on your browser to measure ad performance and display personalized ads. You can manage or block advertising cookies via your browser security settings or through <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" class="text-brand-600 underline">AboutAds Choices</a>.</p>
    `,
  },
  'dmca': {
    title: 'DMCA / Copyright Policy',
    content: `
      <p class="text-xs text-slate-500 font-medium mb-4">Last Updated: October 20, 2026</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Intellectual Property Respect</h2>
      <p class="leading-relaxed">ToolVerse respects the intellectual property rights of creators. Because our tools process images, PDFs, and text locally inside user browser memory, ToolVerse does not host, index, or store user-uploaded media files on public servers for those tools.</p>
      
      <p class="leading-relaxed mt-4">If you believe any static content or link on ToolVerse infringes upon your copyrighted material, please send a formal DMCA Takedown Notice to our abuse team at <a href="mailto:support@toolverse.baby" class="text-brand-600 font-semibold underline">support@toolverse.baby</a> with proof of copyright ownership.</p>
    `,
  },
  'about': {
    title: 'About ToolVerse',
    content: `
      <p class="text-xs text-slate-500 font-medium mb-4">Last updated: October 20, 2026</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Who runs this site</h2>
      <p class="leading-relaxed"><strong>ToolVerse</strong> (https://toolverse.baby) is an independently operated suite of free online utilities. It is not a faceless scrapyard of cloned pages: the operator builds and maintains working tools (PDF merge/compress, target-KB image compression, regional calculators, SEO helpers) and writes or edits the accompanying explanations so visitors know what happens to their files and what the math is for.</p>
      <p class="leading-relaxed mt-3">We started ToolVerse because everyday converters and estimators were either (1) upload-first cloud products that treat documents as inventory, or (2) thin directory sites with broken buttons and identical AI blurbs. Our bet is simpler: ship tools that run, label limits honestly, and keep file processing in the browser whenever we can.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">What we offer</h2>
      <p class="leading-relaxed">88+ free utilities across PDFs, images, writing helpers, developer/SEO utilities, and regional finance estimates — plus curated hubs for study abroad, immigration checklists, cars cost planning, and a job finder that links out to employers. Most file tools process data in your browser with Canvas, WebAssembly, and Web Crypto.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">What we are not</h2>
      <ul class="list-disc pl-5 space-y-1 my-2">
        <li>We do not sell fake product reviews or “best of” rankings paid by vendors without disclosure.</li>
        <li>News headlines are an <strong>RSS aggregator</strong> linking to publishers — not ToolVerse journalism.</li>
        <li>Job listings help you discover openings; ToolVerse is <strong>not the employer</strong>.</li>
        <li>Tax and paycheck tools are <strong>estimators</strong>, not filing advice.</li>
      </ul>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Update cadence</h2>
      <p class="leading-relaxed">Core utilities and policy pages are updated as we ship fixes — typically weekly for tools and bugs, and promptly when a calculator’s published rates change. Editorial guides on the <a href="/blog" class="text-brand-600 font-semibold underline">Blog</a> are expanded when we have something concrete to add (worked examples, portal requirements, privacy notes), not to pad word count.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">How we make money</h2>
      <p class="leading-relaxed">The free tier is ad-supported with display units. Tools stay usable without overlays blocking controls. We may use Google AdSense and other networks when approved. See <a href="/legal/privacy-policy" class="text-brand-600 font-semibold underline">Privacy Policy</a> and <a href="/legal/about-our-tools" class="text-brand-600 font-semibold underline">About our tools</a>.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Contact &amp; accountability</h2>
      <p class="leading-relaxed">Questions, corrections, or feature requests: <a href="mailto:support@toolverse.baby" class="text-brand-600 font-semibold underline">support@toolverse.baby</a> — also listed on our <a href="/legal/contact" class="text-brand-600 font-semibold underline">Contact</a> page. Security reports: see <a href="/legal/security" class="text-brand-600 font-semibold underline">Security &amp; Responsible Disclosure</a>. Editorial standards: <a href="/legal/editorial-policy" class="text-brand-600 font-semibold underline">Editorial &amp; Quality Policy</a>.</p>
    `,
  },
  'about-our-tools': {
    title: 'About Our Tools',
    content: `
      <p class="text-xs text-slate-500 font-medium mb-4">Last updated: October 20, 2026</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Why this page exists</h2>
      <p class="leading-relaxed">Reviewers and visitors deserve a plain explanation of what ToolVerse tools do — and what they do not do. This is not a marketing brochure. It is how we operate.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Local processing (file tools)</h2>
      <p class="leading-relaxed">PDF merge/split/compress, many image converters, QR generators, and similar utilities read your file in the browser tab, transform it with Canvas / WASM / Web Crypto, and let you download the result. For those tools we do not keep a server-side copy of your document. If a specific tool needs a network call (for example fetching a public URL for an SEO audit), the page says so.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">No fake reviews</h2>
      <p class="leading-relaxed">We do not publish paid “5-star” software reviews for undisclosed sponsors. Product and alternatives pages describe features we can verify or that are publicly documented. Where we are unsure, we say so.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Calculators = estimates</h2>
      <p class="leading-relaxed">Paycheck, tax, tip, loan, and similar calculators use published formulas or simplified brackets for planning. They are not a substitute for an accountant, tax authority portal, or lender quote. See the <a href="/legal/disclaimer" class="text-brand-600 underline">Disclaimer</a>.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Aggregators vs original content</h2>
      <p class="leading-relaxed"><a href="/news" class="text-brand-600 underline">News</a> shows RSS headlines that link out. <a href="/tools/global-job-finder" class="text-brand-600 underline">Job Finder</a> helps you discover listings and apply on employer sites. Our original writing lives primarily on tool pages and the <a href="/blog" class="text-brand-600 underline">Blog</a>.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Ads vs tool UI</h2>
      <p class="leading-relaxed">Advertising supports the free tier. We keep interactive controls outside ad regions so merge/compress/calculate actions are never covered by overlays. During AdSense review we keep display density deliberately light.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Feedback</h2>
      <p class="leading-relaxed">Found a broken tool or wrong rate table? Email <a href="mailto:support@toolverse.baby" class="text-brand-600 font-semibold underline">support@toolverse.baby</a>. We prefer a concrete repro (URL + what you expected) over vague complaints.</p>
    `,
  },
  'contact': {
    title: 'Contact Support',
    content: `
      <p class="text-xs text-slate-500 font-medium mb-4">Last updated: October 20, 2026</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Get in Touch</h2>
      <p class="leading-relaxed">Have questions, feedback, tool feature requests, a correction for a guide, or a privacy question? Email is the primary channel — we do not require an account to contact us. A real human reads inbound mail; please include the page URL and what went wrong so we can fix it faster.</p>
      
      <div class="p-6 bg-slate-100 dark:bg-slate-800 rounded-xl my-6 space-y-3">
        <div><strong class="text-slate-900 dark:text-white">Official Support Email:</strong> <a href="mailto:support@toolverse.baby" class="text-brand-600 font-semibold underline">support@toolverse.baby</a></div>
        <div><strong class="text-slate-900 dark:text-white">Privacy / data inquiries:</strong> same address (see <a href="/legal/privacy-policy" class="text-brand-600 underline">Privacy Policy</a>)</div>
        <div><strong class="text-slate-900 dark:text-white">Security reports:</strong> see <a href="/legal/security" class="text-brand-600 underline">Responsible Disclosure</a> — prefer security@toolverse.baby when available</div>
        <div><strong class="text-slate-900 dark:text-white">Response Time:</strong> Within 24–48 business hours for ordinary support</div>
        <div><strong class="text-slate-900 dark:text-white">Primary Domain:</strong> <a href="https://toolverse.baby/" class="text-brand-600 underline">https://toolverse.baby</a></div>
      </div>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">What to include</h2>
      <ul class="list-disc pl-5 space-y-1 my-2">
        <li>Exact URL (for example /tools/pdf-merge)</li>
        <li>Browser and device (Chrome on Windows, Safari on iPhone, etc.)</li>
        <li>What you expected vs what happened</li>
      </ul>

      <p class="leading-relaxed mt-4">Learn who we are on <a href="/legal/about" class="text-brand-600 font-semibold underline">About ToolVerse</a>. How tools work: <a href="/legal/about-our-tools" class="text-brand-600 font-semibold underline">About our tools</a>. Guides: <a href="/blog" class="text-brand-600 font-semibold underline">Blog</a>.</p>
    `,
  },
  'editorial-policy': {
    title: 'Editorial & Quality Policy',
    content: `
      <p class="text-xs text-slate-500 font-medium mb-4">Last updated: October 20, 2026</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Purpose</h2>
      <p class="leading-relaxed">ToolVerse publishes working utilities and supporting explanations. We aim for accuracy, clear limits, and honest labels — not keyword stuffing or undifferentiated AI filler.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">What “good” looks like on a tool page</h2>
      <ul class="list-disc pl-5 space-y-1 my-2">
        <li>A short answer-first description of inputs, outputs, and where processing runs</li>
        <li>At least one practical workflow or worked example when relevant</li>
        <li>Explicit privacy or “estimate only” language for sensitive or financial tools</li>
        <li>FAQs that answer real failure modes (password PDFs, portal size caps, etc.)</li>
      </ul>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Calculators &amp; official sources</h2>
      <p class="leading-relaxed">Tax and salary estimators are checked against published government slabs or simplified public brackets where we state that simplification. When rates change, we update the tool and note the vintage where practical. We prohibit deceptive claims, “Turnitin evasion” framing, or fake guarantees.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">AI assistance</h2>
      <p class="leading-relaxed">Drafting tools may be used for speed, but copy that ships should be edited for factual checks, operator voice, and page-specific detail. We do not mass-publish near-duplicate how-to shells without a unique contribution.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Aggregated vs original</h2>
      <p class="leading-relaxed">News and some job surfaces are labeled as aggregators linking out. Blog posts and tool guides are our original explanatory content. We do not present RSS titles as ToolVerse reporting.</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Corrections</h2>
      <p class="leading-relaxed">Email <a href="mailto:support@toolverse.baby" class="text-brand-600 font-semibold underline">support@toolverse.baby</a> with the URL and the correct source. Material errors get fixed; we prefer being accurate over defending a wrong number.</p>
    `,
  },
  'security': {
    title: 'Security & Responsible Disclosure',
    content: `
      <p class="text-xs text-slate-500 font-medium mb-4">Last updated: October 20, 2026</p>

      <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Security Architecture</h2>
      <p class="leading-relaxed">We enforce HTTP security headers, Cloudflare protection, and a preference for client-side processing so sensitive files need not hit our origin for core converters. If you discover a potential vulnerability, please report it responsibly to <a href="mailto:security@toolverse.baby" class="text-brand-600 font-semibold underline">security@toolverse.baby</a> or support@toolverse.baby with enough detail to reproduce (no public zero-day dumps).</p>
    `,
  },
};

/** Friendly aliases so /legal/privacy and /legal/terms resolve. */
const SLUG_ALIASES: Record<string, string> = {
  privacy: 'privacy-policy',
  terms: 'terms-of-use',
  about: 'about',
  contact: 'contact',
};

function resolveSlug(slug: string): string {
  return SLUG_ALIASES[slug] || slug;
}

export async function generateStaticParams() {
  return Object.keys(LEGAL_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = LEGAL_PAGES[resolveSlug(params.slug)];
  if (!page) return { title: 'Page Not Found — ToolVerse' };

  return {
    title: `${page.title} — ToolVerse`,
    description: `${page.title} for ToolVerse (toolverse.baby) — privacy-first free online tools.`,
  };
}

export default function LegalPage({ params }: { params: { slug: string } }) {
  const page = LEGAL_PAGES[resolveSlug(params.slug)];
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
