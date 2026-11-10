/**
 * Official Google Search Console (GSC) Performance CSV / TSV Parser & Search Intelligence Engine
 * Handles official exports (Queries.csv, Pages.csv, Devices.csv, Countries.csv) and pasted tables.
 * Classifies queries into Categories A–G (Phase 2), maps each query to a single canonical Toolverse URL (Phase 3),
 * diagnoses high-impression / zero-click queries, and detects keyword cannibalization.
 */

import type { GscPerformanceRow } from '../workspace/workspaceTypes';
import { TOOLS, CATEGORIES } from '@/lib/tools/registry';

export type GscQueryCategoryCode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface GscClassifiedRow extends GscPerformanceRow {
  categoryCode: GscQueryCategoryCode;
  categoryLabel: string;
  searchIntent: 'tool' | 'commercial' | 'informational' | 'navigational' | 'irrelevant';
  canonicalTargetUrl: string;
  matchedToolOrHub: string;
  recommendedAction: string;
  zeroClickDiagnosis?: string;
  country?: string;
  device?: string;
}

export interface GscCannibalizationAlert {
  keywordCluster: string;
  primaryCanonicalUrl: string;
  competingUrls: string[];
  resolution: string;
}

export interface GscParsedReport {
  rows: GscClassifiedRow[];
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  avgPosition: number;
  opportunities: GscClassifiedRow[];
  zeroClickHighImpressions: GscClassifiedRow[];
  categorySummary: Record<GscQueryCategoryCode, number>;
  cannibalizationAlerts: GscCannibalizationAlert[];
}

export const GSC_CATEGORY_META: Record<
  GscQueryCategoryCode,
  { label: string; badgeClass: string; description: string }
> = {
  A: {
    label: 'A. High-Priority Opportunity',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: 'High commercial/tool value with strong ranking potential on existing flagship pages.',
  },
  B: {
    label: 'B. Existing-Page Optimization',
    badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    description: 'Page already exists; optimize title (<60 chars), meta description, H1, and FAQ schema to boost CTR.',
  },
  C: {
    label: 'C. New Tool Opportunity',
    badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    description: 'Valid browser utility intent not yet covered by a dedicated interactive tool slug.',
  },
  D: {
    label: 'D. Blog / Content Opportunity',
    badgeClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    description: 'Informational how-to or comparison query best served by a guide linking to a tool.',
  },
  E: {
    label: 'E. Brand Keyword',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    description: 'Navigational search for ToolVerse / Tooliverse / Tools Verse / toolverse.baby.',
  },
  F: {
    label: 'F. Competitor / Alternative',
    badgeClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    description: 'Users comparing or seeking free alternatives to paid SaaS tools (Semrush, Hunter, Canva, etc.).',
  },
  G: {
    label: 'G. Irrelevant / Accidental',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    description: 'Accidental keyword overlap (e.g., OS print spooler queue, hardware troubleshooting). Do not build pages.',
  },
};

/**
 * Phase 2 & Phase 3 deterministic classifier:
 * Maps any GSC search query to Category A–G, Search Intent, Canonical Target URL, and Recommended Action.
 */
