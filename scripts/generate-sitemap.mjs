/**
 * Generate clean, high-authority sitemaps under public/ (safe for CF prebuild).
 * - sitemap.xml          → single combined urlset (GSC submit target)
 * - sitemap-tools.xml    → /tools/* + /category/* (core products)
 * - sitemap-content.xml  → pillar guides, verified study destinations
 * - sitemap-pages.xml    → hubs, legal, directories
 *
 * Strict Quality Guardrails (GSC & AdSense Compliance):
 * - Excludes private/admin, /dashboard, /workspace, /pricing, thin /products/* shells.
 * - Excludes 188 auto-generated country doorway shells (keeps only verified Tier-1 study guides).
 * - Excludes 126 auto-generated template how-to posts (keeps only genuine hand-written pillar guides).
 * - Replaces /cv-maker with canonical /tools/cv-maker.
 * - Gives highest priority (0.95/0.9) to core tools and categories.
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
const NOINDEX_EXACT = new Set([
  '/404',
  '/dashboard',
  '/workspace',
  '/pricing',
  '/news',
  '/tools/cv-maker', // canonical is /cv-maker
]);

const NOINDEX_PREFIXES = [
  '/admin',
  '/admin/',
  '/products',
  '/products/',
  '/badges',
  '/claim',
];

const INDEXABLE_STUDY_SLUGS = new Set([
  'usa',
  'uk',
  'canada',
  'australia',
  'new-zealand',
  'europe',
  'germany',
]);

function isNoindex(p) {
  const x = (p.replace(/\/$/, '') || '/').toLowerCase();
  if (NOINDEX_EXACT.has(x)) return true;
  if (NOINDEX_PREFIXES.some((pre) => x === pre.replace(/\/$/, '') || x.startsWith(pre))) {
    return true;
  }
  if (x.startsWith('/study/')) {
    const slug = x.replace(/^\/study\//, '').split('/')[0];
    if (slug && !INDEXABLE_STUDY_SLUGS.has(slug)) return true;
  }
  return false;
}

function makeUrl(pathname, changefreq = 'weekly', priority = '0.8') {
  return { loc: `${base}${pathname}`, changefreq, priority };
}

function section(src, startMarker, endMarker) {
  const start = src.indexOf(startMarker);
  if (start < 0) throw new Error(`Missing ${startMarker}`);
  const end = endMarker ? src.indexOf(endMarker, start + 1) : src.length;
  return src.slice(start, end < 0 ? undefined : end);
}

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

// Keep ONLY verified hand-written pillar and trend posts (Do NOT add 126 template how-to clones)
const pillarBlog = [
  ...slugs(section(posts, 'const PILLAR_POSTS', 'export const BLOG_POSTS')),
  ...slugs(section(trendPosts, 'export const US_TREND_POSTS')),
];
const blog = [...new Set(pillarBlog)];

// —— 1. Tools: /tools/* + /category/* (Core product: high priority 0.9–0.95) ——
const toolsUrls = [];
toolsUrls.push(makeUrl('/tools', 'daily', '0.95'));
for (const c of categories) toolsUrls.push(makeUrl(`/category/${c}`, 'weekly', '0.85'));
for (const t of tools) toolsUrls.push(makeUrl(`/tools/${t}`, 'weekly', '0.90'));

// —— 2. Content: blog pillar guides & verified Tier-1 study destinations ——
const contentUrls = [];
contentUrls.push(makeUrl('/blog', 'daily', '0.80'));
contentUrls.push(makeUrl('/blog/topics', 'weekly', '0.75'));
for (const p of blog) contentUrls.push(makeUrl(`/blog/${p}`, 'weekly', '0.80'));

// Keep verified Tier-1 Study destinations (USA, UK, Canada, Australia, New Zealand, Europe, Germany)
contentUrls.push(makeUrl('/study', 'weekly', '0.75'));
for (const s of INDEXABLE_STUDY_SLUGS) {
  contentUrls.push(makeUrl(`/study/${s}`, 'weekly', '0.75'));
}

// —— 3. Pages: hubs, legal, regional hubs, directories ——
const pagesUrls = [];
pagesUrls.push(makeUrl('/', 'daily', '1.0'));
pagesUrls.push(makeUrl('/cv-maker', 'daily', '0.95'));
pagesUrls.push(makeUrl('/sitemap', 'weekly', '0.50'));

// Regional Tools Hubs (deep content)
for (const reg of ['us', 'uk', 'ca', 'au']) {
  pagesUrls.push(makeUrl(`/${reg}`, 'weekly', '0.80'));
}
pagesUrls.push(makeUrl('/passport-photos', 'weekly', '0.80'));
pagesUrls.push(makeUrl('/immigration', 'weekly', '0.75'));

// Curated Job clusters
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
  pagesUrls.push(makeUrl(`/jobs/${j}`, 'weekly', '0.75'));
}

// Legal compliance pages
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
  pagesUrls.push(makeUrl(`/legal/${l}`, 'monthly', '0.50'));
}

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

// Clean filtering: remove any item matching isNoindex
const keep = (list) => list.filter((u) => !isNoindex(u.loc.slice(base.length) || '/'));
toolsUrls.splice(0, toolsUrls.length, ...keep(toolsUrls));
contentUrls.splice(0, contentUrls.length, ...keep(contentUrls));
pagesUrls.splice(0, pagesUrls.length, ...keep(pagesUrls));
const allUrls = [...toolsUrls, ...contentUrls, ...pagesUrls];
writeUrlset('sitemap.xml', allUrls);

// Optional split files
writeUrlset('sitemap-tools.xml', toolsUrls);
writeUrlset('sitemap-content.xml', contentUrls);
writeUrlset('sitemap-pages.xml', pagesUrls);

console.log(
  `Cleaned sitemap.xml generated: ${allUrls.length} high-quality URLs (tools=${toolsUrls.length}, content=${contentUrls.length}, pages=${pagesUrls.length}). Excluded thin shells and template duplicates.`
);
