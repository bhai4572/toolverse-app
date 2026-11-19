/**
 * Generate sitemaps under public/ (safe for CF prebuild).
 * - sitemap.xml          → single combined urlset (GSC submit target)
 * - sitemap-tools.xml    → /tools/* + /category/* (optional split)
 * - sitemap-content.xml  → blog, how-to, news, study (optional split)
 * - sitemap-pages.xml    → hubs, legal, jobs, product/travel/etc. (optional split)
 *
 * Parses slug fields from registry + blog pillar source; adds per-tool how-to guides.
 * Excludes workspace / admin / dashboard / private URLs.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const base = 'https://toolverse.baby';

/**
 * Mirror of lib/seo/indexability.ts (this script cannot import TS). Keep in sync.
 * Anything noindex there must NOT be in the sitemap.
 */
const NOINDEX_EXACT = new Set(['/404']);
const NOINDEX_PREFIXES = ['/admin', '/admin/'];
/** Thin sections: owner wants them indexed (2026-11-17), so disabled. Mirror of THIN_NOINDEX_* in lib/seo/indexability.ts. */
const THIN_NOINDEX_ENABLED = false;
const THIN_EXACT = new Set(['/products', '/leaderboard', '/submit', '/claim', '/badges', '/study', '/travel', '/jobs', '/tools/global-job-finder', '/tools/b2b-email-finder', '/business', '/business-qr', '/startups', '/submit-startup', '/guest-posts', '/become-a-publisher', '/dashboard']);
const THIN_PREFIXES = ['/products/', '/study/', '/travel/', '/jobs/', '/business/', '/b/', '/startups/', '/guest-posts/', '/publishers/'];
function isNoindex(p) {
  const x = (p.replace(/\/$/, '') || '/').toLowerCase();
  if (NOINDEX_EXACT.has(x)) return true;
  if (THIN_NOINDEX_ENABLED && (THIN_EXACT.has(x) || THIN_PREFIXES.some((pre) => x.startsWith(pre)))) return true;
  return NOINDEX_PREFIXES.some((pre) => x === pre.replace(/\/$/, '') || x.startsWith(pre));
}

/** Tools that already have a hand-written pillar guide (keep in sync with lib/blog/toolGuides.ts). */
const PILLAR_GUIDE_BY_TOOL = {
  'compress-image-target-size': 'how-to-compress-image-to-target-size-under-50kb',
  'pdf-merge': 'how-to-merge-pdf-files-privately-without-uploading',
  'heic-to-jpg': 'convert-heic-to-jpg-windows-iphone',
  'barcode-generator': 'how-to-generate-barcodes-free-code-128-ean-upc',
  'pakistan-salary-tax-estimator': 'pakistan-salary-tax-calculator-slabs-guide',
  'utm-builder': 'how-to-build-utm-campaign-urls',
  'global-job-finder': 'top-high-paying-remote-jobs-worldwide',
  'seo-audit-analyzer': 'best-free-semrush-ahrefs-alternatives-2026',
  'freelancer-hourly-rate-calculator': 'freelance-rate-calculator-guide-paypal-stripe-fees',
};

function makeUrl(pathname, changefreq = 'weekly', priority = '0.8') {
  // No <lastmod>: a build-date on every URL is not a real modification date and gets ignored by Google.
  return { loc: `${base}${pathname}`, changefreq, priority };
}

function section(src, startMarker, endMarker) {
  const start = src.indexOf(startMarker);
  if (start < 0) throw new Error(`Missing ${startMarker}`);
  const end = endMarker ? src.indexOf(endMarker, start + 1) : src.length;
  return src.slice(start, end < 0 ? undefined : end);
}

/** Match object key `slug:` only (not categorySlug). */
function slugs(text) {
  return [...text.matchAll(/(?:^|[^\w])slug:\s*'([^']+)'/gm)].map((m) => m[1]);
}

