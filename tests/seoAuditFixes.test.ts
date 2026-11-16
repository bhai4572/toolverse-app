import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getToolBySlug } from '@/lib/tools/registry';
import { getToolPageContent } from '@/lib/seo/toolPageContent';
import { pathShouldNoindex } from '@/lib/seo/indexability';
import { getMetadataForPath } from '@/lib/seo/metaEngine';
import { onRequest } from '@/functions/_middleware.js';

describe('ToolVerse SEO & AdSense Audit Fixes (10 Priorities Verification)', () => {
  const root = path.resolve(__dirname, '..');

  it('Priority 1: cleans ads.txt and removes Monetag from index.html & adConfig', () => {
    const adsTxt = fs.readFileSync(path.join(root, 'public/ads.txt'), 'utf8');
    expect(adsTxt).not.toContain('YOUR_PUBLISHER_ID');
    expect(adsTxt).toContain('pub-8847204746483890');

    const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    expect(indexHtml).not.toContain('name="monetag"');
    expect(indexHtml).not.toContain('nap5k');
    expect(indexHtml).not.toContain('n6wxm');

    const adConfig = fs.readFileSync(path.join(root, 'components/ads/adConfig.ts'), 'utf8');
    expect(adConfig).toContain('MONETAG_JOB_VIGNETTE_ENABLED = false');
    expect(adConfig).toContain("MONETAG_PUSH_ZONE = ''");
  });

  it('Priority 2: 301 redirects www. to apex and HTTP to HTTPS in _middleware.js', async () => {
    const makeContext = (urlStr: string, headers: Record<string, string> = {}) => ({
      request: new Request(urlStr, { headers }),
      env: { ASSETS: { fetch: async () => new Response('OK', { status: 200 }) } },
      next: async () => new Response('OK', { status: 200 }),
    });

    const wwwRes = await onRequest(makeContext('https://www.toolverse.baby/tools'));
    expect(wwwRes.status).toBe(301);
    expect(wwwRes.headers.get('Location')).toBe('https://toolverse.baby/tools');

    const httpRes = await onRequest(makeContext('http://toolverse.baby/tools'));
    expect(httpRes.status).toBe(301);
    expect(httpRes.headers.get('Location')).toBe('https://toolverse.baby/tools');
  });

  it('Priority 3: noindexes thin study shells, template how-tos, dashboard, workspace, and pricing', () => {
    // Thin doorway shells noindexed
    expect(pathShouldNoindex('/study/andorra')).toBe(true);
    expect(pathShouldNoindex('/study/north-korea')).toBe(true);
    expect(pathShouldNoindex('/study/tuvalu')).toBe(true);

    // Tier-1 rich guides kept indexable
    expect(pathShouldNoindex('/study/usa')).toBe(false);
    expect(pathShouldNoindex('/study/uk')).toBe(false);
    expect(pathShouldNoindex('/study/canada')).toBe(false);
    expect(pathShouldNoindex('/study/australia')).toBe(false);

    // App surfaces & thin hubs noindexed
    expect(pathShouldNoindex('/dashboard')).toBe(true);
    expect(pathShouldNoindex('/workspace')).toBe(true);
    expect(pathShouldNoindex('/pricing')).toBe(true);
    expect(pathShouldNoindex('/products/slack')).toBe(true);

    // Template how-tos noindexed, hand-written pillar guides indexable
    expect(pathShouldNoindex('/blog/how-to-compress-image-to-target-size-under-50kb')).toBe(false);
    expect(pathShouldNoindex('/blog/how-to-merge-pdf-files-privately-without-uploading')).toBe(false);
    expect(pathShouldNoindex('/blog/how-to-word-counter')).toBe(true);
  });

  it('Priority 5: registers 4 target-size PDF tools with rich SEO content', () => {
    const targetSizes = [
      'compress-pdf-to-200kb',
      'compress-pdf-to-100kb',
      'compress-pdf-to-300kb',
      'compress-pdf-to-500kb',
    ];

    for (const slug of targetSizes) {
      const tool = getToolBySlug(slug);
      expect(tool).toBeDefined();
      expect(tool?.categorySlug).toBe('pdf-document-tools');

      const seo = getToolPageContent(slug);
      expect(seo).toBeDefined();
      expect(seo?.seoTitle).toContain('Compress PDF');
      expect(seo?.seoDescription.length).toBeLessThanOrEqual(165);
      expect(seo?.faqs.length).toBeGreaterThan(0);
    }
  });

  it('Priority 6: generates unique legal meta descriptions without boilerplate', () => {
    const legalPages = [
      'privacy-policy',
      'terms-of-use',
      'about',
      'contact',
      'cookie-policy',
      'disclaimer',
      'security',
    ];
    const descriptions = new Set<string>();

    for (const slug of legalPages) {
      const meta = getMetadataForPath(`/legal/${slug}`);
      expect(meta.description.length).toBeLessThanOrEqual(160);
      expect(descriptions.has(meta.description)).toBe(false);
      descriptions.add(meta.description);
      expect(meta.description).not.toContain('Official ToolVerse privacy-policy');
    }
  });

  it('Priority 7: canonicalizes CV Maker URLs with 301 and uniform canonical tag', async () => {
    const makeContext = (urlStr: string) => ({
      request: new Request(urlStr),
      env: { ASSETS: { fetch: async () => new Response('OK', { status: 200 }) } },
      next: async () => new Response('OK', { status: 200 }),
    });

    const res = await onRequest(makeContext('https://toolverse.baby/tools/cv-maker'));
    expect(res.status).toBe(301);
    expect(res.headers.get('Location')).toBe('/cv-maker');

    const meta = getMetadataForPath('/cv-maker');
    expect(meta.canonicalUrl).toBe('https://toolverse.baby/cv-maker');

    const toolsMeta = getMetadataForPath('/tools/cv-maker');
    expect(toolsMeta.canonicalUrl).toBe('https://toolverse.baby/cv-maker');
  });

  it('Priority 8: cleans privacy policy leftovers, syncs 130+ tool count, and verifies compressed og-image', () => {
    const legalPageSrc = fs.readFileSync(path.join(root, 'app/legal/[slug]/page.tsx'), 'utf8');
    expect(legalPageSrc).not.toContain('toolverse-app.pages.dev');
    expect(legalPageSrc).toContain('130+ free utilities');

    const ogStats = fs.statSync(path.join(root, 'public/og-image.png'));
    expect(ogStats.size).toBeLessThan(200 * 1024);
  });
});

