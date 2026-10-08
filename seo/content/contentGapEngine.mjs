/**
 * ToolVerse Autonomous SEO Engine — Content Gap & Topical Authority Engine
 * Evaluates AEO/GEO readiness, answers-first formatting, instructions, FAQs, and topical cluster completeness.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');

export function runContentGapEngine() {
  console.log('[Content Gap Engine] Analyzing pages for AEO/GEO completeness and topical gaps...');

  const crawlPath = path.join(root, 'seo/data/crawl_results.json');
  if (!fs.existsSync(crawlPath)) {
    throw new Error('crawl_results.json missing — run crawler first');
  }

  const crawlData = JSON.parse(fs.readFileSync(crawlPath, 'utf8'));
  const pages = crawlData.pages;

  const contentEvaluations = [];

  for (const page of pages) {
    if (page.pageType !== 'tool' && page.pageType !== 'blog') continue;

    const hasInstructions = page.structuredData.includes('HowTo') || page.h2Count >= 4;
    const hasFaqs = page.structuredData.includes('FAQPage');
    const hasWebApplicationSchema = page.structuredData.includes('WebApplication');
    const wordCountOk = page.wordCount >= 350;
    const hasProperHeadings = page.h2Count >= 3 && page.h3Count >= 2;

    let score = 0;
    if (page.title && page.title.length >= 35) score += 15;
    if (page.metaDescription && page.metaDescription.length >= 100) score += 15;
    if (hasInstructions) score += 20;
    if (hasFaqs) score += 20;
    if (wordCountOk) score += 15;
    if (hasProperHeadings) score += 15;

    const gaps = [];
    if (!hasInstructions && page.pageType === 'tool') {
      gaps.push('Add explicit 3-step visible user workflow for HowTo rich snippet eligibility.');
    }
    if (!hasFaqs) {
      gaps.push('Add 3 authoritative, visible FAQ questions to earn FAQ rich result snippet.');
    }
    if (page.wordCount < 400) {
      gaps.push(`Low word count (${page.wordCount} words). Add practical use cases and file privacy explanation.`);
    }
    if (!hasWebApplicationSchema && page.pageType === 'tool') {
      gaps.push('Missing WebApplication Schema.org structured data.');
    }

    contentEvaluations.push({
      url: page.url,
      path: page.path,
      pageType: page.pageType,
      title: page.title,
      wordCount: page.wordCount,
      completenessScore: score,
      aeoGeoStatus: score >= 80 ? 'Highly Optimized' : score >= 60 ? 'Moderate' : 'Needs Optimization',
      gaps,
    });
  }

  // Sort by lowest completeness score to prioritize fixes
  contentEvaluations.sort((a, b) => a.completenessScore - b.completenessScore);

  const topicalClusters = {
    'PDF & Document': {
      count: pages.filter((p) => p.path.includes('pdf') || p.path.includes('document')).length,
      pillarGuide: 'how-to-merge-pdf-files-privately-without-uploading',
      authorityStatus: 'High',
    },
    'Image & Design': {
      count: pages.filter((p) => p.path.includes('image') || p.path.includes('jpg') || p.path.includes('heic')).length,
      pillarGuide: 'how-to-compress-image-to-target-size-under-50kb',
      authorityStatus: 'High',
    },
    'Business, Tax & Finance': {
      count: pages.filter((p) => p.path.includes('tax') || p.path.includes('salary') || p.path.includes('rate') || p.path.includes('emi')).length,
      pillarGuide: 'pakistan-salary-tax-calculator-slabs-guide',
      authorityStatus: 'High',
    },
    'SEO & Developer': {
      count: pages.filter((p) => p.path.includes('seo') || p.path.includes('json') || p.path.includes('jwt') || p.path.includes('utm')).length,
      pillarGuide: 'best-free-semrush-ahrefs-alternatives-2026',
      authorityStatus: 'High',
    },
    'Remote Jobs & Careers': {
      count: pages.filter((p) => p.path.includes('job')).length,
      pillarGuide: 'top-high-paying-remote-jobs-worldwide',
      authorityStatus: 'High',
    },
  };

  const highPriorityGaps = contentEvaluations.filter((c) => c.gaps.length > 0).slice(0, 15);

  const result = {
    timestamp: new Date().toISOString(),
    totalPagesEvaluated: contentEvaluations.length,
    averageCompletenessScore: Math.round(
      contentEvaluations.reduce((acc, c) => acc + c.completenessScore, 0) / contentEvaluations.length
    ),
    topicalClusters,
    highPriorityGapsCount: highPriorityGaps.length,
    highPriorityGaps,
    contentEvaluations,
  };

  const dataDir = path.join(root, 'seo/data');
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'content_gaps.json'), JSON.stringify(result, null, 2));

  console.log(
    `[Content Gap Engine] Evaluated ${contentEvaluations.length} pages. Average completeness: ${result.averageCompletenessScore}%.`
  );
  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runContentGapEngine();
}
