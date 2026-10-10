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
      'Browser-based PDF & document utilities: merge, split, Excel/Word/CSV convert, and images to PDF. Files stay on your device for core tools.',
    intro:
      'PDF & Document Tools help you merge, split, rotate, reorder, and convert Excel, Word, CSV, and images in your browser — built for job packs, invoices, and scans you would rather not upload to a random converter.',
    sections: [
      {
        heading: 'Private PDF workflows',
        body: 'Start with Merge PDF for application packs, Split PDF to extract a single page, and JPG/Images to PDF when your phone camera is the scanner. Pair with image tools when scans need compression first.',
      },
      {
        heading: 'Microsoft-style document conversions',
        body: 'Convert Excel to PDF or CSV, CSV back to Excel, CSV to PDF tables, and Word (.docx) to a simple text PDF — all client-side with clear size and fidelity limits.',
      },
    ],
    featuredToolSlugs: ['pdf-merge', 'excel-to-pdf', 'word-to-pdf', 'excel-to-csv', 'csv-to-excel', 'jpg-to-pdf'],
    relatedCategorySlugs: ['image-design-tools', 'business-finance-tools', 'career-jobs-employment-engine'],
    relatedBlogSlugs: [
      'how-to-merge-pdf-files-privately-without-uploading',
      'privacy-first-converters-vs-upload-sites',
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
      {
        heading: 'ID and passport-style crops',
        body: 'Passport Photo Maker helps you size a headshot for common form dimensions. Always keep the original file; re-encoding can change metadata and file size.',
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
      'privacy-first-converters-vs-upload-sites',
      'best-free-privacy-first-online-tools-2026',
    ],
  },
  'social-image-presets': {
    seoTitle: 'Social Media Image Resizer Presets | ToolVerse',
    seoDescription:
      'Resize images to Instagram, YouTube, TikTok, LinkedIn, and Facebook dimensions with free browser presets.',
    intro:
      'Social Media Image Presets resize creatives to common platform dimensions so posts are not cropped awkwardly after upload.',
    sections: [
      {
        heading: 'Match platform aspect ratios first',
        body: 'Start with Social Media Image Resizer for feed, story, and thumbnail sizes. Crop tightly with Image Cropper when the subject must stay centered after platform auto-crop.',
      },
      {
        heading: 'Creators and campaign assets',
        body: 'After resizing, pair with YouTube tag/chapter helpers or UTM Builder when the creative points to a landing page you need to measure.',
      },
    ],
    featuredToolSlugs: ['social-media-image-resizer', 'instagram-grid-splitter', 'image-cropper'],
    relatedCategorySlugs: ['image-design-tools', 'creator-social-tools'],
    relatedBlogSlugs: [
      'how-to-build-utm-campaign-urls',
      'best-free-privacy-first-online-tools-2026',
    ],
  },
  'text-writing-student-tools': {
    seoTitle: 'Free Text & Student Tools — Word Counter, Case, Diff | ToolVerse',
    seoDescription:
      'Word counter, character limits, case converter, duplicate-line remover, GPA tools, and text diff — private browser utilities for students and writers.',
    intro:
      'Text, Writing & Student Tools give you live word counts, case conversion, deduped lists, GPA math, and diff checks without pasting essays into unknown sites.',
    sections: [
      {
        heading: 'Portal limits and drafts',
        body: 'Word Counter and Character Counter help you hit application, abstract, and social caption limits before submit. Keep drafts local when the text is unpublished coursework.',
      },
      {
        heading: 'Revision helpers',
        body: 'Text Diff Checker compares two versions side by side. Case converters and list cleaners speed up bibliography and spreadsheet paste jobs. For deeper writing checks, open the Academic Integrity category.',
      },
    ],
    featuredToolSlugs: ['word-counter', 'character-counter', 'gpa-calculator', 'text-diff-checker'],
    relatedCategorySlugs: [
      'writing-grammar-academic-integrity-tools',
      'calculators-converters',
    ],
    relatedBlogSlugs: ['best-free-privacy-first-online-tools-2026'],
  },
  'calculators-converters': {
    seoTitle: 'Free Calculators — Percentage, EMI, Age & More | ToolVerse',
    seoDescription:
      'Percentage, discount, compound interest, loan EMI, age, VAT/GST, and everyday converters — fast estimates in your browser.',
    intro:
      'Calculators & Converters cover everyday math: percentages, discounts, EMI, compound interest, age, and tax-style estimates for quick planning.',
    sections: [
      {
        heading: 'Money math without a spreadsheet',
        body: 'Percentage and discount tools handle sale pricing. EMI and compound interest calculators are for planning — confirm bank figures before signing.',
      },
      {
        heading: 'Regional tax and invoices',
        body: 'For Pakistan salary tax or Zakat estimates, use Country & Regional tools. Freelancers who need PDF invoices can jump to Business & Finance tools next.',
      },
    ],
    featuredToolSlugs: [
      'percentage-calculator',
      'emi-calculator',
      'fuel-trip-cost-calculator',
      'compound-interest-calculator',
      'unit-converter-suite',
    ],
    relatedCategorySlugs: ['business-finance-tools', 'country-regional-tools'],
    relatedBlogSlugs: ['pakistan-salary-tax-calculator-slabs-guide', 'first-car-budget-usa'],
  },
  'business-finance-tools': {
    seoTitle: 'Business & Freelance Tools — Invoice, Margin, Revenue | ToolVerse',
    seoDescription:
      'PDF invoice generator, profit margin, car loan estimator, AdSense revenue estimates, and freelance-friendly finance utilities.',
    intro:
      'Invoice clients, estimate margins, sketch a car payment, or model simple revenue — without dragging a full accounting suite into the browser.',
    sections: [
      {
        heading: 'Invoices and quotations',
        body: 'Generate a clean PDF invoice or quotation for clients, then merge supporting docs with PDF tools when you need one attachment.',
      },
      {
        heading: 'Margins, loans, and break-even',
        body: 'Profit margin, break-even, and the car loan calculator are planning helpers — not lender offers or bookkeeping software. Deeper ownership bands live on the Cars hub.',
      },
    ],
    featuredToolSlugs: [
      'car-loan-calculator',
      'freelancer-hourly-rate-calculator',
      'paypal-stripe-fee-calculator',
      'invoice-generator',
      'crypto-profit-calculator',
      'profit-margin-calculator',
      'break-even-calculator',
    ],
    relatedCategorySlugs: ['pdf-document-tools', 'calculators-converters', 'creator-social-tools'],
    relatedBlogSlugs: [
      'freelance-rate-calculator-guide-paypal-stripe-fees',
      'how-to-merge-pdf-files-privately-without-uploading',
      'used-car-inspection-checklist',
      'first-car-budget-usa',
    ],
  },
  'creator-social-tools': {
    seoTitle: 'Creator Tools — YouTube Thumbnails, Hashtags & Social Helpers | ToolVerse',
    seoDescription:
      'Creator-focused utilities: 1080p YouTube thumbnail downloader, viral Instagram hashtags, Twitter thread splitter, and earnings calculators.',
    intro:
      'Creator & Social Media Tools support quick content creation, thumbnail extraction, viral hashtag generation, and thread formatting — 100% free with no account required.',
    sections: [
      {
        heading: 'Thumbnails, Hashtags & Repurposing',
        body: 'Grab public YouTube thumbnail images (not video) with YouTube Thumbnail Downloader, generate niche tags with Instagram Hashtag Generator, split long articles for Twitter/X, and clean SRT transcripts.',
      },
      {
        heading: 'Creative + SEO companion tools',
        body: 'Resize thumbnails and posts with Social Image Presets, then build campaign URLs with UTM Builder or preview metadata with Meta Tag Generator before you publish.',
      },
    ],
    featuredToolSlugs: [
      'youtube-thumbnail-downloader',
      'instagram-hashtag-generator',
      'twitter-thread-splitter',
      'srt-subtitle-cleaner',
      'youtube-earnings-estimator',
      'youtube-tag-formatter',
    ],
    relatedCategorySlugs: ['social-image-presets', 'seo-url-tools', 'business-finance-tools'],
    relatedBlogSlugs: [
      'how-to-youtube-thumbnail-downloader',
      'how-to-build-utm-campaign-urls',
    ],
  },
  'seo-url-tools': {
    seoTitle: 'Free SEO & Marketing Tools — Semrush & Ahrefs Alternative Suite | ToolVerse',
    seoDescription:
      'Free SEO tools: site audit, keyword research & intent explorer, backlink analyzer, SERP preview, robots.txt & schema generators. 100% free, no signup.',
    intro:
      'Explore ToolVerse’s full suite of professional SEO utilities — built as a fast, 100% free browser alternative to expensive Semrush and Ahrefs subscriptions. Audit on-page health, explore high-volume keywords, simulate Google search snippets, and generate technical SEO files instantly.',
    sections: [
      {
        heading: 'Complete On-Page & Technical SEO Auditing',
        body: 'Audit meta titles, descriptions, headings, image alt attributes, and canonical tags with an instant 0–100 health score. Identify critical indexing blockers and fix on-page SEO issues before search engine crawlers penalize your rankings.',
      },
      {
        heading: 'Keyword Magic, Search Intent & Link Profiling',
        body: 'Research long-tail keyword variations, question topics, search intent (Informational, Commercial, Transactional), and difficulty benchmarks. Analyze backlink profiles, domain authority tiers, and anchor text ratios without recurring subscription fees.',
      },
      {
        heading: 'SERP Previews, Technical Schemas & Robots Directives',
        body: 'Preview Google search snippets with real-time pixel meters, generate valid JSON-LD Rich Snippets (FAQ, Article, Product), configure robots.txt with AEO crawler permissions, and build clean XML sitemaps for Google Search Console.',
      },
    ],
    featuredToolSlugs: [
      'seo-audit-analyzer',
      'keyword-research-tool',
      'backlink-checker-analyzer',
      'serp-simulator',
      'schema-markup-generator',
      'meta-tag-generator',
      'keyword-density-checker',
      'utm-builder',
      'url-shortener',
    ],
    relatedCategorySlugs: ['developer-cybersecurity-tools', 'creator-social-tools', 'text-writing-student-tools'],
    relatedBlogSlugs: [
      'best-free-semrush-ahrefs-alternatives-2026',
      'how-to-build-utm-campaign-urls',
      'how-to-keyword-research-tool',
      'how-to-backlink-checker-analyzer',
    ],
  },
  'developer-cybersecurity-tools': {
    seoTitle: 'Developer Tools — JSON, QR, Barcode, Passwords | ToolVerse',
    seoDescription:
      'JSON formatter, QR and barcode generators, password and UUID tools — client-side utilities for developers and operators.',
    intro:
      'Developer & Cybersecurity utilities format JSON, generate QR/barcodes, and create passwords or UUIDs with browser crypto where applicable.',
    sections: [
      {
        heading: 'Everyday API and payload helpers',
        body: 'JSON Formatter and JWT Decoder help you inspect payloads locally. Prefer them over pasting production secrets into unknown pastebins.',
      },
      {
        heading: 'Codes, passwords, and ops checks',
        body: 'QR and barcode generators cover print and packaging labels. Password Generator and Hash Generator support local credential and checksum workflows — not a substitute for a password manager vault.',
      },
    ],
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
      'privacy-first-converters-vs-upload-sites',
    ],
  },
  'file-archive-utilities': {
    seoTitle: 'File & Archive Utilities — ZIP, CSV, Checksums | ToolVerse',
    seoDescription:
      'Browser-side helpers for everyday file ops: CSV conversion, hashes/checksums, and Base64 — plus links to private PDF packaging workflows.',
    intro:
      'File & Archive Utilities cover everyday packaging and verification jobs. ToolVerse currently surfaces adjacent client-side helpers (CSV, hash, Base64) here alongside PDF workflows when you need a private document pack before sharing.',
    sections: [
      {
        heading: 'Verify before you share',
        body: 'Use Hash Generator to fingerprint a download after transfer, and Base64 Encoder/Decoder when APIs expect encoded payloads. Prefer local checks over pasting secrets into unknown paste sites.',
      },
      {
        heading: 'Documents still belong in PDF tools',
        body: 'For application packs and scans, finish merges and splits in PDF Tools first. Pair with image compression when portals enforce KB limits, then archive on your own device.',
      },
    ],
    featuredToolSlugs: ['hash-generator', 'json-to-csv', 'base64-encoder-decoder'],
    relatedCategorySlugs: ['developer-cybersecurity-tools', 'pdf-document-tools'],
    relatedBlogSlugs: ['privacy-first-converters-vs-upload-sites'],
  },
  'country-regional-tools': {
    seoTitle: 'Pakistan & Regional Tools — Tax, Zakat, GST | ToolVerse',
    seoDescription:
      'Pakistan salary tax estimates, Zakat calculator, VAT/GST helpers, and regional utilities for planning (not official filing).',
    intro:
      'Pakistan, India & Regional Tools include salary tax estimates, Zakat math, and VAT/GST helpers. Figures are educational estimates — confirm filings with official sources or advisors.',
    sections: [
      {
        heading: 'Salary tax and Zakat estimates',
        body: 'Pakistan Salary Tax Estimator models published FBR-style slabs for planning. Zakat Calculator helps with wealth math — neither replaces a tax advisor or official e-filing portal.',
      },
      {
        heading: 'Bills, solar, and job-form photos',
        body: 'Electricity and solar helpers are directional. For PPSC/FPSC photo and document size limits, use Image and PDF tools before portal week.',
      },
    ],
    featuredToolSlugs: [
      'pakistan-salary-tax-estimator',
      'zakat-calculator',
      'pakistan-electricity-bill-estimator',
      'solar-panel-calculator',
    ],
    relatedCategorySlugs: ['calculators-converters', 'image-design-tools', 'career-jobs-employment-engine'],
    relatedBlogSlugs: [
      'pakistan-salary-tax-calculator-slabs-guide',
      'how-to-compress-image-to-target-size-under-50kb',
    ],
  },
  'writing-grammar-academic-integrity-tools': {
    seoTitle: 'Writing & Academic Integrity Tools | ToolVerse',
    seoDescription:
      'Readability scores, repeated-word checks, citation helpers, and ethical writing utilities for clearer drafts.',
    intro:
      'Writing, Grammar & Academic Integrity tools highlight readability, repetition, and structure so you can revise intentionally — they are helpers, not a substitute for your own judgment or institutional rules.',
    sections: [
      {
        heading: 'Revise with signals, not shortcuts',
        body: 'Readability and tone checkers surface patterns to edit. They do not “bypass” plagiarism systems and should not be marketed that way — use them to clarify your own writing.',
      },
      {
        heading: 'Citations and student workflows',
        body: 'Citation helpers speed bibliography drafts. Pair with Word Counter and Text Diff in the student tools category when portals enforce length limits.',
      },
    ],
    featuredToolSlugs: [
      'readability-score',
      'citation-generator',
      'academic-tone-checker',
      'originality-checklist',
    ],
    relatedCategorySlugs: ['text-writing-student-tools'],
    relatedBlogSlugs: ['best-free-privacy-first-online-tools-2026'],
  },
  'career-jobs-employment-engine': {
    seoTitle: 'Job Search Tools — Remote & Multi-Country Finder | ToolVerse',
    seoDescription:
      'Browse multi-source job listings including remote and regional roles. Always apply on the original employer or board site.',
    intro:
      'Career & Jobs tools help you discover listings across sources. Always verify employers and apply on the original posting site.',
    sections: [
      {
        heading: 'Discover here, apply on the source',
        body: 'Global Job Finder aggregates leads for browsing. ToolVerse is not the employer — open the original board, verify the company domain, and never pay upfront “recruiting fees.”',
      },
      {
        heading: 'Prep your PDF and photo pack',
        body: 'Merge resume pages with PDF Merge, hit portal KB limits with Compress Image to Target Size, and use Word Counter for summary length caps before you submit.',
      },
    ],
    featuredToolSlugs: [
      'global-job-finder',
      'ats-resume-checker',
      'cover-letter-generator',
      'pdf-merge',
    ],
    relatedCategorySlugs: ['pdf-document-tools', 'image-design-tools', 'country-regional-tools'],
    relatedBlogSlugs: [
      'top-high-paying-remote-jobs-worldwide',
      'how-to-merge-pdf-files-privately-without-uploading',
      'how-to-compress-image-to-target-size-under-50kb',
    ],
  },
};

export function getCategoryPageContent(slug: string): CategoryPageContent | undefined {
  return CATEGORY_PAGE_CONTENT[slug];
}
