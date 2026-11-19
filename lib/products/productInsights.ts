/**
 * Shared, data-derived "insights" for product pages (/products/[slug]).
 * Used by BOTH the React page and scripts/prerender.mjs so crawlers and users see the same content.
 * Everything here is either computed from the product record or hand-written per category,
 * so no ratings, review counts or unverifiable claims are introduced.
 */
import type { Product } from './types';

export interface ProductInsightLink {
  href: string;
  label: string;
  note?: string;
}

export interface ProductInsights {
  intro: string;
  glance: { label: string; value: string }[];
  audienceHeading: string;
  audience: string;
  chooseTips: string[];
  similar: ProductInsightLink[];
  comparisons: ProductInsightLink[];
  tools: ProductInsightLink[];
  faqs: { question: string; answer: string }[];
}

interface CategoryGuide {
  audience: (p: Product) => string;
  tips: string[];
  tools: string[];
}

const CATEGORY_GUIDES: Record<string, CategoryGuide> = {
  'ai-tools': {
    audience: (p) =>
      `${p.name} suits people who want AI help with writing, research, coding or images without building their own model. Treat AI output as a first draft: check facts, numbers and citations before you publish or send anything, and do not paste confidential client data unless your plan's data-use terms allow it.`,
    tips: [
      'Test the free tier on your real tasks (an email, a report outline, a bug) before paying.',
      'Check the data policy: whether your prompts are used for training, and whether a business plan turns that off.',
      'Compare usage limits, not just the monthly price; heavy users hit message caps first.',
    ],
    tools: ['chatgpt-prompt-generator', 'ai-sentence-humanizer', 'midjourney-prompt-builder', 'word-counter'],
  },
  'developer-tools': {
    audience: (p) =>
      `${p.name} is aimed at developers and engineering teams. The deciding factors are usually how well it fits your existing stack (language, cloud, CI), how pricing scales with usage or seats, and whether you can self-host or export your data if you leave.`,
    tips: [
      'Run a small proof of concept on a real repository or service, not a demo project.',
      'Model the cost at 10x your current usage; usage-based pricing can grow quickly.',
      'Check SSO, audit logs and data residency if you work for a company with compliance rules.',
    ],
    tools: ['json-formatter', 'regex-tester', 'jwt-decoder', 'sql-formatter', 'curl-to-code-converter'],
  },
  'design-creative': {
    audience: (p) =>
      `${p.name} fits designers, marketers and creators who make visuals for web, social media or print. Beginners usually care most about templates and ease of use; professionals care about vector precision, collaboration, export formats and brand controls.`,
    tips: [
      'Check export formats (SVG, PDF, PNG, transparent backgrounds) on the plan you will actually buy.',
      'Look at the commercial-use licence for templates, stock photos and AI-generated assets.',
      'Try real-time collaboration with a teammate before rolling it out to a team.',
    ],
    tools: ['image-compressor', 'image-resizer', 'svg-to-png-converter', 'css-gradient-shadow-generator', 'social-media-image-resizer'],
  },
  'productivity-workspaces': {
    audience: (p) =>
      `${p.name} is for individuals and teams organising notes, documents, tasks or projects. The best choice depends on how structured you want to be, whether you need offline access, and how easily you can export everything if you switch tools later.`,
    tips: [
      'Move one real project in for two weeks before committing the whole team.',
      'Check export options (Markdown, PDF, CSV) so your data is not locked in.',
      'Compare the free plan limits on storage, version history and number of members.',
    ],
    tools: ['pdf-merge', 'pdf-compress', 'word-counter', 'text-diff-checker', 'markdown-html-converter'],
  },
  'communication-collaboration': {
    audience: (p) =>
      `${p.name} serves teams that need chat, meetings or shared workspaces. Adoption matters more than features: the right tool is the one your team and clients will actually open, so check what your partners already use and how well it works on mobile and slow connections.`,
    tips: [
      'Check meeting length and participant limits on the free plan.',
      'Confirm message history and file retention limits before relying on it as a record.',
      'Look at admin controls (guest access, retention, export) if you handle client data.',
    ],
    tools: ['email-proofreading-checklist', 'qr-code-generator', 'text-case-converter', 'word-counter'],
  },
  'marketing-seo': {
    audience: (p) =>
      `${p.name} is for marketers, bloggers, agencies and site owners working on traffic, email or content. Data tools differ a lot in database size and accuracy for smaller countries and languages, so test with keywords and competitors from your own market.`,
    tips: [
      'Check data coverage for your country and language, not just the US.',
      'Compare project, keyword and report limits per plan; they matter more than feature lists.',
      'Use free checks first (on-page audit, meta tags, UTM links) before buying a full suite.',
    ],
    tools: ['seo-audit-analyzer', 'keyword-research-tool', 'meta-tag-generator', 'utm-builder', 'backlink-checker-analyzer'],
  },
  'business-finance': {
    audience: (p) =>
      `${p.name} is for founders, freelancers and small businesses handling payments, sales or money management. Before choosing, compare total fees (percentage, fixed fee, currency conversion and payout costs) and check whether the service fully supports your country.`,
    tips: [
      'Calculate fees on a typical transaction, including currency conversion.',
      'Confirm the service is available for businesses registered in your country.',
      'Check payout times and any reserve or hold policies for new accounts.',
    ],
    tools: ['invoice-generator', 'paypal-stripe-fee-calculator', 'profit-margin-calculator', 'break-even-calculator', 'quotation-generator'],
  },
  'no-code-automation': {
    audience: (p) =>
      `${p.name} is for people who want to automate workflows or build apps without writing much code. Watch how pricing counts usage (tasks, runs, records or operations), because a few busy automations can push you into a higher plan.`,
    tips: [
      'Estimate monthly task or operation counts before choosing a plan.',
      'Check which of your apps have native integrations versus webhooks only.',
      'Plan error handling: how failed runs are reported and retried.',
    ],
    tools: ['json-to-csv', 'csv-to-excel', 'cron-expression-generator', 'utm-builder', 'json-formatter'],
  },
};