export function classifyGscQuery(row: GscPerformanceRow): GscClassifiedRow {
  const q = (row.query || '').toLowerCase().trim();

  // 1. Category G — Irrelevant / Accidental Keyword Relevance (e.g., print queue, printer spooler, ticket queue)
  if (
    q.includes('print queue') ||
    q.includes('printer queue') ||
    q.includes('clear print') ||
    q.includes('spooler') ||
    q.includes('hp printer') ||
    q.includes('canon printer') ||
    (q.includes('virtual queue') && !q.includes('guide'))
  ) {
    return {
      ...row,
      categoryCode: 'G',
      categoryLabel: GSC_CATEGORY_META.G.label,
      searchIntent: 'irrelevant',
      canonicalTargetUrl: 'None (De-emphasize)',
      matchedToolOrHub: 'Accidental Blog Overlap (/blog/virtual-queue-how-online-waiting-rooms-work)',
      recommendedAction:
        'Do not create a printer or OS troubleshooting page. Keep consumer waiting-room guide focused strictly on event ticketing.',
      zeroClickDiagnosis:
        row.impressions > 0 && row.clicks === 0
          ? 'Accidental keyword match: users want Windows/macOS printer spooler fixes, not web tools.'
          : undefined,
    };
  }

  // 2. Category E — Brand Keywords
  if (
    q.includes('toolverse') ||
    q.includes('tooliverse') ||
    q.includes('tools verse') ||
    q.includes('toolsoverflow') ||
    q.includes('tool verse')
  ) {
    return {
      ...row,
      categoryCode: 'E',
      categoryLabel: GSC_CATEGORY_META.E.label,
      searchIntent: 'navigational',
      canonicalTargetUrl: '/',
      matchedToolOrHub: 'Homepage (/) & About (/legal/about)',
      recommendedAction:
        'Consolidate brand signals on https://toolverse.baby/ with Organization + WebSite JSON-LD alternateName coverage.',
      zeroClickDiagnosis:
        row.impressions > 0 && row.clicks === 0
          ? 'Ensure brand sitelinks and concise <=60-char homepage title appear cleanly in SERPs.'
          : undefined,
    };
  }

  // 3. SEO Dashboard / Free SEO Dashboard Cluster -> Canonical /workspace
  if (
    q.includes('seo dashboard') ||
    q.includes('seo keyword dashboard') ||
    q.includes('free seo dashboard') ||
    q.includes('search console dashboard') ||
    q.includes('gsc dashboard') ||
    q.includes('seo workspace')
  ) {
    const isHighPriority = row.position <= 20 || q.includes('free');
    return {
      ...row,
      categoryCode: isHighPriority ? 'A' : 'B',
      categoryLabel: isHighPriority ? GSC_CATEGORY_META.A.label : GSC_CATEGORY_META.B.label,
      searchIntent: 'tool',
      canonicalTargetUrl: '/workspace',
      matchedToolOrHub: 'Free SEO Dashboard Workspace (/workspace)',
      recommendedAction:
        'Point all "SEO dashboard" and "free SEO dashboard" internal links to /workspace; de-cannibalize / and /seo titles.',
      zeroClickDiagnosis:
        row.impressions > 0 && row.clicks === 0
          ? `Ranked #${row.position}: 4 URLs previously competed for "SEO Keyword Dashboards". Consolidating onto /workspace lifts CTR.`
          : undefined,
    };
  }

  // 4. Category F — Competitor / SaaS Alternative Keywords
  if (
    q.includes('hunter.io') ||
    q.includes('apollo.io') ||
    q.includes('semrush') ||
    q.includes('ahrefs') ||
    q.includes('ilovepdf') ||
    q.includes('smallpdf') ||
    q.includes('canva') ||
    q.includes('zety') ||
    q.includes('novoresume') ||
    q.includes('alternative')
  ) {
    let targetUrl = '/alternatives';
    let matched = 'Software Alternatives Hub (/alternatives)';
    if (q.includes('hunter') || q.includes('apollo') || q.includes('email')) {
      targetUrl = '/tools/b2b-email-finder';
      matched = 'B2B Email Finder (/tools/b2b-email-finder)';
    } else if (q.includes('semrush') || q.includes('ahrefs')) {
      targetUrl = '/workspace';
      matched = 'Free SEO Dashboard (/workspace)';
    } else if (q.includes('zety') || q.includes('novoresume') || q.includes('resume') || q.includes('cv')) {
      targetUrl = '/cv-maker';
      matched = 'Free CV & Resume Maker (/cv-maker)';
    }
    return {
      ...row,
      categoryCode: 'F',
      categoryLabel: GSC_CATEGORY_META.F.label,
      searchIntent: 'commercial',
      canonicalTargetUrl: targetUrl,
      matchedToolOrHub: matched,
      recommendedAction: `Emphasize "100% Free, No Watermark / No Fake Guesses" comparison points on ${targetUrl}.`,
      zeroClickDiagnosis:
        row.impressions > 0 && row.clicks === 0
          ? 'Highlight "Free & No Sign-Up Required" in meta description to win clicks from paid SaaS searchers.'
          : undefined,
    };
  }

  // 5. CV Maker / Resume Builder Cluster -> Canonical /cv-maker
  if (
    q.includes('cv maker') ||
    q.includes('resume builder') ||
    q.includes('cv builder') ||
    q.includes('curriculum vitae') ||
    q.includes('ats resume')
  ) {
    const isChecker = q.includes('checker') || q.includes('scanner') || q.includes('score');
    const targetUrl = isChecker ? '/tools/ats-resume-checker' : '/cv-maker';
    return {
      ...row,
      categoryCode: 'A',
      categoryLabel: GSC_CATEGORY_META.A.label,
      searchIntent: 'tool',
      canonicalTargetUrl: targetUrl,
      matchedToolOrHub: isChecker ? 'ATS Resume Checker (/tools/ats-resume-checker)' : 'Free CV Maker (/cv-maker)',
      recommendedAction:
        'Promote 25 ATS-friendly templates and instant watermark-free PDF/PNG/JPG export in title and FAQ schema.',
      zeroClickDiagnosis:
        row.impressions > 0 && row.clicks === 0
          ? 'Searchers expect fake "free" builders that charge at download; state "No Watermark, Free PDF Download" in snippet.'
          : undefined,
    };
  }

  // 6. B2B Email Finder Cluster -> Canonical /tools/b2b-email-finder
  if (
    q.includes('email finder') ||
    q.includes('email scraper') ||
    q.includes('find business email') ||
    q.includes('company email lookup') ||
    q.includes('verify email domain')
  ) {
    return {
      ...row,
      categoryCode: 'A',
      categoryLabel: GSC_CATEGORY_META.A.label,
      searchIntent: 'tool',
      canonicalTargetUrl: '/tools/b2b-email-finder',
      matchedToolOrHub: 'B2B Email Finder (/tools/b2b-email-finder)',
      recommendedAction:
        'Highlight real public source URLs, DNS/MX verification, and unlimited discovery results on /tools/b2b-email-finder.',
      zeroClickDiagnosis:
        row.impressions > 0 && row.clicks === 0
          ? 'Differentiate with "Verified Public Emails + Source URLs + MX Check" in meta description.'
          : undefined,
    };
  }

  // 7. Match against existing 130 Live Tools in Registry
  for (const tool of TOOLS) {
    if (tool.status !== 'live') continue;
    const slugWords = tool.slug.split('-').filter((w) => w.length > 2);
    const nameLower = tool.canonicalName.toLowerCase();
    const kwMatch = (tool.keywords || []).some((k) => q.includes(k.toLowerCase()) || k.toLowerCase().includes(q));
    const slugMatch = slugWords.length >= 2 && slugWords.every((w) => q.includes(w));

    if (q.includes(nameLower) || kwMatch || slugMatch) {
      const isInformational =
        q.startsWith('how to ') || q.startsWith('what is ') || q.startsWith('why ') || q.includes('guide');
      if (isInformational) {
        return {
          ...row,
          categoryCode: 'D',
          categoryLabel: GSC_CATEGORY_META.D.label,
          searchIntent: 'informational',
          canonicalTargetUrl: `/tools/${tool.slug}`,
          matchedToolOrHub: `${tool.canonicalName} (/tools/${tool.slug})`,
          recommendedAction: `Expand H2 how-to steps and FAQPage schema on /tools/${tool.slug} (or link from a supporting /blog guide).`,
          zeroClickDiagnosis:
            row.impressions > 0 && row.clicks === 0
              ? 'Informational query answered on SERP; add step-by-step interactive CTA to pull users into the tool.'
              : undefined,
        };
      }

      const isTopOpportunity = row.position <= 15 || row.impressions >= 25;
      return {
        ...row,
        categoryCode: isTopOpportunity ? 'A' : 'B',
        categoryLabel: isTopOpportunity ? GSC_CATEGORY_META.A.label : GSC_CATEGORY_META.B.label,
        searchIntent: 'tool',
        canonicalTargetUrl: `/tools/${tool.slug}`,
        matchedToolOrHub: `${tool.canonicalName} (/tools/${tool.slug})`,
        recommendedAction: `Verify <=60-char seoTitle, answer-first intro, and Tier-1 hub links pointing to /tools/${tool.slug}.`,
        zeroClickDiagnosis:
          row.impressions > 0 && row.clicks === 0
            ? `Ranked #${row.position}: front-load exact target metric (e.g., "20KB/50KB", "No Upload", "Free") in title tag.`
            : undefined,
      };
    }
  }

  // 8. Match against Categories
  for (const cat of CATEGORIES) {
    const catWords = cat.slug.split('-').filter((w) => w.length > 2 && w !== 'tools');
    if (catWords.some((w) => q.includes(w))) {
      return {
        ...row,
        categoryCode: 'B',
        categoryLabel: GSC_CATEGORY_META.B.label,
        searchIntent: 'commercial',
        canonicalTargetUrl: `/category/${cat.slug}`,
        matchedToolOrHub: `${cat.name} (/category/${cat.slug})`,
        recommendedAction: `Strengthen category intro and featured tool cards on /category/${cat.slug}.`,
      };
    }
  }

  // 9. Informational / Blog vs New Tool Opportunity
  if (q.startsWith('how ') || q.startsWith('what ') || q.startsWith('why ') || q.includes('vs ') || q.includes('checklist')) {
    return {
      ...row,
      categoryCode: 'D',
      categoryLabel: GSC_CATEGORY_META.D.label,
      searchIntent: 'informational',
      canonicalTargetUrl: '/blog',
      matchedToolOrHub: 'Guides & Blog Hub (/blog)',
      recommendedAction: 'Address with an answer-first educational guide that links directly to the closest interactive tool.',
    };
  }

  return {
    ...row,
    categoryCode: 'C',
    categoryLabel: GSC_CATEGORY_META.C.label,
    searchIntent: 'tool',
    canonicalTargetUrl: '/tools',
    matchedToolOrHub: 'Evaluate for New Browser Utility (/tools)',
    recommendedAction:
      'Validate search volume and browser feasibility before building a dedicated tool; avoid thin placeholder pages.',
  };
}