function liveToolSlugs(toolsSrc) {
  const out = [];
  const blocks = toolsSrc.split(/\n  \{/);
  for (const b of blocks) {
    const slug = (b.match(/slug:\s*'([^']+)'/) || [])[1];
    const status = (b.match(/status:\s*'([^']+)'/) || [])[1];
    if (slug && status === 'live') out.push(slug);
  }
  return out;
}

function writeUrlset(filename, urls) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const u of urls) {
    lines.push('  <url>');
    lines.push(`    <loc>${u.loc}</loc>`);
    lines.push(`    <changefreq>${u.changefreq}</changefreq>`);
    lines.push(`    <priority>${u.priority}</priority>`);
    lines.push('  </url>');
  }
  lines.push('</urlset>');
  fs.writeFileSync(path.join(publicDir, filename), lines.join('\n') + '\n');
}

const registry = fs.readFileSync(path.join(root, 'lib/tools/registry.ts'), 'utf8');
const posts = fs.readFileSync(path.join(root, 'lib/blog/posts.ts'), 'utf8');
const trendPosts = fs.readFileSync(path.join(root, 'lib/blog/usTrendPosts.ts'), 'utf8');

const categories = slugs(section(registry, 'export const CATEGORIES', 'export const TOOLS'));
const tools = liveToolSlugs(section(registry, 'export const TOOLS'));
const pillarBlog = [
  ...slugs(section(posts, 'const PILLAR_POSTS', 'export const BLOG_POSTS')),
  ...slugs(section(trendPosts, 'export const US_TREND_POSTS')),
];
const blog = [...new Set(pillarBlog)];

// —— 1. Tools: /tools/* + /category/* ——
const toolsUrls = [];
toolsUrls.push(makeUrl('/tools', 'daily', '0.9'));
for (const c of categories) toolsUrls.push(makeUrl(`/category/${c}`, 'weekly', '0.8'));
for (const t of tools) toolsUrls.push(makeUrl(`/tools/${t}`, 'weekly', '0.8'));

// —— 2. Content: blog, how-to, news, study ——
const contentUrls = [];
contentUrls.push(makeUrl('/blog', 'daily', '0.8'));
contentUrls.push(makeUrl('/blog/topics', 'weekly', '0.7'));
for (const p of blog) contentUrls.push(makeUrl(`/blog/${p}`, 'weekly', '0.7'));

contentUrls.push(makeUrl('/how-to', 'daily', '0.8'));
for (const t of tools) {
  const pillar = PILLAR_GUIDE_BY_TOOL[t];
  if (pillar) {
    contentUrls.push(makeUrl(`/blog/${pillar}`, 'weekly', '0.75'));
  } else {
    contentUrls.push(makeUrl(`/how-to/${t}`, 'weekly', '0.6'));
  }
}

contentUrls.push(makeUrl('/news', 'daily', '0.8'));
for (const n of [
  'tax-year-2025-salary-slabs-announced',
  'heic-image-support-added-to-toolverse',
  'top-remote-work-tools-productivity-report',
]) {
  contentUrls.push(makeUrl(`/news/${n}`, 'weekly', '0.6'));
}

contentUrls.push(makeUrl('/study', 'daily', '0.8'));
const studySrc = fs.readFileSync(path.join(root, 'lib/study/destinations.ts'), 'utf8');
const studyDestSlugs = slugs(studySrc);
for (const s of studyDestSlugs) {
  contentUrls.push(makeUrl(`/study/${s}`, 'weekly', '0.7'));
}

// —— 3. Pages: hubs, legal, jobs, product/travel/etc. ——
const pagesUrls = [];
pagesUrls.push(makeUrl('/', 'daily', '1.0'));
pagesUrls.push(makeUrl('/cv-maker', 'daily', '0.9'));
pagesUrls.push(makeUrl('/sitemap', 'weekly', '0.5'));

