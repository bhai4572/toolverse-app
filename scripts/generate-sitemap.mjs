/**
 * Generate public/sitemap.xml without Vite/Rollup (safe for CF prebuild).
 * Parses slug fields from registry + blog source files.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const base = 'https://toolverse.baby';
const today = new Date().toISOString().slice(0, 10);
const urls = [];

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
  const re = /(?:^|[^\w])slug:\s*'([^']+)'[\s\S]*?status:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(toolsSrc))) {
    if (m[2] === 'live') out.push(m[1]);
  }
  return out;
}

const registry = fs.readFileSync(path.join(root, 'lib/tools/registry.ts'), 'utf8');
const posts = fs.readFileSync(path.join(root, 'lib/blog/posts.ts'), 'utf8');

const categories = slugs(section(registry, 'export const CATEGORIES', 'export const TOOLS'));
const tools = liveToolSlugs(section(registry, 'export const TOOLS'));
const blog = slugs(section(posts, 'export const BLOG_POSTS'));

add('/', 'daily', '1.0');
for (const c of categories) add(`/category/${c}`, 'weekly', '0.8');
for (const t of tools) add(`/tools/${t}`, 'weekly', '0.7');
add('/blog', 'daily', '0.8');
for (const p of blog) add(`/blog/${p}`, 'weekly', '0.8');

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
console.log(`Wrote ${urls.length} URLs (${tools.length} live tools)`);