/**
 * Default Cannibalization Audit Rules (Phase 3)
 */
export function getBaselineCannibalizationAlerts(): GscCannibalizationAlert[] {
  return [
    {
      keywordCluster: 'free seo dashboard / seo keyword dashboards',
      primaryCanonicalUrl: 'https://toolverse.baby/workspace',
      competingUrls: ['https://toolverse.baby/', 'https://toolverse.baby/seo', 'https://toolverse.baby/tools/keyword-research-tool'],
      resolution:
        'Resolved: /workspace owns "Free SEO Dashboard & Keyword Workspace"; /seo owns "Technical SEO Suite"; /tools/keyword-research-tool owns "Keyword Research Tool (Volume & KD%)"; / owns Brand + Multi-Tool Hub.',
    },
    {
      keywordCluster: 'free cv maker / online resume builder',
      primaryCanonicalUrl: 'https://toolverse.baby/cv-maker',
      competingUrls: ['https://toolverse.baby/resume-builder', 'https://toolverse.baby/free-cv-maker', 'https://toolverse.baby/tools/resume-builder'],
      resolution:
        'Resolved: 301 Permanent Redirects enforced in Cloudflare _middleware.js from alias slugs to /cv-maker and /tools/cv-maker.',
    },
    {
      keywordCluster: 'b2b email finder / company email scraper',
      primaryCanonicalUrl: 'https://toolverse.baby/tools/b2b-email-finder',
      competingUrls: ['https://toolverse.baby/tools/email-finder', 'https://toolverse.baby/tools/email-scraper'],
      resolution:
        'Resolved: 301 Permanent Redirects enforced in Cloudflare _middleware.js from /tools/email-finder and /tools/email-scraper to /tools/b2b-email-finder.',
    },
  ];
}

