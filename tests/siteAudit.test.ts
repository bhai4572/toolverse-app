import { describe, it, expect } from 'vitest';
import { validateTargetUrl, isIpBlocked, safeFetch } from '../lib/seo/audit/ssrfGuard';
import { analyzePageHtml, evaluateAuditFindings } from '../lib/seo/audit/crawlerEngine';

describe('Site Audit v1 — SSRF & Security Protection Suite', () => {
  it('validates and accepts legitimate public URLs on standard ports', () => {
    const valid1 = validateTargetUrl('https://example.com');
    expect(valid1.valid).toBe(true);
    expect(valid1.hostname).toBe('example.com');
    expect(valid1.port).toBe(443);

    const valid2 = validateTargetUrl('http://my-startup.org/blog?ref=toolverse');
    expect(valid2.valid).toBe(true);
    expect(valid2.hostname).toBe('my-startup.org');
    expect(valid2.port).toBe(80);
  });

  it('rejects dangerous protocols (ftp, file, javascript, data)', () => {
    expect(validateTargetUrl('file:///etc/passwd').valid).toBe(false);
    expect(validateTargetUrl('ftp://ftp.example.com').valid).toBe(false);
    expect(validateTargetUrl('javascript:alert(1)').valid).toBe(false);
    expect(validateTargetUrl('data:text/html,<h1>Test</h1>').valid).toBe(false);
  });

  it('strictly blocks credentials (username/password) embedded in URLs', () => {
    const res = validateTargetUrl('https://admin:secret123@example.com/admin');
    expect(res.valid).toBe(false);
    expect(res.error).toContain('Credentials');
  });

  it('strictly rejects non-standard ports (e.g. 22, 3306, 6379, 8080, 8443)', () => {
    expect(validateTargetUrl('https://example.com:22/').valid).toBe(false);
    expect(validateTargetUrl('http://example.com:3306/').valid).toBe(false);
    expect(validateTargetUrl('http://example.com:8080/').valid).toBe(false);
    expect(validateTargetUrl('https://example.com:8443/').valid).toBe(false);
  });

  it('blocks loopback IP addresses (127.0.0.0/8 and ::1)', () => {
    expect(validateTargetUrl('http://127.0.0.1').valid).toBe(false);
    expect(validateTargetUrl('http://127.0.0.2:80').valid).toBe(false);
    expect(validateTargetUrl('http://127.255.255.254').valid).toBe(false);
    expect(validateTargetUrl('http://[::1]').valid).toBe(false);
    expect(validateTargetUrl('http://localhost').valid).toBe(false);
    expect(validateTargetUrl('http://service.localhost').valid).toBe(false);
  });

  it('blocks RFC 1918 private IPv4 ranges (10/8, 172.16/12, 192.168/16)', () => {
    expect(isIpBlocked('10.0.0.1').blocked).toBe(true);
    expect(isIpBlocked('10.254.254.254').blocked).toBe(true);
    expect(isIpBlocked('172.16.0.1').blocked).toBe(true);
    expect(isIpBlocked('172.31.255.254').blocked).toBe(true);
    expect(isIpBlocked('192.168.1.1').blocked).toBe(true);
    expect(isIpBlocked('192.168.0.254').blocked).toBe(true);
  });

  it('blocks Cloud metadata service IP (169.254.169.254 / link-local)', () => {
    const metaCheck = validateTargetUrl('http://169.254.169.254/latest/meta-data/');
    expect(metaCheck.valid).toBe(false);
    expect(isIpBlocked('169.254.169.254').blocked).toBe(true);
  });

  it('blocks internal/private hostname suffixes (.local, .internal, .lan)', () => {
    expect(validateTargetUrl('http://kube-dns.local').valid).toBe(false);
    expect(validateTargetUrl('http://database.internal').valid).toBe(false);
    expect(validateTargetUrl('http://router.lan').valid).toBe(false);
  });

  it('rejects connection when safeFetch is called with an internal/SSRF destination', async () => {
    await expect(safeFetch('http://127.0.0.1/admin')).rejects.toThrow(/SSRF Block/);
    await expect(safeFetch('http://localhost:80')).rejects.toThrow(/SSRF Block/);
    await expect(safeFetch('http://169.254.169.254/metadata')).rejects.toThrow(/SSRF Block/);
  });
});

