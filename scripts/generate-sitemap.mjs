/**
 * Generate clean, high-authority sitemaps under public/ (safe for CF prebuild).
 * - sitemap.xml          → single combined urlset (GSC submit target)
 * - sitemap-tools.xml    → /tools/* + /category/* (core products)
 * - sitemap-content.xml  → original hand-written blog/pillar guides + top 7 study guides
 * - sitemap-pages.xml    → homepage, CV maker, regional/topical hubs, legal/trust pages
 *
 * Strictly mirrors lib/seo/indexability.ts:
 * Zero noindex URLs, zero redirect aliases, zero broken /how-to/* pages,
 * zero demo/empty directory pages, and zero private/app routes.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const base = 'https://toolverse.baby';

const NOINDEX_EXACT = new Set([
  '/404',
  '/dashboard',
  '/workspace',
  '/seo-dashboard',
  '/pricing',
  '/tools/cv-maker',
  '/business/dashboard',
]);

const NOINDEX_PREFIXES = ['/admin', '/admin/', '/workspace/', '/seo-dashboard/'];

const THIN_NOINDEX_ENABLED = true;

const THIN_EXACT = new Set([
  '/how-to',
  '/products',
  '/payment-methods',
  '/phones',
  '/leaderboard',
  '/submit',
  '/claim',
  '/badges',
  '/travel',
  '/jobs',
  '/news',
  '/tools/global-job-finder',
  '/tools/b2b-email-finder',
  '/business',
  '/business-qr',
  '/startups',
  '/submit-startup',
  '/guest-posts',
  '/become-a-publisher',
  '/alternatives',
  '/collections',
  '/questions',
]);

const THIN_PREFIXES = [
  '/how-to/',
  '/products/',
  '/payment-methods/',
  '/phones/',
  '/travel/',
  '/jobs/',
  '/news/',
  '/business/',
  '/b/',
  '/startups/',
  '/guest-posts/',
  '/publishers/',
  '/alternatives/',
  '/compare/',
  '/collections/',
  '/questions/',
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
  if (THIN_NOINDEX_ENABLED) {
    if (THIN_EXACT.has(x)) return true;
    if (THIN_PREFIXES.some((pre) => x.startsWith(pre))) return true;
    if (x.startsWith('/study/')) {
      const slug = x.replace(/^\/study\//, '').split('/')[0];
      if (slug && !INDEXABLE_STUDY_SLUGS.has(slug)) return true;
    }
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
  const seen = new Set();
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const u of urls) {
    if (seen.has(u.loc)) continue;
    seen.add(u.loc);
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
const carsPosts = fs.readFileSync(path.join(root, 'lib/blog/carsPosts.ts'), 'utf8');

const categories = slugs(section(registry, 'export const CATEGORIES', 'export const TOOLS'));
const tools = liveToolSlugs(section(registry, 'export const TOOLS'));

// Original hand-written blog posts only (zero auto-generated template how-to clones)
const pillarBlog = [
  ...slugs(section(posts, 'const PILLAR_POSTS', 'export const BLOG_POSTS')),
  ...slugs(section(trendPosts, 'export const US_TREND_POSTS')),
  ...slugs(section(carsPosts, 'export const CARS_BLOG_POSTS')),
];
const blog = [...new Set(pillarBlog)];

// —— 1. Tools: /tools/* + /category/* (Core product: highest priority) ——
const toolsUrls = [];
toolsUrls.push(makeUrl('/tools', 'daily', '0.95'));
for (const c of categories) toolsUrls.push(makeUrl(`/category/${c}`, 'weekly', '0.85'));
for (const t of tools) toolsUrls.push(makeUrl(`/tools/${t}`, 'weekly', '0.90'));

// —— 2. Content: original hand-written blog guides & verified Tier-1 study destinations ——
const contentUrls = [];
contentUrls.push(makeUrl('/blog', 'daily', '0.85'));
contentUrls.push(makeUrl('/blog/topics', 'weekly', '0.75'));
for (const p of blog) contentUrls.push(makeUrl(`/blog/${p}`, 'weekly', '0.80'));

contentUrls.push(makeUrl('/study', 'weekly', '0.75'));
for (const s of INDEXABLE_STUDY_SLUGS) {
  contentUrls.push(makeUrl(`/study/${s}`, 'weekly', '0.75'));
}

// —— 3. Pages: homepage, CV maker, regional/topical hubs, trust & legal pages ——
const pagesUrls = [];
pagesUrls.push(makeUrl('/', 'daily', '1.0'));
pagesUrls.push(makeUrl('/cv-maker', 'daily', '0.95'));
pagesUrls.push(makeUrl('/sitemap', 'weekly', '0.50'));

for (const hub of ['us', 'uk', 'ca', 'au', 'passport-photos', 'immigration', 'cars', 'seo', 'seo-tools']) {
  pagesUrls.push(makeUrl(`/${hub}`, 'weekly', '0.80'));
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
  pagesUrls.push(makeUrl(`/legal/${l}`, 'monthly', '0.50'));
}

// Strict filtering: guarantee zero noindex URLs ever enter any sitemap
const keep = (list) => list.filter((u) => !isNoindex(u.loc.slice(base.length) || '/'));
toolsUrls.splice(0, toolsUrls.length, ...keep(toolsUrls));
contentUrls.splice(0, contentUrls.length, ...keep(contentUrls));
pagesUrls.splice(0, pagesUrls.length, ...keep(pagesUrls));
const allUrls = [...toolsUrls, ...contentUrls, ...pagesUrls];

writeUrlset('sitemap.xml', allUrls);
writeUrlset('sitemap-tools.xml', toolsUrls);
writeUrlset('sitemap-content.xml', contentUrls);
writeUrlset('sitemap-pages.xml', pagesUrls);

console.log(
  `Clean AdSense-ready sitemap.xml generated: ${allUrls.length} canonical indexable URLs (tools=${toolsUrls.length}, content=${contentUrls.length}, pages=${pagesUrls.length}; ${tools.length} live tools, ${blog.length} original blog posts)`
);
