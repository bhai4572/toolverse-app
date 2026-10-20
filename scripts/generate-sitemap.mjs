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
const today = new Date().toISOString().slice(0, 10);

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
  return { loc: `${base}${pathname}`, lastmod: today, changefreq, priority };
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
    lines.push(`    <lastmod>${u.lastmod}</lastmod>`);
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

const blogSet = new Set(pillarBlog);
for (const toolSlug of tools) {
  if (PILLAR_GUIDE_BY_TOOL[toolSlug]) {
    blogSet.add(PILLAR_GUIDE_BY_TOOL[toolSlug]);
  } else {
    blogSet.add(`how-to-${toolSlug}`);
  }
}
const blog = [...blogSet];

// —— Tools: /tools/* + /category/* ——
const toolsUrls = [];
toolsUrls.push(makeUrl('/tools', 'daily', '0.95'));
for (const c of categories) toolsUrls.push(makeUrl(`/category/${c}`, 'weekly', '0.8'));
for (const t of tools) toolsUrls.push(makeUrl(`/tools/${t}`, 'weekly', '0.7'));

// —— Content: blog, how-to, news, study ——
const contentUrls = [];
contentUrls.push(makeUrl('/blog', 'daily', '0.8'));
contentUrls.push(makeUrl('/blog/topics', 'weekly', '0.78'));
for (const p of blog) contentUrls.push(makeUrl(`/blog/${p}`, 'weekly', '0.75'));

contentUrls.push(makeUrl('/how-to', 'weekly', '0.85'));
for (const ht of [
  'how-to-create-a-business-profile',
  'how-to-generate-and-print-business-qr',
  'how-business-rankings-work',
  'how-to-verify-business-ownership',
  'how-to-verify-your-business',
  'how-to-get-a-toolverse-business-id',
  'how-to-generate-a-business-qr-code',
  'how-to-print-your-toolverse-qr',
  'how-to-collect-honest-customer-reviews',
  'how-sponsored-ranking-works',
  'how-to-claim-a-business',
  'how-to-report-a-fake-business',
]) {
  contentUrls.push(makeUrl(`/how-to/${ht}`, 'weekly', '0.8'));
}

contentUrls.push(makeUrl('/news', 'hourly', '0.9'));
contentUrls.push(makeUrl('/study', 'daily', '0.9'));
for (const s of ['usa', 'uk', 'canada', 'australia', 'new-zealand', 'europe']) {
  contentUrls.push(makeUrl(`/study/${s}`, 'weekly', '0.88'));
}

// —— Pages: hubs, legal, jobs, ecosystem (no workspace/admin) ——
const pagesUrls = [];
pagesUrls.push(makeUrl('/', 'daily', '1.0'));
pagesUrls.push(makeUrl('/sitemap', 'weekly', '0.55'));

for (const j of [
  'remote-jobs',
  'usa-jobs',
  'software-engineer-jobs',
  'data-entry-jobs',
  'pakistan-govt-jobs',
]) {
  pagesUrls.push(makeUrl(`/jobs/${j}`, 'daily', '0.8'));
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
for (const p of ['canva', 'chatgpt', 'notion', 'figma', 'supabase', 'claude-ai']) {
  pagesUrls.push(makeUrl(`/products/${p}`, 'daily', '0.8'));
}

pagesUrls.push(makeUrl('/alternatives', 'daily', '0.9'));
for (const alt of ['canva', 'chatgpt', 'notion']) {
  pagesUrls.push(makeUrl(`/alternatives/${alt}`, 'weekly', '0.8'));
}

for (const comp of ['canva-vs-figma', 'chatgpt-vs-claude']) {
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

pagesUrls.push(makeUrl('/submit', 'monthly', '0.6'));
pagesUrls.push(makeUrl('/badges', 'monthly', '0.6'));
pagesUrls.push(makeUrl('/claim', 'monthly', '0.6'));

pagesUrls.push(makeUrl('/business', 'daily', '0.9'));
for (const biz of ['ali-barber-studio', 'apex-digital-marketing', 'artisan-coffee-roasters']) {
  pagesUrls.push(makeUrl(`/business/${biz}`, 'daily', '0.8'));
}
for (const bId of ['TV-BIZ-8F4K2P', 'TV-BIZ-3M9Q7L', 'TV-BIZ-9X2V4W']) {
  pagesUrls.push(makeUrl(`/b/${bId}`, 'weekly', '0.7'));
}
pagesUrls.push(makeUrl('/business/register', 'monthly', '0.7'));
pagesUrls.push(makeUrl('/business/bidding', 'weekly', '0.8'));
pagesUrls.push(makeUrl('/business-qr', 'monthly', '0.7'));

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
pagesUrls.push(makeUrl('/submit-startup', 'monthly', '0.7'));
for (const s of ['nexus-ai-writer', 'devflow-database-studio', 'taskpulse-workspace', 'rankpulse-backlink-monitor']) {
  pagesUrls.push(makeUrl(`/startups/${s}`, 'daily', '0.9'));
}

pagesUrls.push(makeUrl('/guest-posts', 'daily', '1.0'));
pagesUrls.push(makeUrl('/guest-posts/create-pitch', 'monthly', '0.7'));
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

// Primary GSC target: one combined urlset at /sitemap.xml
const allUrls = [...toolsUrls, ...contentUrls, ...pagesUrls];
writeUrlset('sitemap.xml', allUrls);

// Optional split files (organization / debugging; not required for GSC)
writeUrlset('sitemap-tools.xml', toolsUrls);
writeUrlset('sitemap-content.xml', contentUrls);
writeUrlset('sitemap-pages.xml', pagesUrls);

console.log(
  `Wrote combined sitemap.xml (${allUrls.length} URLs) + 3 optional children: tools=${toolsUrls.length}, content=${contentUrls.length}, pages=${pagesUrls.length} (${tools.length} live tools, ${blog.length} blog posts)`
);
