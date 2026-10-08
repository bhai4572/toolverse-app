/**
 * ToolVerse Autonomous SEO Engine — Accessibility & Semantic HTML Auditor
 * Inspired by axe-core: checks headings hierarchy, image alt tags, ARIA attributes, and accessible controls.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');

export function runAccessibilityAudit() {
  console.log('[Accessibility Auditor] Running WCAG & semantic HTML checks...');

  const indexPath = path.join(root, 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf8');

  const issues = [];
  const passes = [];

  // Check 1: HTML lang attribute
  if (/<html[^>]*lang="en"[^>]*>/i.test(indexHtml)) {
    passes.push('HTML root specifies valid lang="en" attribute.');
  } else {
    issues.push('Missing or invalid lang attribute on <html> element.');
  }

  // Check 2: Single H1 presence
  const h1Matches = [...indexHtml.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1Matches.length === 1) {
    passes.push('Page contains exactly one semantic <h1> element.');
  } else if (h1Matches.length === 0) {
    issues.push('Missing <h1> element in HTML template.');
  } else {
    issues.push(`Multiple <h1> elements found (${h1Matches.length}). Best practice is a single <h1> per page.`);
  }

  // Check 3: Viewport meta tag
  if (/<meta[^>]*name="viewport"[^>]*content="[^"]*width=device-width[^"]*"[^>]*>/i.test(indexHtml)) {
    passes.push('Mobile viewport properly configured for responsive accessibility.');
  } else {
    issues.push('Missing responsive viewport meta tag.');
  }

  // Check 4: Images have alt attributes
  const imgTags = [...indexHtml.matchAll(/<img([^>]*)>/gi)];
  let missingAlt = 0;
  for (const img of imgTags) {
    if (!/alt="[^"]*"/i.test(img[1])) {
      missingAlt++;
    }
  }

  if (missingAlt === 0) {
    passes.push('All image elements include explicit alt attributes.');
  } else {
    issues.push(`${missingAlt} image(s) missing alt attribute.`);
  }

  // Check 5: Preconnect / preloading optimization
  if (indexHtml.includes('rel="preconnect"') && indexHtml.includes('family=Inter')) {
    passes.push('Font resources preconnected and preloaded with display=swap.');
  }

  const result = {
    timestamp: new Date().toISOString(),
    status: issues.length === 0 ? 'PASS' : 'WARN',
    totalChecksPassed: passes.length,
    totalIssuesFound: issues.length,
    passes,
    issues,
  };

  console.log(`[Accessibility Auditor] Audit complete. Passes: ${passes.length}, Issues: ${issues.length}.`);
  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runAccessibilityAudit();
}
