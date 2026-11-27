import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getToolBySlug } from '@/lib/tools/registry';
import { getToolPageContent } from '@/lib/seo/toolPageContent';
import { pathShouldNoindex } from '@/lib/seo/indexability';
import { getMetadataForPath } from '@/lib/seo/metaEngine';
import { onRequest } from '@/functions/_middleware.js';
import { buildTrackedUrl } from '@/lib/url-shortener/client';
import { generateQrCodeDataUrl } from '@/lib/developer/engine';

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
      expect(seo?.seoDescription).toBeDefined();
      expect((seo?.seoDescription ?? '').length).toBeLessThanOrEqual(165);
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
    expect(legalPageSrc).toContain('${LIVE_TOOL_COUNT}+ free utilities');

    const ogStats = fs.statSync(path.join(root, 'public/og-image.png'));
    expect(ogStats.size).toBeLessThan(200 * 1024);
  });

  it('Priority 9: replaces legacy ad-network service workers with safe kill-switch and no-cache headers', async () => {
    const swFiles = ['public/sw.js', 'public/service-worker.js'];
    for (const relPath of swFiles) {
      const content = fs.readFileSync(path.join(root, relPath), 'utf8');
      // No third-party script imports or remote fetches
      expect(content).not.toMatch(/importScripts/i);
      expect(content).not.toMatch(/https?:\/\//i);
      expect(content).not.toMatch(/\bfetch\s*\(/i);
      // No Monetag / PropellerAds / 5gvci references
      expect(content).not.toMatch(/5gvci|monetag|propeller|zoneId|11965860|self\.lary/i);
      // Must self-activate and self-unregister without deleting unrelated caches
      expect(content).toContain('self.skipWaiting()');
      expect(content).toContain('self.registration.unregister()');
      expect(content).not.toContain('caches.delete');
    }

    // Both endpoints must have strict no-cache headers
    const headersFile = fs.readFileSync(path.join(root, 'public/_headers'), 'utf8');
    expect(headersFile).toMatch(/\/sw\.js\r?\n\s+Cache-Control:\s*no-cache, no-store, must-revalidate/);
    expect(headersFile).toMatch(/\/service-worker\.js\r?\n\s+Cache-Control:\s*no-cache, no-store, must-revalidate/);

    // Both endpoints must remain accessible as static JS (excluded by _routes.json and passed through middleware)
    const routesJson = JSON.parse(fs.readFileSync(path.join(root, 'public/_routes.json'), 'utf8'));
    expect(routesJson.exclude).toContain('/*.js');

    for (const swUrl of ['https://toolverse.baby/sw.js', 'https://toolverse.baby/service-worker.js']) {
      let nextCalled = false;
      const res = await onRequest({
        request: new Request(swUrl),
        env: { ASSETS: { fetch: async () => new Response('HTML', { status: 200 }) } },
        next: async () => {
          nextCalled = true;
          return new Response('// sw', { status: 200, headers: { 'content-type': 'application/javascript' } });
        },
      });
      expect(nextCalled).toBe(true);
      expect(res.status).toBe(200);
    }
  });

  it('Priority 10 (H1): Real URL Shortener Cloudflare Pages Functions exist and client validates UTM + QR', async () => {
    expect(fs.existsSync(path.join(root, 'functions/api/shorten.js'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'functions/s/[code].js'))).toBe(true);

    // Invalid URLs rejected cleanly
    expect(buildTrackedUrl('').isValid).toBe(false);
    expect(buildTrackedUrl('javascript:alert(1)').isValid).toBe(false);
    expect(buildTrackedUrl('http://localhost:3000/test').isValid).toBe(false);
    expect(buildTrackedUrl('https://toolverse.baby/s/abc1234').isValid).toBe(false);

    // Valid URL + UTM parameters built cleanly
    const built = buildTrackedUrl('https://toolverse.baby/tools/pdf-merge?ref=home', {
      source: 'newsletter',
      medium: 'email',
      campaign: 'q4_launch',
      term: 'pdf',
      content: 'cta_top',
    });
    expect(built.isValid).toBe(true);
    expect(built.url).toBe(
      'https://toolverse.baby/tools/pdf-merge?ref=home&utm_source=newsletter&utm_medium=email&utm_campaign=q4_launch&utm_term=pdf&utm_content=cta_top'
    );

    // QR code generated locally without backend calls
    const qrDataUrl = await generateQrCodeDataUrl(built.url!);
    expect(qrDataUrl.startsWith('data:image/png;base64,')).toBe(true);
  });

  it('Priority 11 (M1): SEO title truncation never leaves dangling connectors (&, -, —, |, ,)', () => {
    const previouslyDanglingPaths = [
      '/blog',
      '/blog/how-to-check-current-print-jobs-in-queue-windows',
      '/blog/how-to-generate-barcodes-free-code-128-ean-upc',
      '/blog/wifi-qr-code-guest-network-watch-party',
      '/study/new-zealand',
    ];

    for (const p of previouslyDanglingPaths) {
      const meta = getMetadataForPath(p);
      expect(meta.title.length).toBeGreaterThan(15);
      expect(meta.title.length).toBeLessThanOrEqual(60);
      expect(meta.title).not.toMatch(/[&|—–\-,;:]\s*$/);
    }

    // Valid titles remain intact
    expect(getMetadataForPath('/').title).toContain('ToolVerse');
    expect(getMetadataForPath('/tools/pdf-merge').title.length).toBeLessThanOrEqual(60);
  });
});

