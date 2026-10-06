import fs from 'fs';
import { TOOLS, CATEGORIES } from '../lib/tools/registry.ts';
import { BLOG_POSTS } from '../lib/blog/posts.ts';

const base = 'https://toolverse.baby';
const today = new Date().toISOString().slice(0, 10);
const urls = [];

function add(path, changefreq = 'weekly', priority = '0.8') {
  urls.push({ loc: `${base}${path}`, lastmod: today, changefreq, priority });
}

add('/', 'daily', '1.0');
for (const c of CATEGORIES) add(`/category/${c.slug}`, 'weekly', '0.8');
for (const t of TOOLS) add(`/tools/${t.slug}`, 'weekly', '0.7');
add('/blog', 'daily', '0.8');
for (const p of BLOG_POSTS) add(`/blog/${p.slug}`, 'weekly', '0.8');

const jobs = [
  'remote-jobs',
  'usa-jobs',
  'software-engineer-jobs',
  'data-entry-jobs',
  'pakistan-govt-jobs',
];
for (const j of jobs) add(`/jobs/${j}`, 'daily', '0.8');

const legal = [
  'privacy-policy',
  'terms-of-use',
  'disclaimer',
  'cookie-policy',
  'dmca',
  'about',
  'contact',
  'editorial-policy',
  'security',
];
for (const l of legal) add(`/legal/${l}`, 'monthly', '0.5');

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

fs.writeFileSync(new URL('../public/sitemap.xml', import.meta.url), lines.join('\n') + '\n');
console.log(`Wrote ${urls.length} URLs (${TOOLS.length} tools)`);