for (const j of [
  'remote-jobs',
  'usa-jobs',
  'software-engineer-jobs',
  'data-entry-jobs',
  'pakistan-govt-jobs',
  'government-jobs',
  'jobs-near-me',
  'nhs-jobs-uk',
]) {
  pagesUrls.push(makeUrl(`/jobs/${j}`, 'weekly', '0.7'));
}

for (const l of [
  'privacy-policy',
  'terms-of-use',
  'disclaimer',
  'cookie-policy',
  'dmca',
  'about',
  'about-our-tools',
  'contact',
  'editorial-policy',
  'security',
]) {
  pagesUrls.push(makeUrl(`/legal/${l}`, 'monthly', '0.5'));
}

pagesUrls.push(makeUrl('/products', 'daily', '0.9'));
pagesUrls.push(makeUrl('/leaderboard', 'daily', '0.92'));

const productDataDir = path.join(root, 'lib/products/data');
let productSlugs = [];
if (fs.existsSync(productDataDir)) {
  const pFiles = fs.readdirSync(productDataDir).filter((f) => f.endsWith('.ts'));
  for (const pFile of pFiles) {
    const pContent = fs.readFileSync(path.join(productDataDir, pFile), 'utf8');
    productSlugs.push(...slugs(pContent));
  }
}
productSlugs = [...new Set(productSlugs)];
if (productSlugs.length === 0) {
  productSlugs = ['canva', 'chatgpt', 'notion', 'figma', 'supabase', 'claude-ai'];
}
for (const p of productSlugs) {
  pagesUrls.push(makeUrl(`/products/${p}`, 'daily', '0.8'));
}

pagesUrls.push(makeUrl('/alternatives', 'daily', '0.9'));
const altSrc = fs.readFileSync(path.join(root, 'lib/products/alternativesRegistry.ts'), 'utf8');
const altSlugs = [...altSrc.matchAll(/^\s{4}slug:\s*'([^']+)'/gm)].map((m) => m[1]);
for (const alt of altSlugs) {
  pagesUrls.push(makeUrl(`/alternatives/${alt}`, 'weekly', '0.8'));
}

const compSrc = fs.readFileSync(path.join(root, 'lib/products/comparisonsRegistry.ts'), 'utf8');
const compSlugs = [...compSrc.matchAll(/^\s{4}slug:\s*'([^']+)'/gm)].map((m) => m[1]);
for (const comp of compSlugs) {
  pagesUrls.push(makeUrl(`/compare/${comp}`, 'weekly', '0.8'));
}

pagesUrls.push(makeUrl('/questions', 'daily', '0.8'));
for (const q of [
  'best-free-alternative-to-photoshop-online',
  'which-ai-tool-is-best-for-writing-code',
  'how-to-compress-pdf-files-without-losing-quality',
]) {
  pagesUrls.push(makeUrl(`/questions/${q}`, 'weekly', '0.75'));
}

pagesUrls.push(makeUrl('/collections', 'daily', '0.85'));
for (const col of [
  'best-free-ai-tools-2026',
  'essential-web-developer-suite',
  'best-privacy-first-image-tools',
]) {
  pagesUrls.push(makeUrl(`/collections/${col}`, 'weekly', '0.8'));
}

// Utility & landing surfaces included in sitemap
pagesUrls.push(makeUrl('/submit', 'weekly', '0.85'));
pagesUrls.push(makeUrl('/badges', 'weekly', '0.8'));
pagesUrls.push(makeUrl('/claim', 'weekly', '0.8'));
pagesUrls.push(makeUrl('/submit-startup', 'weekly', '0.8'));
pagesUrls.push(makeUrl('/workspace', 'daily', '0.9'));
pagesUrls.push(makeUrl('/dashboard', 'weekly', '0.8'));