const DEFAULT_GUIDE: CategoryGuide = {
  audience: (p) =>
    `${p.name} is worth comparing with similar products before you commit. Start on a free plan or trial, test it on a real task, and check how easily you can export your data later.`,
  tips: ['Test on real work, not a demo.', 'Compare total cost per year, not per month.', 'Check data export options.'],
  tools: ['pdf-merge', 'image-compressor', 'qr-code-generator'],
};

function priceNumber(price: string): number {
  const n = parseFloat(String(price || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function getProductPricingSummary(p: Product): { hasFree: boolean; cheapestPaid?: string; text: string } {
  const plans = p.pricingPlans || [];
  const hasFree = plans.some((pl) => priceNumber(pl.price) === 0 && /\d/.test(String(pl.price))) || plans.some((pl) => pl.period === 'free');
  const paid = plans.filter((pl) => priceNumber(pl.price) > 0).sort((a, b) => priceNumber(a.price) - priceNumber(b.price));
  const cheapestPaid = paid[0] ? `${paid[0].price}${paid[0].period && paid[0].period !== 'free' ? ` per ${paid[0].period}` : ''}` : undefined;
  let text: string;
  if (hasFree && cheapestPaid) text = `${p.name} has a free plan, and paid plans start at ${cheapestPaid} (${p.pricingModel} model).`;
  else if (hasFree) text = `${p.name} can be used for free (${p.pricingModel} model).`;
  else if (cheapestPaid) text = `${p.name} has no free plan listed; paid plans start at ${cheapestPaid}.`;
  else text = `${p.name} uses a ${p.pricingModel} pricing model; check the official site for current prices.`;
  return { hasFree, cheapestPaid, text };
}

export function buildProductInsights(
  p: Product,
  allProducts: Product[],
  comparisons: { slug: string; productASlug: string; productBSlug: string; title?: string }[],
  tools: { slug: string; canonicalName: string; shortDescription?: string; status?: string }[],
  alternativeSlugs: string[] = []
): ProductInsights {
  const guide = CATEGORY_GUIDES[p.categorySlug] || DEFAULT_GUIDE;
  const pricing = getProductPricingSummary(p);
  const platforms = (p.platforms || []).join(', ') || 'Web';
  const approved = allProducts.filter((x) => x.status === 'approved' && x.slug !== p.slug);

  const similarList: Product[] = [];
  for (const s of p.relatedProductSlugs || []) {
    const hit = approved.find((x) => x.slug === s);
    if (hit && !similarList.includes(hit)) similarList.push(hit);
  }
  for (const x of approved) {
    if (similarList.length >= 6) break;
    if (x.categorySlug === p.categorySlug && !similarList.includes(x)) similarList.push(x);
  }
  const similar = similarList.slice(0, 6).map((x) => ({ href: `/products/${x.slug}`, label: x.name, note: x.tagline }));

  const comps: ProductInsightLink[] = comparisons
    .filter((c) => c.productASlug === p.slug || c.productBSlug === p.slug)
    .map((c) => {
      const other = allProducts.find((x) => x.slug === (c.productASlug === p.slug ? c.productBSlug : c.productASlug));
      return { href: `/compare/${c.slug}`, label: `${p.name} vs ${other?.name || 'alternative'}` };
    });
  if (alternativeSlugs.includes(p.slug)) comps.unshift({ href: `/alternatives/${p.slug}`, label: `Best alternatives to ${p.name}` });

  const toolSlugs = [...(p.relatedToolverseToolSlugs || []), ...guide.tools];
  const seen = new Set<string>();
  const toolLinks: ProductInsightLink[] = [];
  for (const slug of toolSlugs) {
    if (seen.has(slug)) continue;
    seen.add(slug);
    const t = tools.find((x) => x.slug === slug && (x.status === undefined || x.status === 'live'));
    if (t) toolLinks.push({ href: `/tools/${t.slug}`, label: t.canonicalName, note: t.shortDescription });
    if (toolLinks.length >= 6) break;
  }

  const altNames = similarList.slice(0, 3).map((x) => x.name);
  const article = /^[aeiou]/i.test(p.categoryName) ? 'an' : 'a';
  const intro = `${p.name} is ${article} ${p.categoryName.toLowerCase()} product from ${p.companyName}${p.country ? ` (${p.country})` : ''}. ${pricing.text} It is available on ${platforms}. This page summarises its main features, pricing plans, strengths and weaknesses${altNames.length ? `, and how it compares with ${altNames.join(', ')}` : ''}.`;

  const glance = [
    { label: 'Made by', value: `${p.companyName}${p.country ? `, ${p.country}` : ''}` },
    { label: 'Category', value: p.categoryName },
    { label: 'Pricing model', value: p.pricingModel },
    { label: 'Free plan', value: pricing.hasFree ? 'Yes' : 'No free plan listed' },
    ...(pricing.cheapestPaid ? [{ label: 'Paid plans from', value: pricing.cheapestPaid }] : []),
    { label: 'Platforms', value: platforms },
  ];

  const faqs = [
    { question: `Is ${p.name} free?`, answer: `${pricing.text} Prices change often, so confirm on the official ${p.name} pricing page before you buy.` },
    { question: `What platforms does ${p.name} run on?`, answer: `${p.name} is available on ${platforms}.` },
    { question: `Who makes ${p.name}?`, answer: `${p.name} is made by ${p.companyName}${p.country ? `, based in ${p.country}` : ''}.` },
    ...(altNames.length
      ? [{ question: `What are good alternatives to ${p.name}?`, answer: `Popular alternatives in ${p.categoryName} include ${altNames.join(', ')}. Compare free plans, usage limits and data-export options before switching.` }]
      : []),
  ];

  return {
    intro,
    glance,
    audienceHeading: `Who ${p.name} is for`,
    audience: guide.audience(p),
    chooseTips: guide.tips,
    similar,
    comparisons: comps,
    tools: toolLinks,
    faqs,
  };
}
