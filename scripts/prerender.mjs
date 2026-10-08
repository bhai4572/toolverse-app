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

function mdToHtml(md) {
  if (!md) return '';
  const blocks = md.split('\n\n');
  return blocks
    .map((paragraph) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('# ')) return '';
      if (trimmed.startsWith('## ')) {
        return `<h2 class="text-2xl font-bold mt-6 mb-3">${esc(trimmed.replace(/^##\s+/, ''))}</h2>`;
      }
      if (trimmed.startsWith('### ')) {
        return `<h3 class="text-xl font-semibold mt-4 mb-2">${esc(trimmed.replace(/^###\s+/, ''))}</h3>`;
      }
      if (trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
        const isNum = /^\d+\.\s/.test(trimmed);
        const tag = isNum ? 'ol' : 'ul';
        const listCls = isNum ? 'list-decimal' : 'list-disc';
        const items = trimmed
          .split('\n')
          .map((item) => `<li class="my-1">${esc(item.replace(/^(- |\d+\.\s)/, ''))}</li>`)
          .join('');
        return `<${tag} class="${listCls} list-inside space-y-1 pl-4 my-3">${items}</${tag}>`;
      }
      if (trimmed.startsWith('|') && trimmed.includes('|')) {
        const rows = trimmed.split('\n').filter((r) => r.trim() && !r.includes('---'));
        if (rows.length > 0) {
          const tableHtml = rows
            .map((r, i) => {
              const cols = r.split('|').filter((_, ci, arr) => ci > 0 && ci < arr.length - 1);
              const tag = i === 0 ? 'th' : 'td';
              const cellCls = i === 0 ? 'border p-2 bg-slate-100 font-bold' : 'border p-2';
              return `<tr>${cols.map((c) => `<${tag} class="${cellCls}">${esc(c.trim())}</${tag}>`).join('')}</tr>`;
            })
            .join('');
          return `<div class="overflow-x-auto my-4"><table class="border-collapse border border-slate-300 w-full text-sm">${tableHtml}</table></div>`;
        }
      }
      if (trimmed === '---') return '<hr class="my-6 border-slate-200" />';
      return `<p class="leading-relaxed my-3">${esc(trimmed)}</p>`;
    })
    .join('\n');
}

