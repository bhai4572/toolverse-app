import { describe, it, expect } from 'vitest';
import { TOOLS } from '../lib/tools/registry';
import { getToolPageContent } from '../lib/seo/toolPageContent';
import { getMetadataForPath } from '../lib/seo/metaEngine';
import {
  parseGscCsv,
  classifyGscQuery,
  BASELINE_GSC_AUDIT_CSV,
} from '../lib/seo/importers/gscCsvParser';
import { REGION_HUBS } from '../lib/regions/hubs';
import { onRequest } from '../functions/_middleware.js';

describe('Toolverse GSC Search Intelligence & Organic Traffic Growth System', () => {
  it('1. ensures 100% of live tools have rich TOOL_PAGE_CONTENT (answerFirst, seoTitle, seoDescription, sections, faqs)', () => {
    const liveTools = TOOLS.filter((t) => t.status === 'live');
    expect(liveTools.length).toBeGreaterThanOrEqual(130);

    const missing: string[] = [];
    for (const tool of liveTools) {
      const seo = getToolPageContent(tool.slug);
      if (!seo || !seo.answerFirst || !seo.sections?.length || !seo.faqs?.length) {
        missing.push(tool.slug);
      }
    }
    expect(missing).toEqual([]);
  });

  it('2. enforces distinct, de-cannibalized titles (<=60 chars) & descriptions (<=160 chars) across /, /workspace, /seo, /seo-tools, and /tools/keyword-research-tool', () => {
    const paths = [
      '/',
      '/workspace',
      '/seo',
      '/seo-tools',
      '/tools/keyword-research-tool',
      '/cv-maker',
      '/tools/b2b-email-finder',
    ];

    const titles = new Set<string>();
    for (const p of paths) {
      const meta = getMetadataForPath(p);
      expect(meta.title.length).toBeLessThanOrEqual(60);
      expect(meta.description.length).toBeLessThanOrEqual(160);
      expect(titles.has(meta.title)).toBe(false);
      titles.add(meta.title);
    }

    // Verify /workspace owns "Free SEO Dashboard"
    expect(getMetadataForPath('/workspace').title).toContain('Free SEO Dashboard');
    // Verify /404 is strictly noindex
    expect(getMetadataForPath('/404').robots).toContain('noindex');
  });

  it('3. classifies GSC queries into Categories A–G and maps each to a single canonical URL', () => {
    const report = parseGscCsv(BASELINE_GSC_AUDIT_CSV);
    expect(report.rows.length).toBeGreaterThanOrEqual(15);

    const freeSeoDashboard = classifyGscQuery({
      query: 'free seo dashboard',
      clicks: 14,
      impressions: 420,
      ctr: 3.3,
      position: 6.4,
    });
    expect(freeSeoDashboard.categoryCode).toBe('A');
    expect(freeSeoDashboard.canonicalTargetUrl).toBe('/workspace');

    const brandQuery = classifyGscQuery({
      query: 'toolverse',
      clicks: 48,
      impressions: 190,
      ctr: 25.3,
      position: 1.4,
    });
    expect(brandQuery.categoryCode).toBe('E');
    expect(brandQuery.canonicalTargetUrl).toBe('/');

    const competitorQuery = classifyGscQuery({
      query: 'hunter.io free alternative',
      clicks: 7,
      impressions: 280,
      ctr: 2.5,
      position: 9.2,
    });
    expect(competitorQuery.categoryCode).toBe('F');
    expect(competitorQuery.canonicalTargetUrl).toBe('/tools/b2b-email-finder');

    const printQueue = classifyGscQuery({
      query: 'print queue windows 11 clear',
      clicks: 0,
      impressions: 610,
      ctr: 0,
      position: 18.4,
    });
    expect(printQueue.categoryCode).toBe('G');
    expect(printQueue.searchIntent).toBe('irrelevant');
    expect(printQueue.zeroClickDiagnosis).toBeDefined();

    // Category G must never pollute high-CTR opportunities
    expect(report.opportunities.some((r) => r.categoryCode === 'G')).toBe(false);
    // Zero-click high impressions should capture the print queue accidental queries
    expect(report.zeroClickHighImpressions.some((r) => r.query.includes('print queue'))).toBe(true);
  });

  it('4. enforces 301 Permanent Redirects for duplicate alias routes and HTTP 404 for unknown child routes in _middleware.js', async () => {
    const makeContext = (pathname: string) => ({
      request: new Request(`https://toolverse.baby${pathname}`),
      env: {
        ASSETS: {
          fetch: async (reqUrl: URL) => {
            if (reqUrl.pathname === '/404.html') {
              return new Response('<html><body>404 Not Found</body></html>', { status: 200 });
            }
            if (reqUrl.pathname === '/index.html') {
              return new Response('<html><body>SPA Root</body></html>', { status: 200 });
            }
            return new Response('Not Found', { status: 404 });
          },
        },
      },
      next: async () => new Response('Not Found', { status: 404 }),
    });

    const redirectPairs: [string, string][] = [
      ['/seo-suite', '/seo'],
      ['/seo-dashboard', '/workspace'],
      ['/resume-builder', '/cv-maker'],
      ['/free-cv-maker', '/cv-maker'],
      ['/tools/resume-builder', '/cv-maker'],
      ['/tools/email-finder', '/tools/b2b-email-finder'],
      ['/tools/email-scraper', '/tools/b2b-email-finder'],
    ];

    for (const [fromPath, expectedLocation] of redirectPairs) {
      const res = await onRequest(makeContext(fromPath));
      expect(res.status).toBe(301);
      expect(res.headers.get('Location')).toBe(expectedLocation);
    }

    // Unknown child routes under strictly prerendered registries must return 404 (not Soft-404 200)
    for (const unknownChild of [
      '/tools/nonexistent-fake-tool-999',
      '/blog/deleted-fake-article-999',
      '/category/nonexistent-category-999',
      '/legal/nonexistent-policy-999',
    ]) {
      const res = await onRequest(makeContext(unknownChild));
      expect(res.status).toBe(404);
    }

    // Dynamic SPA sub-routes (/workspace/search-console) still hydrate via SPA index.html (200)
    const spaRes = await onRequest(makeContext('/workspace/search-console'));
    expect(spaRes.status).toBe(200);
  });

  it('5. features cv-maker and b2b-email-finder across all Tier-1 Regional Hubs (US, UK, CA, AU)', () => {
    for (const code of ['us', 'uk', 'ca', 'au'] as const) {
      const slugs = REGION_HUBS[code].tools.map((t) => t.slug);
      expect(slugs).toContain('cv-maker');
      expect(slugs).toContain('b2b-email-finder');
    }
  });
});