describe('Site Audit v1 — HTML Parser & Technical SEO Checks', () => {
  const sampleHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Best Project Management Software 2026 — TaskFlow</title>
      <meta name="description" content="Discover modern project management software designed for fast engineering teams. Track sprints, manage backlogs, and automate workflows effortlessly.">
      <link rel="canonical" href="https://example.com/project-management">
      <meta name="robots" content="index, follow">
    </head>
    <body>
      <header>
        <a href="/">Home</a>
        <a href="/pricing">Pricing Plans</a>
        <a href="https://twitter.com/taskflow" target="_blank">Twitter</a>
      </header>
      <main>
        <h1>Streamline Your Sprint Workflows</h1>
        <h2>Agile Task Tracking</h2>
        <p>TaskFlow helps engineering teams collaborate seamlessly on software projects.</p>
        <img src="/img/screenshot1.png" alt="TaskFlow Dashboard Interface">
        <img src="/img/icon-missing-alt.png">
      </main>
    </body>
    </html>
  `;

  it('extracts title, meta description, and evaluates character lengths correctly', () => {
    const headers = new Headers({ 'content-type': 'text/html; charset=utf-8' });
    const page = analyzePageHtml(
      sampleHtml,
      'https://example.com/project-management',
      200,
      'OK',
      headers,
      [],
      120,
      'https://example.com/project-management'
    );

    expect(page.title).toBe('Best Project Management Software 2026 — TaskFlow');
    expect(page.titleLength).toBe(48);
    expect(page.description).toContain('Discover modern project management software');
    expect(page.descriptionLength).toBeGreaterThan(80);
    expect(page.hasViewport).toBe(true);
    expect(page.canonicalUrl).toBe('https://example.com/project-management');
    expect(page.isHttps).toBe(true);
  });

  it('detects H1 count, canonical tag, and images missing alt text', () => {
    const headers = new Headers({ 'content-type': 'text/html' });
    const page = analyzePageHtml(
      sampleHtml,
      'https://example.com/project-management',
      200,
      'OK',
      headers,
      [],
      95,
      'https://example.com/project-management'
    );

    expect(page.h1List.length).toBe(1);
    expect(page.h1List[0]).toBe('Streamline Your Sprint Workflows');
    expect(page.h2Count).toBe(1);

    expect(page.imagesTotal).toBe(2);
    expect(page.imagesMissingAlt).toBe(1);
    expect(page.missingAltSamples[0]).toBe('/img/icon-missing-alt.png');

    expect(page.internalLinks).toContain('https://example.com/');
    expect(page.internalLinks).toContain('https://example.com/pricing');
    expect(page.externalLinks).toContain('https://twitter.com/taskflow');
  });

  it('identifies missing title, missing H1, and missing canonical in broken pages', () => {
    const brokenHtml = `<html><head></head><body><p>No headings, no title, no canonical</p></body></html>`;
    const headers = new Headers({ 'content-type': 'text/html' });
    const brokenPage = analyzePageHtml(
      brokenHtml,
      'https://example.com/broken',
      200,
      'OK',
      headers,
      [],
      80,
      'https://example.com/broken'
    );

    const { findings } = evaluateAuditFindings([brokenPage], { found: true, hasSitemapDirective: true }, { found: true });

    const codes = findings.map((f) => f.code);
    expect(codes).toContain('MISSING_TITLE');
    expect(codes).toContain('MISSING_H1');
    expect(codes).toContain('MISSING_CANONICAL');
    expect(codes).toContain('MISSING_VIEWPORT');
  });

  it('detects duplicate title tags across multiple crawled pages', () => {
    const headers = new Headers({ 'content-type': 'text/html' });
    const page1 = analyzePageHtml(
      '<html><head><title>Home Page</title><link rel="canonical" href="https://example.com/1"></head><body><h1>Welcome</h1></body></html>',
      'https://example.com/1',
      200,
      'OK',
      headers,
      [],
      50,
      'https://example.com/1'
    );
    const page2 = analyzePageHtml(
      '<html><head><title>Home Page</title><link rel="canonical" href="https://example.com/2"></head><body><h1>Welcome 2</h1></body></html>',
      'https://example.com/2',
      200,
      'OK',
      headers,
      [],
      50,
      'https://example.com/2'
    );

    const { findings } = evaluateAuditFindings([page1, page2], { found: true, hasSitemapDirective: true }, { found: true });

    const dupTitle = findings.find((f) => f.code === 'DUPLICATE_TITLE');
    expect(dupTitle).toBeDefined();
    expect(dupTitle?.severity).toBe('error');
    expect(dupTitle?.affectedUrls.length).toBe(2);
  });

  it('reports missing robots.txt and missing sitemap.xml findings', () => {
    const headers = new Headers({ 'content-type': 'text/html' });
    const page = analyzePageHtml(sampleHtml, 'https://example.com/', 200, 'OK', headers, [], 60, 'https://example.com/');

    const { findings } = evaluateAuditFindings(
      [page],
      { found: false, hasSitemapDirective: false },
      { found: false }
    );

    const codes = findings.map((f) => f.code);
    expect(codes).toContain('MISSING_ROBOTS_TXT');
    expect(codes).toContain('MISSING_XML_SITEMAP');
  });
});
