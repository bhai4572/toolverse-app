/**
 * Generate public/sitemap.xml without Vite/Rollup (safe for CF prebuild).
 * Parses slug fields from registry + blog pillar source; adds per-tool how-to guides.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const base = 'https://toolverse.baby';
const today = new Date().toISOString().slice(0, 10);
const urls = [];

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

function add(pathname, changefreq = 'weekly', priority = '0.8') {
  urls.push({ loc: `${base}${pathname}`, lastmod: today, changefreq, priority });
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

const registry = fs.readFileSync(path.join(root, 'lib/tools/registry.ts'), 'utf8');
const posts = fs.readFileSync(path.join(root, 'lib/blog/posts.ts'), 'utf8');

const categories = slugs(section(registry, 'export const CATEGORIES', 'export const TOOLS'));
const tools = liveToolSlugs(section(registry, 'export const TOOLS'));
const pillarBlog = slugs(section(posts, 'const PILLAR_POSTS', 'export const BLOG_POSTS'));

const blogSet = new Set(pillarBlog);
for (const toolSlug of tools) {
  if (PILLAR_GUIDE_BY_TOOL[toolSlug]) {
    blogSet.add(PILLAR_GUIDE_BY_TOOL[toolSlug]);
  } else {
    blogSet.add(`how-to-${toolSlug}`);
  }
}
const blog = [...blogSet];

add('/', 'daily', '1.0');
for (const c of categories) add(`/category/${c}`, 'weekly', '0.8');
for (const t of tools) add(`/tools/${t}`, 'weekly', '0.7');
add('/blog', 'daily', '0.8');
for (const p of blog) add(`/blog/${p}`, 'weekly', '0.75');

for (const j of [
  'remote-jobs',
  'usa-jobs',
  'software-engineer-jobs',
  'data-entry-jobs',
  'pakistan-govt-jobs',
]) {
  add(`/jobs/${j}`, 'daily', '0.8');
}

for (const l of [
  'privacy-policy',
  'terms-of-use',
  'disclaimer',
  'cookie-policy',
  'dmca',
  'about',
  'contact',
  'editorial-policy',
  'security',
]) {
  add(`/legal/${l}`, 'monthly', '0.5');
}

// Product Discovery Hub & Ecosystem Routes
add('/products', 'daily', '0.9');
for (const p of ['canva', 'chatgpt', 'notion', 'figma', 'supabase', 'claude-ai']) {
  add(`/products/${p}`, 'daily', '0.8');
}

add('/alternatives', 'daily', '0.9');
for (const alt of ['canva', 'chatgpt', 'notion']) {
  add(`/alternatives/${alt}`, 'weekly', '0.8');
}

for (const comp of ['canva-vs-figma', 'chatgpt-vs-claude']) {
  add(`/compare/${comp}`, 'weekly', '0.8');
}

add('/questions', 'daily', '0.8');
for (const q of [
  'best-free-alternative-to-photoshop-online',
  'which-ai-tool-is-best-for-writing-code',
  'how-to-compress-pdf-files-without-losing-quality',
]) {
  add(`/questions/${q}`, 'weekly', '0.75');
}

add('/collections', 'daily', '0.85');
for (const col of [
  'best-free-ai-tools-2026',
  'essential-web-developer-suite',
  'best-privacy-first-image-tools',
]) {
  add(`/collections/${col}`, 'weekly', '0.8');
}

add('/submit', 'monthly', '0.6');
add('/badges', 'monthly', '0.6');
add('/claim', 'monthly', '0.6');

// Global Business Discovery & Identity System Routes
// Keep in sync with lib/business/registry.ts INITIAL_BUSINESSES
add('/business', 'daily', '0.9');
for (const biz of ['ali-barber-studio', 'apex-digital-marketing', 'artisan-coffee-roasters']) {
  add(`/business/${biz}`, 'daily', '0.8');
}
for (const bId of ['TV-BIZ-8F4K2P', 'TV-BIZ-3M9Q7L', 'TV-BIZ-9X2V4W']) {
  add(`/b/${bId}`, 'weekly', '0.7');
}
add('/business/register', 'monthly', '0.7');
add('/business/bidding', 'weekly', '0.8');
add('/business-qr', 'monthly', '0.7');

// How-To Knowledge Base — keep in sync with app/how-to/page.tsx HOW_TO_GUIDES
add('/how-to', 'weekly', '0.85');
for (const ht of [
  'how-to-create-a-business-profile',
  'how-to-generate-and-print-business-qr',
  'how-business-rankings-work',
  'how-to-verify-business-ownership',
]) {
  add(`/how-to/${ht}`, 'weekly', '0.8');
}

// Global Travel Intelligence Platform Routes
add('/travel', 'daily', '1.0');
add('/travel/passport', 'daily', '0.9');
add('/travel/embassies', 'daily', '0.9');
add('/travel/destinations', 'daily', '0.9');
add('/travel/jobs', 'daily', '0.9');
add('/travel/planner', 'daily', '0.9');
add('/travel/route', 'daily', '0.9');

// Startup Launch & Discovery Platform Routes
add('/startups', 'daily', '1.0');
add('/submit-startup', 'monthly', '0.7');
for (const s of ['nexus-ai-writer', 'devflow-database-studio', 'taskpulse-workspace', 'rankpulse-backlink-monitor']) {
  add(`/startups/${s}`, 'daily', '0.9');
}

// Guest Posting & Publisher Marketplace Routes
add('/guest-posts', 'daily', '1.0');
add('/guest-posts/create-pitch', 'monthly', '0.7');
add('/become-a-publisher', 'monthly', '0.8');
for (const p of ['tech-vision-journal', 'startup-builder-daily', 'seo-growth-digest']) {
  add(`/publishers/${p}`, 'daily', '0.9');
}

// Public product / SEO hubs (exclude /workspace /dashboard /admin*)
add('/seo', 'daily', '0.95');
add('/seo-tools', 'daily', '0.9');
add('/tools', 'daily', '0.95');
add('/pricing', 'weekly', '0.9');
add('/study', 'daily', '0.9');
add('/immigration', 'daily', '0.9');
add('/us', 'weekly', '0.85');
add('/uk', 'weekly', '0.85');
add('/ca', 'weekly', '0.85');
add('/au', 'weekly', '0.85');
add('/passport-photos', 'weekly', '0.85');

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

fs.writeFileSync(path.join(root, 'public/sitemap.xml'), lines.join('\n') + '\n');
console.log(
  `Wrote ${urls.length} URLs (${tools.length} live tools, ${blog.length} blog posts incl. tool guides)`
);
