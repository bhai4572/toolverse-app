/**
 * Build-time SEO prerender for Cloudflare Pages + Vite SPA.
 * After `vite build`, writes route/index.html shells with correct title, meta,
 * canonical, OG, JSON-LD, and crawler-visible H1/intro. React still hydrates #root.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const templatePath = path.join(distDir, 'index.html');

const LEGAL_SLUGS = [
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

const JOB_SLUGS = [
  'remote-jobs',
  'usa-jobs',
  'software-engineer-jobs',
  'data-entry-jobs',
  'pakistan-govt-jobs',
];

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setMetaByName(html, name, content) {
  const re = new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]*"\\s*/?>`, 'i');
  const tag = `<meta name="${name}" content="${esc(content)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function setMetaByProperty(html, property, content) {
  const re = new RegExp(`<meta\\s+property="${property}"\\s+content="[^"]*"\\s*/?>`, 'i');
  const tag = `<meta property="${property}" content="${esc(content)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function setCanonical(html, href) {
  const re = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i;
  const tag = `<link rel="canonical" href="${esc(href)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function setTitle(html, title) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`);
}

function replaceJsonLd(html, schemas) {
  let out = html.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
  const injected = (schemas || [])
    .map((schema) => `    <script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join('\n');
  return out.replace('</head>', `${injected}\n  </head>`);
}

function buildBodyMain(pathname, meta, deps) {
  const {
    TOOLS,
    CATEGORIES,
    getToolPageContent,
    getCategoryPageContent,
    getBlogPostBySlug,
    getJobPageContent,
  } = deps;
  const parts = pathname.replace(/\/$/, '').split('/').filter(Boolean);
  let h1 = meta.title.replace(/\s*[—|].*$/, '').trim() || meta.title;
  let intro = meta.description;
  let extra = '';

  if (parts[0] === 'tools' && parts[1]) {
    const tool = TOOLS.find((t) => t.slug === parts[1]);
    const seo = getToolPageContent(parts[1]);
    if (tool) {
      h1 = tool.canonicalName;
      intro = seo?.answerFirst || tool.shortDescription;
      extra = `<p class="text-sm"><a href="/category/${esc(tool.categorySlug)}">${esc(tool.category)}</a></p>`;
    }
  } else if (parts[0] === 'category' && parts[1]) {
    const cat = CATEGORIES.find((c) => c.slug === parts[1]);
    const seo = getCategoryPageContent(parts[1]);
    if (cat) {
      h1 = cat.name;
      intro = seo?.intro || cat.description;
    }
  } else if (parts[0] === 'blog' && parts[1]) {
    const post = getBlogPostBySlug(parts[1]);
    if (post) {
      h1 = post.title;
      intro = post.description;
      if (post.relatedToolSlug) {
        extra = `<p class="text-sm">Related tool: <a href="/tools/${esc(post.relatedToolSlug)}">${esc(post.relatedToolSlug)}</a></p>`;
      }
    }
  } else if (parts[0] === 'blog') {
    h1 = 'ToolVerse Blog';
  } else if (parts[0] === 'jobs' && parts[1]) {
    const job = getJobPageContent?.(parts[1]);
    if (job) {
      h1 = job.title;
      intro = job.intro || job.subtitle;
    }
  } else if (parts.length === 0) {
    h1 = '100+ Free Online Tools for Everyday Work';
  }

  return `
      <header class="p-4 bg-white border-b">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" class="font-bold text-xl">ToolVerse</a>
          <nav>
            <a href="/category/pdf-document-tools" class="px-2 text-sm">PDF Tools</a>
            <a href="/category/image-design-tools" class="px-2 text-sm">Image Tools</a>
            <a href="/blog" class="px-2 text-sm">Blog</a>
            <a href="/legal/about" class="px-2 text-sm">About</a>
          </nav>
        </div>
      </header>
      <main class="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <!-- prerender:${esc(pathname)} -->
        <h1 class="text-3xl font-extrabold">${esc(h1)}</h1>
        <p class="text-base text-slate-600 max-w-3xl">${esc(intro)}</p>
        ${extra}
        <p class="text-sm text-slate-500">Interactive tools load in your browser.</p>
      </main>
      <footer class="p-6 bg-white border-t text-center text-xs text-slate-500">
        <p>&copy; 2026 ToolVerse. Free, fast, privacy-first online tools.</p>
      </footer>`;
}

function applyPage(html, pathname, getMetadataForPath, deps) {
  const meta = getMetadataForPath(pathname);
  let out = html;
  out = setTitle(out, meta.title);
  out = setMetaByName(out, 'description', meta.description);
  out = setCanonical(out, meta.canonicalUrl);
  out = setMetaByProperty(out, 'og:title', meta.title);
  out = setMetaByProperty(out, 'og:description', meta.description);
  out = setMetaByProperty(out, 'og:url', meta.canonicalUrl);
  out = setMetaByProperty(out, 'og:type', meta.ogType || 'website');
  out = setMetaByProperty(out, 'og:image', meta.ogImage || 'https://toolverse.baby/og-image.png');
  out = setMetaByName(out, 'twitter:title', meta.title);
  out = setMetaByName(out, 'twitter:description', meta.description);
  out = setMetaByName(out, 'twitter:image', meta.ogImage || 'https://toolverse.baby/og-image.png');
  out = replaceJsonLd(out, meta.jsonLd);

  const bodyInner = buildBodyMain(pathname === '/' ? '/' : pathname, meta, deps);
  // Vite moves module scripts to <head>, so close on </div></body> (not script-after-root)
  const replaced = out.replace(
    /(<div id="root"[^>]*>)[\s\S]*?(<\/div>\s*<\/body>)/i,
    `$1${bodyInner}\n    $2`
  );
  if (replaced === out) {
    throw new Error(`Failed to inject body for ${pathname}`);
  }
  return replaced;
}

function writeRoute(pathname, html) {
  const clean = pathname.replace(/\/$/, '') || '';
  const destDir = clean ? path.join(distDir, ...clean.split('/')) : distDir;
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(path.join(destDir, 'index.html'), html);
}

async function main() {
  if (!fs.existsSync(templatePath)) {
    console.error('dist/index.html missing — run vite build first');
    process.exit(1);
  }

  const vite = await createServer({
    root,
    configFile: path.join(root, 'vite.config.ts'),
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { getMetadataForPath } = await vite.ssrLoadModule('/lib/seo/metaEngine.ts');
    const { TOOLS, CATEGORIES } = await vite.ssrLoadModule('/lib/tools/registry.ts');
    const { BLOG_POSTS, getBlogPostBySlug } = await vite.ssrLoadModule('/lib/blog/posts.ts');
    const { getToolPageContent } = await vite.ssrLoadModule('/lib/seo/toolPageContent.ts');
    const { getCategoryPageContent } = await vite.ssrLoadModule('/lib/seo/categoryPageContent.ts');
    const { getJobPageContent } = await vite.ssrLoadModule('/lib/seo/jobPageContent.ts');

    const deps = {
      TOOLS,
      CATEGORIES,
      getToolPageContent,
      getCategoryPageContent,
      getBlogPostBySlug,
      getJobPageContent,
    };
    const template = fs.readFileSync(templatePath, 'utf8');

    const routes = ['/'];
    for (const t of TOOLS) {
      if (t.status === 'live') routes.push(`/tools/${t.slug}`);
    }
    for (const c of CATEGORIES) routes.push(`/category/${c.slug}`);
    routes.push('/blog');
    for (const p of BLOG_POSTS) routes.push(`/blog/${p.slug}`);
    for (const l of LEGAL_SLUGS) routes.push(`/legal/${l}`);
    for (const j of JOB_SLUGS) routes.push(`/jobs/${j}`);

    for (const route of routes) {
      const html = applyPage(template, route, getMetadataForPath, deps);
      if (route === '/') fs.writeFileSync(templatePath, html);
      else writeRoute(route, html);
    }

    console.log(`Prerendered ${routes.length} HTML shells into dist/`);
  } finally {
    await vite.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
