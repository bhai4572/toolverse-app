/** Pillar copy for category pages — topical intros + internal links. Keep concise. */

export interface CategoryPageContent {
  /** Answer-first intro under the H1 (1–2 sentences). */
  intro: string;
  /** Extra H2 sections for topical authority. */
  sections?: { heading: string; body: string }[];
  /** Blog post slugs to surface (must exist in BLOG_POSTS). */
  relatedBlogSlugs?: string[];
  /** Sibling category hubs for topical clusters. */
  relatedCategorySlugs?: string[];
  /** Highlighted tools in this pillar (must be live slugs). */
  featuredToolSlugs?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export const CATEGORY_PAGE_CONTENT: Record<string, CategoryPageContent> = {
  'pdf-document-tools': {
    seoTitle: 'Free PDF Tools Online — Merge, Split, Convert | ToolVerse',
    seoDescription:
      'Browser-based PDF utilities: merge, split, rotate, reorder, and convert images to PDF. Files stay on your device for core tools.',
    intro:
      'PDF & Document Tools help you merge, split, rotate, reorder, and convert files in your browser — built for job packs, invoices, and scans you would rather not upload to a random converter.',
    sections: [
      {
        heading: 'Private PDF workflows',
        body: 'Start with Merge PDF for application packs, Split PDF to extract a single page, and JPG/Images to PDF when your phone camera is the scanner. Pair with image tools when scans need compression first.',
      },
    ],
    featuredToolSlugs: ['pdf-merge', 'pdf-split', 'jpg-to-pdf', 'pdf-rotate'],
    relatedCategorySlugs: ['image-design-tools', 'business-finance-tools', 'career-jobs-employment-engine'],
    relatedBlogSlugs: [
      'how-to-merge-pdf-files-privately-without-uploading',
      'best-free-privacy-first-online-tools-2026',
    ],
  },
  'image-design-tools': {
    seoTitle: 'Free Image Tools — Compress, Resize, Convert | ToolVerse',
    seoDescription:
      'Compress images to exact KB targets, resize, crop, convert HEIC/WebP/JPG/PNG, and make passport-sized photos — privately in your browser.',
    intro:
      'Image & Design Tools cover compression, resizing, cropping, format conversion, and passport photo sizing — including exact KB targets for portals that reject oversized uploads.',
    sections: [
      {
        heading: 'Portal photos and web performance',
        body: 'Use Compress Image to Target Size for 20KB/50KB form limits, Image Compressor for general web optimization, and HEIC to JPG when iPhone photos will not open on Windows.',
      },
    ],
    featuredToolSlugs: [
      'compress-image-target-size',
      'image-compressor',
      'heic-to-jpg',
      'passport-photo-maker',
    ],
    relatedCategorySlugs: ['social-image-presets', 'pdf-document-tools', 'country-regional-tools'],
    relatedBlogSlugs: [
      'how-to-compress-image-to-target-size-under-50kb',
      'convert-heic-to-jpg-windows-iphone',
      'best-free-privacy-first-online-tools-2026',
    ],
  },
  'social-image-presets': {
    seoTitle: 'Social Media Image Resizer Presets | ToolVerse',
    seoDescription:
      'Resize images to Instagram, YouTube, TikTok, LinkedIn, and Facebook dimensions with free browser presets.',
    intro:
      'Social Media Image Presets resize creatives to common platform dimensions so posts are not cropped awkwardly after upload.',
    featuredToolSlugs: ['social-media-image-resizer', 'instagram-grid-splitter', 'image-cropper'],
    relatedCategorySlugs: ['image-design-tools', 'creator-social-tools'],
    relatedBlogSlugs: ['best-free-privacy-first-online-tools-2026'],
  },
  'text-writing-student-tools': {
    seoTitle: 'Free Text & Student Tools — Word Counter, Case, Diff | ToolVerse',
    seoDescription:
      'Word counter, character limits, case converter, duplicate-line remover, GPA tools, and text diff — private browser utilities for students and writers.',
    intro:
      'Text, Writing & Student Tools give you live word counts, case conversion, deduped lists, GPA math, and diff checks without pasting essays into unknown sites.',
    featuredToolSlugs: ['word-counter', 'character-counter', 'gpa-calculator', 'text-diff-checker'],
    relatedCategorySlugs: [
      'writing-grammar-academic-integrity-tools',
      'calculators-converters',
    ],
  },
  'calculators-converters': {
    seoTitle: 'Free Calculators — Percentage, EMI, Age & More | ToolVerse',
    seoDescription:
      'Percentage, discount, compound interest, loan EMI, age, VAT/GST, and everyday converters — fast estimates in your browser.',
    intro:
      'Calculators & Converters cover everyday math: percentages, discounts, EMI, compound interest, age, and tax-style estimates for quick planning.',
    featuredToolSlugs: [
      'percentage-calculator',
      'emi-calculator',
      'compound-interest-calculator',
      'unit-converter-suite',
    ],
    relatedCategorySlugs: ['business-finance-tools', 'country-regional-tools'],
  },
  'business-finance-tools': {
    seoTitle: 'Business & Freelance Tools — Invoice, Margin, Revenue | ToolVerse',
    seoDescription:
      'PDF invoice generator, profit margin, AdSense revenue estimates, and freelance-friendly finance utilities.',
    intro:
      'Business, Finance & Freelance tools help you invoice clients, estimate margins, and model simple revenue scenarios without a heavyweight accounting suite.',
    featuredToolSlugs: [
      'invoice-generator',
      'quotation-generator',
      'profit-margin-calculator',
      'break-even-calculator',
    ],
    relatedCategorySlugs: ['pdf-document-tools', 'calculators-converters', 'creator-social-tools'],
  },
  'creator-social-tools': {
    seoTitle: 'Creator Tools — YouTube Earnings & Social Helpers | ToolVerse',
    seoDescription:
      'Creator-focused utilities including YouTube earnings estimates and social helpers for day-to-day publishing work.',
    intro:
      'Creator & Social Media Tools support quick estimates and formatting helpers for publishing workflows — treat earnings tools as directional, not payout guarantees.',
    featuredToolSlugs: [
      'youtube-earnings-estimator',
      'youtube-tag-formatter',
      'youtube-chapters-generator',
    ],
    relatedCategorySlugs: ['social-image-presets', 'seo-url-tools', 'business-finance-tools'],
  },
  'seo-url-tools': {
    seoTitle: 'SEO & Marketing Tools — UTM, Meta Tags, Short Links | ToolVerse',
    seoDescription:
      'Build UTM campaign URLs, generate meta/Open Graph tags, and shorten links with ToolVerse SEO utilities.',
    intro:
      'SEO, Marketing & URL Tools help you build UTM links, draft meta tags with a SERP-style preview, and create short links for campaigns.',
    featuredToolSlugs: ['meta-tag-generator', 'utm-builder', 'url-shortener', 'qr-code-generator'],
    relatedCategorySlugs: ['developer-cybersecurity-tools', 'creator-social-tools'],
  },
  'developer-cybersecurity-tools': {
    seoTitle: 'Developer Tools — JSON, QR, Barcode, Passwords | ToolVerse',
    seoDescription:
      'JSON formatter, QR and barcode generators, password and UUID tools — client-side utilities for developers and operators.',
    intro:
      'Developer & Cybersecurity utilities format JSON, generate QR/barcodes, and create passwords or UUIDs with browser crypto where applicable.',
    featuredToolSlugs: [
      'json-formatter',
      'qr-code-generator',
      'barcode-generator',
      'password-generator',
      'jwt-decoder',
    ],
    relatedCategorySlugs: ['seo-url-tools', 'file-archive-utilities'],
    relatedBlogSlugs: [
      'how-to-generate-barcodes-free-code-128-ean-upc',
      'best-free-privacy-first-online-tools-2026',
    ],
  },
  'file-archive-utilities': {
    seoTitle: 'File & Archive Utilities | ToolVerse',
    seoDescription:
      'ZIP, CSV, checksum, and file utility helpers that run in your browser for everyday ops tasks.',
    intro:
      'File & Archive Utilities cover packaging, CSV cleanup, and checksum-style checks for everyday file ops.',
    relatedCategorySlugs: ['developer-cybersecurity-tools', 'pdf-document-tools'],
  },
  'country-regional-tools': {
    seoTitle: 'Pakistan & Regional Tools — Tax, Zakat, GST | ToolVerse',
    seoDescription:
      'Pakistan salary tax estimates, Zakat calculator, VAT/GST helpers, and regional utilities for planning (not official filing).',
    intro:
      'Pakistan, India & Regional Tools include salary tax estimates, Zakat math, and VAT/GST helpers. Figures are educational estimates — confirm filings with official sources or advisors.',
    featuredToolSlugs: [
      'pakistan-salary-tax-estimator',
      'zakat-calculator',
      'pakistan-electricity-bill-estimator',
      'solar-panel-calculator',
    ],
    relatedCategorySlugs: ['calculators-converters', 'image-design-tools', 'career-jobs-employment-engine'],
    relatedBlogSlugs: ['pakistan-salary-tax-calculator-slabs-guide'],
  },
  'writing-grammar-academic-integrity-tools': {
    seoTitle: 'Writing & Academic Integrity Tools | ToolVerse',
    seoDescription:
      'Readability scores, repeated-word checks, citation helpers, and ethical writing utilities for clearer drafts.',
    intro:
      'Writing, Grammar & Academic Integrity tools highlight readability, repetition, and structure so you can revise intentionally — they are helpers, not a substitute for your own judgment or institutional rules.',
    featuredToolSlugs: [
      'readability-score',
      'citation-generator',
      'academic-tone-checker',
      'originality-checklist',
    ],
    relatedCategorySlugs: ['text-writing-student-tools'],
  },
  'career-jobs-employment-engine': {
    seoTitle: 'Job Search Tools — Remote & Multi-Country Finder | ToolVerse',
    seoDescription:
      'Browse multi-source job listings including remote and regional roles. Always apply on the original employer or board site.',
    intro:
      'Career & Jobs tools help you discover listings across sources. Always verify employers and apply on the original posting site.',
    featuredToolSlugs: [
      'global-job-finder',
      'ats-resume-checker',
      'cover-letter-generator',
      'pdf-merge',
    ],
    relatedCategorySlugs: ['pdf-document-tools', 'image-design-tools', 'country-regional-tools'],
    relatedBlogSlugs: ['top-high-paying-remote-jobs-worldwide'],
  },
};

export function getCategoryPageContent(slug: string): CategoryPageContent | undefined {
  return CATEGORY_PAGE_CONTENT[slug];
}