pagesUrls.push(makeUrl('/business', 'daily', '0.9'));
for (const biz of ['ali-barber-studio', 'apex-digital-marketing', 'artisan-coffee-roasters']) {
  pagesUrls.push(makeUrl(`/business/${biz}`, 'daily', '0.8'));
}
for (const bId of ['TV-BIZ-8F4K2P', 'TV-BIZ-3M9Q7L', 'TV-BIZ-9X2V4W']) {
  pagesUrls.push(makeUrl(`/b/${bId}`, 'weekly', '0.7'));
}
pagesUrls.push(makeUrl('/business/register', 'weekly', '0.8'));
pagesUrls.push(makeUrl('/business-qr', 'weekly', '0.8'));
pagesUrls.push(makeUrl('/business/bidding', 'weekly', '0.8'));

pagesUrls.push(makeUrl('/travel', 'daily', '1.0'));
pagesUrls.push(makeUrl('/travel/passport', 'daily', '0.9'));
pagesUrls.push(makeUrl('/travel/embassies', 'daily', '0.9'));
pagesUrls.push(makeUrl('/travel/destinations', 'daily', '0.9'));
pagesUrls.push(makeUrl('/travel/jobs', 'daily', '0.9'));
pagesUrls.push(makeUrl('/travel/planner', 'daily', '0.9'));
pagesUrls.push(makeUrl('/travel/route', 'daily', '0.9'));
for (const corridor of ['AE', 'SA', 'GB', 'CA', 'DE', 'QA', 'OM', 'US', 'TR']) {
  pagesUrls.push(makeUrl(`/travel/PK/${corridor}`, 'daily', '0.85'));
}

pagesUrls.push(makeUrl('/startups', 'daily', '1.0'));
for (const s of ['nexus-ai-writer', 'devflow-database-studio', 'taskpulse-workspace', 'rankpulse-backlink-monitor']) {
  pagesUrls.push(makeUrl(`/startups/${s}`, 'daily', '0.9'));
}

pagesUrls.push(makeUrl('/guest-posts', 'daily', '1.0'));
pagesUrls.push(makeUrl('/become-a-publisher', 'monthly', '0.8'));
for (const p of ['tech-vision-journal', 'startup-builder-daily', 'seo-growth-digest']) {
  pagesUrls.push(makeUrl(`/publishers/${p}`, 'daily', '0.9'));
}

pagesUrls.push(makeUrl('/seo', 'daily', '0.95'));
pagesUrls.push(makeUrl('/seo-tools', 'daily', '0.9'));
pagesUrls.push(makeUrl('/pricing', 'weekly', '0.9'));
pagesUrls.push(makeUrl('/immigration', 'daily', '0.9'));
pagesUrls.push(makeUrl('/cars', 'weekly', '0.9'));
pagesUrls.push(makeUrl('/us', 'weekly', '0.85'));
pagesUrls.push(makeUrl('/uk', 'weekly', '0.85'));
pagesUrls.push(makeUrl('/ca', 'weekly', '0.85'));
pagesUrls.push(makeUrl('/au', 'weekly', '0.85'));
pagesUrls.push(makeUrl('/passport-photos', 'weekly', '0.85'));

// Payment Methods & Gateways Directory
pagesUrls.push(makeUrl('/payment-methods', 'daily', '0.90'));
pagesUrls.push(makeUrl('/payment-methods/compare', 'weekly', '0.80'));

const paymentCountriesSrc = fs.readFileSync(path.join(root, 'lib/payments/countriesAndCurrencies.ts'), 'utf8');
const paymentCats = slugs(section(paymentCountriesSrc, 'export const PAYMENT_CATEGORIES', 'export const PAYMENT_CURRENCIES'));
const paymentCountrySlugs = slugs(section(paymentCountriesSrc, 'export const PAYMENT_COUNTRIES'));
for (const cSlug of paymentCats) {
  pagesUrls.push(makeUrl(`/payment-methods/${cSlug}`, 'weekly', '0.80'));
}
for (const cntSlug of paymentCountrySlugs) {
  pagesUrls.push(makeUrl(`/payment-methods/countries/${cntSlug}`, 'weekly', '0.80'));
}