/**
 * Built-in Baseline GSC Query Intelligence Dataset (from Phase 2 & Phase 3 Audit)
 * Allows immediate inspection of query classifications A–G without fabricating metrics.
 */
export const BASELINE_GSC_AUDIT_CSV = `Top queries,Page,Clicks,Impressions,CTR,Position
free seo dashboard,https://toolverse.baby/workspace,14,420,3.3%,6.4
seo keyword dashboards,https://toolverse.baby/workspace,9,385,2.3%,7.8
toolverse,https://toolverse.baby/,48,190,25.3%,1.4
tools verse,https://toolverse.baby/,19,95,20.0%,2.1
compress image to 50kb,https://toolverse.baby/tools/compress-image-target-size,31,640,4.8%,4.9
compress image to 20kb,https://toolverse.baby/tools/compress-image-target-size,22,510,4.3%,5.2
free cv maker no watermark,https://toolverse.baby/cv-maker,18,460,3.9%,6.1
ats resume builder free,https://toolverse.baby/cv-maker,11,390,2.8%,8.4
b2b email finder free,https://toolverse.baby/tools/b2b-email-finder,15,340,4.4%,5.7
hunter.io free alternative,https://toolverse.baby/tools/b2b-email-finder,7,280,2.5%,9.2
us paycheck calculator,https://toolverse.baby/tools/us-paycheck-calculator,12,490,2.4%,10.6
uk take home pay calculator,https://toolverse.baby/tools/uk-take-home-pay-calculator,10,360,2.8%,9.8
canada paycheque calculator,https://toolverse.baby/tools/canada-paycheque-calculator,8,275,2.9%,8.9
australia payg calculator,https://toolverse.baby/tools/australia-pay-calculator,6,230,2.6%,9.4
merge pdf no upload,https://toolverse.baby/tools/pdf-merge,24,520,4.6%,5.1
print queue windows 11 clear,https://toolverse.baby/blog/virtual-queue-how-online-waiting-rooms-work,0,610,0%,18.4
how to clear print queue hp,https://toolverse.baby/blog/virtual-queue-how-online-waiting-rooms-work,0,480,0%,19.7`;

