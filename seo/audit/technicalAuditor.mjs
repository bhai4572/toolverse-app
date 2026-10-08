/**
 * ToolVerse Autonomous SEO Engine — Technical SEO Auditor
 * Audits robots.txt, sitemap.xml, headers, canonical consistency, and indexability rules.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const BASE_URL = 'https://toolverse.baby';

export function runTechnicalAudit() {
  console.log('[Technical Auditor] Running comprehensive technical SEO validation...');

  const auditReport = {
    timestamp: new Date().toISOString(),
    status: 'PASS',
    checks: [],
    errors: [],
    warnings: [],
  };

  // 1. Robots.txt audit
  const robotsPath = path.join(root, 'public/robots.txt');
  if (!fs.existsSync(robotsPath)) {
    auditReport.errors.push('CRITICAL: public/robots.txt missing');
  } else {
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    const hasSitemap = robotsContent.includes('Sitemap: https://toolverse.baby/sitemap.xml');
    const hasWildcardAllow = robotsContent.includes('User-agent: *\nAllow: /');
    const allowsAeo = robotsContent.includes('ChatGPT-User') && robotsContent.includes('PerplexityBot');

    auditReport.checks.push({
      test: 'robots.txt Configuration',
      status: hasSitemap && hasWildcardAllow ? 'PASS' : 'WARN',
      details: {
        hasSitemapDirective: hasSitemap,
        allowsStandardCrawlers: hasWildcardAllow,
        allowsAeoAssistants: allowsAeo,
      },
    });
  }

  // 2. Sitemap.xml audit
  const sitemapPath = path.join(root, 'public/sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    auditReport.errors.push('CRITICAL: public/sitemap.xml missing');
  } else {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    const locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const validProtocolCount = locMatches.filter((u) => u.startsWith('https://toolverse.baby')).length;
    const hasNoHttp = !locMatches.some((u) => u.startsWith('http://'));
    const hasNoTrailingSlashMismatches = locMatches.every((u) => u === 'https://toolverse.baby/' || !u.endsWith('/'));

    auditReport.checks.push({
      test: 'sitemap.xml Integrity',
      status: locMatches.length > 200 && hasNoHttp && hasNoTrailingSlashMismatches ? 'PASS' : 'FAIL',
      details: {
        totalUrls: locMatches.length,
        canonicalDomainMatched: validProtocolCount === locMatches.length,
        strictHttpsEnforced: hasNoHttp,
        trailingSlashConsistent: hasNoTrailingSlashMismatches,
      },
    });
  }

  // 3. Security & Cloudflare Headers audit
  const headersPath = path.join(root, 'public/_headers');
  if (fs.existsSync(headersPath)) {
    const headersContent = fs.readFileSync(headersPath, 'utf8');
    const hasNosniff = headersContent.includes('X-Content-Type-Options: nosniff');
    const hasHsts = headersContent.includes('Strict-Transport-Security');

    auditReport.checks.push({
      test: 'HTTP Security Headers',
      status: hasNosniff && hasHsts ? 'PASS' : 'WARN',
      details: {
        hasNosniff,
        hasHsts,
      },
    });
  }

  // 4. Index.html DOM & Metadata check
  const indexPath = path.join(root, 'index.html');
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    const hasViewport = indexContent.includes('name="viewport"');
    const hasCharset = indexContent.includes('charset="UTF-8"');
    const hasRobotsMeta = indexContent.includes('name="robots"');
    const hasCanonical = indexContent.includes('rel="canonical"');
    const hasJsonLdGraph = indexContent.includes('"@graph"');

    auditReport.checks.push({
      test: 'HTML Shell SEO Fundamentals',
      status: hasViewport && hasCharset && hasRobotsMeta && hasCanonical && hasJsonLdGraph ? 'PASS' : 'FAIL',
      details: {
        hasViewport,
        hasCharset,
        hasRobotsMeta,
        hasCanonical,
        hasJsonLdGraph,
      },
    });
  }

  auditReport.status = auditReport.errors.length === 0 ? 'PASS' : 'FAIL';

  const dataDir = path.join(root, 'seo/data');
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'technical_audit.json'), JSON.stringify(auditReport, null, 2));

  console.log(`[Technical Auditor] Audit complete. Overall Status: ${auditReport.status}.`);
  return auditReport;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runTechnicalAudit();
}