for (const catFile of [
  'lib/payments/providersCatalog.ts',
  'lib/payments/methodsCatalogPart1.ts',
  'lib/payments/methodsCatalogPart2.ts',
]) {
  const src = fs.readFileSync(path.join(root, catFile), 'utf8');
  for (const m of src.matchAll(/slug:\s*'([^']+)'[\s\S]*?cat:\s*'([^']+)'/g)) {
    pagesUrls.push(makeUrl(`/payment-methods/${m[2]}/${m[1]}`, 'weekly', '0.75'));
  }
}

// Mobile Phones & Specs Directory (/phones/*)
pagesUrls.push(makeUrl('/phones', 'daily', '0.90'));
pagesUrls.push(makeUrl('/phones/compare', 'weekly', '0.80'));

const phonesMetaSrc = fs.readFileSync(path.join(root, 'lib/phones/brandsAndCategories.ts'), 'utf8');
const phoneCats = slugs(section(phonesMetaSrc, 'export const PHONE_CATEGORIES', 'export const PHONE_BRANDS'));
const phoneBrands = slugs(section(phonesMetaSrc, 'export const PHONE_BRANDS'));
for (const cSlug of phoneCats) pagesUrls.push(makeUrl(`/phones/category/${cSlug}`, 'weekly', '0.80'));
for (const bSlug of phoneBrands) pagesUrls.push(makeUrl(`/phones/brand/${bSlug}`, 'weekly', '0.80'));

const phoneSlugSet = new Set();
const addPhoneToSitemap = (rawBrand, rawModel) => {
  const b = rawBrand.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const mod = rawModel.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const fullSlug = mod.startsWith(`${b}-`) ? mod : `${b}-${mod}`;
  if (!phoneSlugSet.has(fullSlug)) {
    phoneSlugSet.add(fullSlug);
    pagesUrls.push(makeUrl(`/phones/${fullSlug}`, 'weekly', '0.75'));
  }
};

for (const phFile of [
  'lib/phones/catalogPart1.ts',
  'lib/phones/catalogPart2.ts',
  'lib/phones/catalogPart3_2025_2026_Flagships.ts',
  'lib/phones/catalogPart4_2025_2026_Brands.ts',
  'lib/phones/catalogPart5_2025_2026_PK_Value.ts',
  'lib/phones/catalogPart6_2023_2024_Classics.ts',
]) {
  const src = fs.readFileSync(path.join(root, phFile), 'utf8');
  for (const m of src.matchAll(/brandSlug:\s*'([^']+)',\s*modelName:\s*'([^']+)'/g)) {
    addPhoneToSitemap(m[1], m[2]);
  }
  for (const m of src.matchAll(/\bb:\s*'([^']+)',\s*m:\s*'([^']+)'/g)) {
    addPhoneToSitemap(m[1], m[2]);
  }
}

// Primary GSC target: one combined urlset at /sitemap.xml
const keep = (list) => list.filter((u) => !isNoindex(u.loc.slice(base.length) || '/'));
toolsUrls.splice(0, toolsUrls.length, ...keep(toolsUrls));
contentUrls.splice(0, contentUrls.length, ...keep(contentUrls));
pagesUrls.splice(0, pagesUrls.length, ...keep(pagesUrls));
const allUrls = [...toolsUrls, ...contentUrls, ...pagesUrls];
writeUrlset('sitemap.xml', allUrls);

// Optional split files (organization / debugging; not required for GSC)
writeUrlset('sitemap-tools.xml', toolsUrls);
writeUrlset('sitemap-content.xml', contentUrls);
writeUrlset('sitemap-pages.xml', pagesUrls);

console.log(
  `Wrote combined sitemap.xml (${allUrls.length} URLs) + 3 optional children: tools=${toolsUrls.length}, content=${contentUrls.length}, pages=${pagesUrls.length} (${tools.length} live tools, ${blog.length} blog posts)`
);