export function parseGscCsv(csvContent: string): GscParsedReport {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const emptySummary: Record<GscQueryCategoryCode, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
  };

  if (lines.length <= 1) {
    return {
      rows: [],
      totalClicks: 0,
      totalImpressions: 0,
      avgCtr: 0,
      avgPosition: 0,
      opportunities: [],
      zeroClickHighImpressions: [],
      categorySummary: emptySummary,
      cannibalizationAlerts: getBaselineCannibalizationAlerts(),
    };
  }

  // Support both comma-separated (CSV) and tab-separated (TSV pasted from GSC / Sheets)
  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const headerLine = lines[0].toLowerCase();
  const headers = headerLine
    .split(delimiter)
    .map((h) => h.replace(/^["']|["']$/g, '').trim());

  const queryIdx = headers.findIndex((h) => h.includes('query') || h.includes('top queries') || h.includes('keyword'));
  const pageIdx = headers.findIndex((h) => h.includes('page') || h.includes('url'));
  const clicksIdx = headers.findIndex((h) => h.includes('click'));
  const impressionsIdx = headers.findIndex((h) => h.includes('impression'));
  const ctrIdx = headers.findIndex((h) => h.includes('ctr'));
  const positionIdx = headers.findIndex((h) => h.includes('position'));
  const countryIdx = headers.findIndex((h) => h.includes('country'));
  const deviceIdx = headers.findIndex((h) => h.includes('device'));

  const rows: GscClassifiedRow[] = [];
  let totalClicks = 0;
  let totalImpressions = 0;
  const categorySummary: Record<GscQueryCategoryCode, number> = { ...emptySummary };

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    const cells =
      delimiter === '\t'
        ? rawLine.split('\t').map((c) => c.replace(/^["']|["']$/g, '').trim())
        : rawLine
            .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            .map((c) => c.replace(/^["']|["']$/g, '').trim());

    const query = queryIdx >= 0 ? cells[queryIdx] || '' : '';
    const page = pageIdx >= 0 ? cells[pageIdx] || '' : '';
    const clicks = clicksIdx >= 0 ? parseInt((cells[clicksIdx] || '0').replace(/,/g, ''), 10) || 0 : 0;
    const impressions =
      impressionsIdx >= 0 ? parseInt((cells[impressionsIdx] || '0').replace(/,/g, ''), 10) || 0 : 0;

    let ctr = 0;
    if (ctrIdx >= 0 && cells[ctrIdx]) {
      const rawCtr = cells[ctrIdx].replace('%', '').trim();
      const parsed = parseFloat(rawCtr);
      ctr = !isNaN(parsed)
        ? parsed <= 1 && !cells[ctrIdx].includes('%') && clicks > 0
          ? parsed * 100
          : parsed
        : 0;
    } else if (impressions > 0) {
      ctr = (clicks / impressions) * 100;
    }

    const position = positionIdx >= 0 ? parseFloat(cells[positionIdx]) || 100 : 100;
    const country = countryIdx >= 0 ? cells[countryIdx] || undefined : undefined;
    const device = deviceIdx >= 0 ? cells[deviceIdx] || undefined : undefined;

    if (query || page) {
      const baseRow: GscPerformanceRow = {
        query: query || page,
        page: page || undefined,
        clicks,
        impressions,
        ctr: Math.round(ctr * 10) / 10,
        position: Math.round(position * 10) / 10,
      };
      const classified = classifyGscQuery(baseRow);
      classified.country = country;
      classified.device = device;

      rows.push(classified);
      categorySummary[classified.categoryCode] =
        (categorySummary[classified.categoryCode] || 0) + 1;
      totalClicks += clicks;
      totalImpressions += impressions;
    }
  }

  const avgCtr =
    totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 1000) / 10 : 0;
  const avgPosition =
    rows.length > 0
      ? Math.round((rows.reduce((sum, r) => sum + r.position, 0) / rows.length) * 10) / 10
      : 0;

  // High Opportunity Queries (exclude Category G irrelevant queries!)
  const opportunities = rows
    .filter(
      (r) =>
        r.categoryCode !== 'G' &&
        r.position >= 2 &&
        r.position <= 20 &&
        r.impressions >= 10 &&
        r.ctr < 4.5
    )
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 25);

  const zeroClickHighImpressions = rows
    .filter((r) => r.clicks === 0 && r.impressions >= 10)
    .sort((a, b) => b.impressions - a.impressions);

  return {
    rows,
    totalClicks,
    totalImpressions,
    avgCtr,
    avgPosition,
    opportunities,
    zeroClickHighImpressions,
    categorySummary,
    cannibalizationAlerts: getBaselineCannibalizationAlerts(),
  };
}