function buildBodyMain(pathname, meta, deps) {
  const {
    TOOLS,
    CATEGORIES,
    getToolsByCategory,
    getToolPageContent,
    getCategoryPageContent,
    getBlogPostBySlug,
    getJobPageContent,
  } = deps;
  const parts = pathname.replace(/\/$/, '').split('/').filter(Boolean);

  let contentHtml = '';

  if (parts.length === 0) {
    // Home Page
    const popular = TOOLS.filter((t) => t.isPopular && t.status === 'live').slice(0, 9);
    contentHtml = `
      <div class="space-y-8">
        <header class="text-center space-y-3 max-w-3xl mx-auto">
          <h1 class="text-4xl font-extrabold text-slate-900">${esc(meta.title.replace(/\s*[—|].*$/, ''))}</h1>
          <p class="text-lg text-slate-600">${esc(meta.description)}</p>
        </header>

        <section class="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900">
          <h2 class="text-lg font-bold mb-2">Browser Privacy Guarantee</h2>
          <p class="text-sm">Client-side tools process files locally in your web browser memory. Zero files are uploaded to external servers for core conversions.</p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold">Popular Free Online Tools</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${popular
              .map(
                (t) => `
              <div class="p-4 border rounded-xl bg-white shadow-sm">
                <h3 class="font-bold text-base"><a href="/tools/${esc(t.slug)}" class="text-indigo-600 hover:underline">${esc(t.canonicalName)}</a></h3>
                <p class="text-xs text-slate-500 mt-1">${esc(t.shortDescription)}</p>
              </div>`
              )
              .join('')}
          </div>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold">Browse Tools by Category</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${CATEGORIES.map(
              (c) => `
              <div class="p-4 border rounded-xl bg-white shadow-sm">
                <h3 class="font-bold text-base"><a href="/category/${esc(c.slug)}" class="text-indigo-600 hover:underline">${esc(c.name)}</a></h3>
                <p class="text-xs text-slate-500 mt-1">${esc(c.description)}</p>
              </div>`
            ).join('')}
          </div>
        </section>
      </div>
    `;
  } else if (parts[0] === 'tools' && parts[1]) {
    // Tool Page
    const tool = TOOLS.find((t) => t.slug === parts[1]);
    const seo = getToolPageContent(parts[1]);
    if (tool) {
      const siblingTools = (getToolsByCategory ? getToolsByCategory(tool.categorySlug) : [])
        .filter((t) => t.slug !== tool.slug && t.status === 'live')
        .slice(0, 4);

      const instructionsHtml = tool.instructions?.length
        ? `<section class="space-y-2 mt-6">
            <h2 class="text-xl font-bold">How to Use ${esc(tool.canonicalName)}</h2>
            <ol class="list-decimal list-inside space-y-1 pl-4 text-slate-700">
              ${tool.instructions.map((inst) => `<li>${esc(inst)}</li>`).join('')}
            </ol>
          </section>`
        : '';

      const useCasesHtml = tool.useCases?.length
        ? `<section class="space-y-2 mt-6">
            <h2 class="text-xl font-bold">Common Use Cases</h2>
            <ul class="list-disc list-inside space-y-1 pl-4 text-slate-700">
              ${tool.useCases.map((u) => `<li>${esc(u)}</li>`).join('')}
            </ul>
          </section>`
        : '';

      const topicalSectionsHtml = (seo?.sections || [])
        .map(
          (s) => `
          <section class="space-y-2 mt-6">
            <h2 class="text-xl font-bold">${esc(s.heading)}</h2>
            <p class="text-slate-700 leading-relaxed">${esc(s.body)}</p>
          </section>`
        )
        .join('');

      const faqs = seo?.faqs || [];
      const faqsHtml = faqs.length
        ? `<section class="space-y-4 mt-8 pt-6 border-t">
            <h2 class="text-2xl font-bold">Frequently Asked Questions</h2>
            <div class="space-y-3">
              ${faqs
                .map(
                  (f) => `
                <div class="p-4 bg-slate-50 border rounded-lg">
                  <h3 class="font-semibold text-slate-900">${esc(f.question)}</h3>
                  <p class="text-sm text-slate-600 mt-1">${esc(f.answer)}</p>
                </div>`
                )
                .join('')}
            </div>
          </section>`
        : '';

      const relatedToolsHtml = siblingTools.length
        ? `<section class="space-y-3 mt-8 pt-6 border-t">
            <h2 class="text-lg font-bold">Related Tools in ${esc(tool.category)}</h2>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${siblingTools
                .map(
                  (st) => `
                <li class="p-3 border rounded-lg bg-white">
                  <a href="/tools/${esc(st.slug)}" class="font-semibold text-indigo-600 hover:underline">${esc(st.canonicalName)}</a>
                  <p class="text-xs text-slate-500 mt-0.5">${esc(st.shortDescription)}</p>
                </li>`
                )
                .join('')}
            </ul>
          </section>`
        : '';

      contentHtml = `
        <article class="space-y-6">
          <nav aria-label="Breadcrumb" class="text-xs text-slate-500 space-x-2">
            <a href="/" class="hover:underline">Home</a> &gt;
            <a href="/category/${esc(tool.categorySlug)}" class="hover:underline">${esc(tool.category)}</a> &gt;
            <span class="text-slate-800 font-semibold">${esc(tool.canonicalName)}</span>
          </nav>

          <header class="space-y-3">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900">${esc(tool.canonicalName)}</h1>
            <p class="text-lg text-slate-600 max-w-3xl leading-relaxed">${esc(seo?.answerFirst || tool.shortDescription)}</p>
            <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold inline-block">
              Privacy Guarantee: ${esc(tool.privacyMessage)}
            </div>
          </header>

          <div class="p-6 bg-slate-50 border border-slate-200 rounded-xl my-6 text-center text-sm text-slate-600">
            Interactive ${esc(tool.canonicalName)} widget loads and processes in your browser session.
          </div>

          ${instructionsHtml}
          ${useCasesHtml}
          ${topicalSectionsHtml}
          ${faqsHtml}
          ${relatedToolsHtml}
        </article>
      `;
    }
  } else if (parts[0] === 'category' && parts[1]) {
    // Category Page
    const cat = CATEGORIES.find((c) => c.slug === parts[1]);
    const catSeo = getCategoryPageContent(parts[1]);
    const catTools = (getToolsByCategory ? getToolsByCategory(parts[1]) : []).filter(
      (t) => t.status === 'live'
    );

    contentHtml = `
      <article class="space-y-6">
        <nav aria-label="Breadcrumb" class="text-xs text-slate-500 space-x-2">
          <a href="/" class="hover:underline">Home</a> &gt;
          <span class="text-slate-800 font-semibold">${esc(cat?.name || parts[1])}</span>
        </nav>

        <header class="space-y-2">
          <h1 class="text-3xl font-extrabold text-slate-900">${esc(cat?.name || parts[1])}</h1>
          <p class="text-base text-slate-600 max-w-3xl">${esc(catSeo?.intro || cat?.description || meta.description)}</p>
        </header>

        <section class="space-y-4 mt-6">
          <h2 class="text-2xl font-bold">Tools in this Collection</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${catTools
              .map(
                (t) => `
              <div class="p-4 border rounded-xl bg-white shadow-sm space-y-2">
                <h3 class="font-bold text-base"><a href="/tools/${esc(t.slug)}" class="text-indigo-600 hover:underline">${esc(t.canonicalName)}</a></h3>
                <p class="text-xs text-slate-500">${esc(t.shortDescription)}</p>
              </div>`
              )
              .join('')}
          </div>
        </section>
      </article>
    `;
  } else if (parts[0] === 'blog' && parts[1]) {
    // Blog Post
    const post = getBlogPostBySlug(parts[1]);
    if (post) {
      const relatedTool = post.relatedToolSlug
        ? TOOLS.find((t) => t.slug === post.relatedToolSlug)
        : null;

      const faqsHtml = post.faqs?.length
        ? `<section class="space-y-4 mt-8 pt-6 border-t">
            <h2 class="text-2xl font-bold">Frequently Asked Questions</h2>
            <div class="space-y-3">
              ${post.faqs
                .map(
                  (f) => `
                <div class="p-4 bg-slate-50 border rounded-lg">
                  <h3 class="font-semibold text-slate-900">${esc(f.question)}</h3>
                  <p class="text-sm text-slate-600 mt-1">${esc(f.answer)}</p>
                </div>`
                )
                .join('')}
            </div>
          </section>`
        : '';

      const ctaHtml = relatedTool
        ? `<div class="p-6 bg-indigo-50 border border-indigo-200 rounded-2xl text-center space-y-2 my-8">
            <h3 class="text-lg font-bold text-indigo-900">Try the Free Online Tool</h3>
            <p class="text-sm text-indigo-700">${esc(relatedTool.shortDescription)}</p>
            <div class="pt-2">
              <a href="/tools/${esc(relatedTool.slug)}" class="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700">Open ${esc(relatedTool.canonicalName)} &rarr;</a>
            </div>
          </div>`
        : '';

      contentHtml = `
        <article class="space-y-6 max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" class="text-xs text-slate-500 space-x-2">
            <a href="/" class="hover:underline">Home</a> &gt;
            <a href="/blog" class="hover:underline">Blog</a> &gt;
            <span class="text-slate-800 font-semibold">${esc(post.title)}</span>
          </nav>

          <header class="space-y-3">
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600">${esc(post.category)}</span>
            <h1 class="text-3xl sm:text-5xl font-extrabold text-slate-900">${esc(post.title)}</h1>
            <p class="text-lg text-slate-600 leading-relaxed">${esc(post.description)}</p>
            <p class="text-xs text-slate-400">By ${esc(post.author)} &bull; ${esc(post.publishDate)} &bull; ${post.readTimeMinutes} min read</p>
          </header>

          ${ctaHtml}

          <div class="prose max-w-none text-slate-800 my-6">
            ${mdToHtml(post.contentMarkdown)}
          </div>

          ${faqsHtml}
          ${ctaHtml}
        </article>
      `;
    }
  } else if (parts[0] === 'blog') {
    // Blog Hub
    contentHtml = `
      <div class="space-y-6">
        <header class="space-y-2">
          <h1 class="text-3xl font-extrabold text-slate-900">ToolVerse Guides &amp; Blog</h1>
          <p class="text-base text-slate-600">Practical guides, workflows, and tutorials for privacy-first tools, SEO optimization, and calculators.</p>
        </header>
        <p class="text-sm text-slate-500">Explore comprehensive how-to tutorials for each of our 113+ free online utilities.</p>
      </div>
    `;
  } else if (parts[0] === 'jobs' && parts[1]) {
    // Job landing
    const job = getJobPageContent?.(parts[1]);
    const postings = job?.featuredPostings || [];
    const postingsHtml = postings.length
      ? `<section class="space-y-4 mt-6">
          <h2 class="text-2xl font-bold text-slate-900">Featured Verified Job Openings</h2>
          <div class="space-y-4">
            ${postings
              .map(
                (p) => `
              <div class="p-5 border rounded-xl bg-white shadow-sm space-y-2">
                <div class="flex items-center justify-between">
                  <h3 class="font-bold text-lg text-slate-900">${esc(p.title)}</h3>
                  <span class="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">${esc(p.employmentType)}</span>
                </div>
                <p class="text-sm text-slate-600 font-medium">${esc(p.hiringOrganization.name)} &bull; ${esc(p.jobLocation?.locality || (p.jobLocationType === 'TELECOMMUTE' ? 'Remote Worldwide' : 'United States'))}</p>
                <p class="text-sm text-slate-700 leading-relaxed">${esc(p.description)}</p>
                ${p.salary ? `<p class="text-xs font-semibold text-emerald-700">Estimated Compensation: ${esc(p.salary.currency)} ${p.salary.value.toLocaleString()} / ${esc(p.salary.unitText.toLowerCase())}</p>` : ''}
                <div class="pt-2">
                  <a href="/tools/global-job-finder" class="inline-block text-xs font-bold text-indigo-600 hover:underline">Apply &amp; Search Similar Jobs &rarr;</a>
                </div>
              </div>`
              )
              .join('')}
          </div>
        </section>`
      : '';

    contentHtml = `
      <article class="space-y-6">
        <nav aria-label="Breadcrumb" class="text-xs text-slate-500 space-x-2">
          <a href="/" class="hover:underline">Home</a> &gt;
          <a href="/tools/global-job-finder" class="hover:underline">Job Finder</a> &gt;
          <span class="text-slate-800 font-semibold">${esc(job?.title || meta.title)}</span>
        </nav>
        <header class="space-y-2">
          <h1 class="text-3xl font-extrabold text-slate-900">${esc(job?.title || meta.title)}</h1>
          <p class="text-base text-slate-600">${esc(job?.intro || job?.subtitle || meta.description)}</p>
        </header>
        ${postingsHtml}
        <div class="p-6 bg-slate-50 border rounded-xl text-center space-y-2 my-6">
          <h3 class="font-bold text-base text-slate-900">Search Real-Time Global Job Postings</h3>
          <p class="text-xs text-slate-500">Live multi-source engine indexing USA, UK, UAE, Canada, and Pakistan portals.</p>
          <a href="/tools/global-job-finder" class="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm">Open 1-Click Job Finder &rarr;</a>
        </div>
      </article>
    `;
  } else if (parts[0] === 'business') {
    if (parts[1] === 'register') {
      contentHtml = `
        <article class="space-y-6 max-w-4xl mx-auto">
          <header class="space-y-2">
            <h1 class="text-3xl font-extrabold text-slate-900">List &amp; Register Your Business</h1>
            <p class="text-base text-slate-600">Create a permanent Toolverse Business ID, get verified, and generate custom vector QR badges for physical shopfronts.</p>
          </header>
          <div class="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <p class="text-sm text-slate-600">Loading interactive 4-step business registration portal...</p>
          </div>
        </article>
      `;
    } else if (parts[1] === 'bidding') {
      contentHtml = `
        <article class="space-y-6">
          <header class="space-y-2">
            <h1 class="text-3xl font-extrabold text-slate-900">Category Top 3 Sponsored Bidding Marketplace</h1>
            <p class="text-base text-slate-600">Compete for legitimate sponsored category visibility at positions #1, #2, and #3.</p>
          </header>
        </article>
      `;
    } else if (parts[1]) {
      const bizName = parts[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      contentHtml = `
        <article class="space-y-6">
          <header class="space-y-3">
            <div class="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">Verified Business Profile</div>
            <h1 class="text-4xl font-extrabold text-slate-900">${esc(bizName)}</h1>
            <p class="text-slate-600">${esc(meta.description)}</p>
          </header>
          <div class="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
            <h2 class="text-xl font-bold mb-2">Customer Reviews &amp; Information</h2>
            <p class="text-sm text-slate-600">View customer feedback, business hours, services, and verified credentials.</p>
          </div>
        </article>
      `;
    } else {
      contentHtml = `
        <article class="space-y-6">
          <header class="space-y-2">
            <h1 class="text-3xl font-extrabold text-slate-900">Global Business Directory &amp; Digital Identity Network</h1>
            <p class="text-base text-slate-600">Discover verified local businesses, SaaS tools, agencies, restaurants, and online services.</p>
          </header>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div class="p-5 border rounded-2xl bg-white shadow-sm">
              <h3 class="font-bold text-lg"><a href="/business/ali-barber-studio" class="text-indigo-600 hover:underline">Ali Barber Studio</a></h3>
              <p class="text-xs text-slate-500 mt-1">Lahore, Pakistan &bull; Barber Shop &amp; Grooming</p>
            </div>
            <div class="p-5 border rounded-2xl bg-white shadow-sm">
              <h3 class="font-bold text-lg"><a href="/business/apex-digital-marketing" class="text-indigo-600 hover:underline">Apex Digital Marketing</a></h3>
              <p class="text-xs text-slate-500 mt-1">London, UK &bull; Digital Marketing Agency</p>
            </div>
            <div class="p-5 border rounded-2xl bg-white shadow-sm">
              <h3 class="font-bold text-lg"><a href="/business/blue-sky-dentistry" class="text-indigo-600 hover:underline">Blue Sky Dentistry</a></h3>
              <p class="text-xs text-slate-500 mt-1">Toronto, Canada &bull; Dental Clinic &amp; Care</p>
            </div>
          </div>
        </article>
      `;
    }
  } else if (parts[0] === 'b' && parts[1]) {
    contentHtml = `
      <article class="space-y-4 max-w-xl mx-auto text-center py-12">
        <h1 class="text-3xl font-extrabold">Permanent Toolverse Business QR Resolver</h1>
        <p class="text-slate-600">Resolving Business ID <code class="bg-slate-100 px-2 py-1 rounded font-mono text-indigo-600">${esc(parts[1])}</code> to canonical public profile...</p>
      </article>
    `;
  } else if (parts[0] === 'business-qr') {
    contentHtml = `
      <article class="space-y-6">
        <header class="space-y-2">
          <h1 class="text-3xl font-extrabold text-slate-900">Printable Vector QR Identity Generator</h1>
          <p class="text-base text-slate-600">Generate high-resolution printable Toolverse QR identity badges for shop windows, counters, and menus.</p>
        </header>
      </article>
    `;
  } else if (parts[0] === 'how-to') {
    contentHtml = `
      <article class="space-y-6">
        <header class="space-y-2">
          <h1 class="text-3xl font-extrabold text-slate-900">Toolverse How-To Center &amp; Guides</h1>
          <p class="text-base text-slate-600">Official tutorials on business profile registration, verification, printable QR badges, and reviews.</p>
        </header>
      </article>
    `;
  } else if (parts[0] === 'admin') {
    contentHtml = `
      <article class="space-y-6 max-w-xl mx-auto py-8">
        <header class="text-center space-y-2">
          <h1 class="text-3xl font-extrabold text-slate-900">Toolverse Admin Control Center</h1>
          <p class="text-sm text-slate-600">Secure Role-Based Access Control (RBAC) Admin Portal.</p>
        </header>
      </article>
    `;
  } else {
    // Generic fallback (e.g. Legal)
    contentHtml = `
      <article class="space-y-4">
        <h1 class="text-3xl font-extrabold">${esc(meta.title)}</h1>
        <p class="text-base text-slate-600">${esc(meta.description)}</p>
      </article>
    `;
  }

  return `
      <header class="p-4 bg-white border-b">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" class="font-bold text-xl text-indigo-600">ToolVerse</a>
          <nav class="space-x-4 text-sm font-medium">
            <a href="/category/pdf-document-tools" class="text-slate-600 hover:text-indigo-600">PDF Tools</a>
            <a href="/category/image-design-tools" class="text-slate-600 hover:text-indigo-600">Image Tools</a>
            <a href="/category/seo-url-tools" class="text-slate-600 hover:text-indigo-600">SEO Tools</a>
            <a href="/blog" class="text-slate-600 hover:text-indigo-600">Guides &amp; Blog</a>
            <a href="/legal/about" class="text-slate-600 hover:text-indigo-600">About</a>
          </nav>
        </div>
      </header>
      <main class="max-w-7xl mx-auto px-4 py-8">
        <!-- prerender:${esc(pathname)} -->
        ${contentHtml}
      </main>
      <footer class="p-6 bg-slate-900 text-slate-400 border-t text-center text-xs space-y-2 mt-12">
        <p>&copy; 2026 ToolVerse. Free, fast, privacy-first online tools. All file conversions processed locally in browser.</p>
        <p class="space-x-3">
          <a href="/legal/privacy-policy" class="hover:text-white">Privacy</a>
          <a href="/legal/terms-of-use" class="hover:text-white">Terms</a>
          <a href="/legal/editorial-policy" class="hover:text-white">Editorial</a>
          <a href="/legal/contact" class="hover:text-white">Contact</a>
        </p>
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
    const { TOOLS, CATEGORIES, getToolsByCategory } = await vite.ssrLoadModule('/lib/tools/registry.ts');
    const { BLOG_POSTS, getBlogPostBySlug } = await vite.ssrLoadModule('/lib/blog/posts.ts');
    const { getToolPageContent } = await vite.ssrLoadModule('/lib/seo/toolPageContent.ts');
    const { getCategoryPageContent } = await vite.ssrLoadModule('/lib/seo/categoryPageContent.ts');
    const { getJobPageContent } = await vite.ssrLoadModule('/lib/seo/jobPageContent.ts');

    const { PRODUCTS } = await vite.ssrLoadModule('/lib/products/registry.ts');
    const { ALTERNATIVE_PAGES } = await vite.ssrLoadModule('/lib/products/alternativesRegistry.ts');
    const { COMPARISON_PAGES } = await vite.ssrLoadModule('/lib/products/comparisonsRegistry.ts');
    const { QUESTIONS } = await vite.ssrLoadModule('/lib/products/questionsRegistry.ts');
    const { COLLECTIONS } = await vite.ssrLoadModule('/lib/products/collectionsRegistry.ts');

    const deps = {
      TOOLS,
      CATEGORIES,
      getToolsByCategory,
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

    // Product Discovery & Ecosystem Routes
    routes.push('/products');
    for (const prod of PRODUCTS) {
      if (prod.status === 'approved') routes.push(`/products/${prod.slug}`);
    }
    routes.push('/alternatives');
    for (const alt of ALTERNATIVE_PAGES) {
      routes.push(`/alternatives/${alt.slug}`);
    }
    for (const comp of COMPARISON_PAGES) {
      routes.push(`/compare/${comp.slug}`);
    }
    routes.push('/questions');
    for (const q of QUESTIONS) {
      routes.push(`/questions/${q.slug}`);
    }
    routes.push('/collections');
    for (const col of COLLECTIONS) {
      routes.push(`/collections/${col.slug}`);
    }
    routes.push('/submit');
    routes.push('/badges');
    routes.push('/claim');

    // Business Discovery & Identity System Routes
    routes.push('/business');
    for (const biz of ['ali-barber-studio', 'apex-digital-marketing', 'blue-sky-dentistry', 'nexus-saas-labs']) {
      routes.push(`/business/${biz}`);
    }
    for (const bId of ['TV-BIZ-8F4K2P', 'TV-BIZ-99X2M1', 'TV-BIZ-33K7L9', 'TV-BIZ-77P4R2']) {
      routes.push(`/b/${bId}`);
    }
    routes.push('/business/register');
    routes.push('/business/bidding');
    routes.push('/business-qr');
    routes.push('/admin/login');

    // How-To Guides Hub & Detail Shells
    routes.push('/how-to');
    for (const ht of [
      'how-to-create-a-business-profile',
      'how-to-verify-your-business',
      'how-to-get-a-toolverse-business-id',
      'how-to-generate-a-business-qr-code',
      'how-to-print-your-toolverse-qr',
      'how-to-collect-honest-customer-reviews',
      'how-business-rankings-work',
      'how-sponsored-ranking-works',
      'how-to-claim-a-business',
      'how-to-report-a-fake-business',
    ]) {
      routes.push(`/how-to/${ht}`);
    }

    // Global Travel Intelligence Platform Routes
    routes.push('/travel');
    routes.push('/travel/passport');
    routes.push('/travel/embassies');
    routes.push('/travel/destinations');
    routes.push('/travel/jobs');
    routes.push('/travel/planner');
    routes.push('/admin/travel');
    routes.push('/travel/PK/GB');
    routes.push('/travel/PK/TR');
    routes.push('/travel/PK/AE');

    // Startup Launch & Discovery Platform Routes
    routes.push('/startups');
    routes.push('/submit-startup');
    for (const s of ['nexus-ai-writer', 'devflow-database-studio', 'taskpulse-workspace', 'rankpulse-backlink-monitor']) {
      routes.push(`/startups/${s}`);
    }

    // Guest Posting & Publisher Marketplace Routes
    routes.push('/guest-posts');
    routes.push('/guest-posts/create-pitch');
    routes.push('/become-a-publisher');
    for (const p of ['tech-vision-journal', 'startup-builder-daily', 'seo-growth-digest']) {
      routes.push(`/publishers/${p}`);
    }

    // SEO Suite, hubs, pricing
    routes.push('/seo');
    routes.push('/seo-tools');
    routes.push('/tools');
    routes.push('/pricing');
    routes.push('/study');
    routes.push('/immigration');
    routes.push('/us');
    routes.push('/uk');
    routes.push('/ca');
    routes.push('/au');
    routes.push('/passport-photos');
    routes.push('/dashboard');

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
