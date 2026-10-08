/**
 * ToolVerse Autonomous SEO Engine — Master Orchestrator
 * Sequentially executes all SEO auditing, intelligence, keyword, link equity, and reporting modules.
 */
import { runSiteCrawler } from './crawler/siteCrawler.mjs';
import { runTechnicalAudit } from './audit/technicalAuditor.mjs';
import { runAccessibilityAudit } from './audit/accessibilityAuditor.mjs';
import { runKeywordEngine } from './keywords/keywordEngine.mjs';
import { runContentGapEngine } from './content/contentGapEngine.mjs';
import { runLinkGraphEngine } from './internal-links/linkGraphEngine.mjs';
import { runBacklinkEngine } from './backlinks/backlinkEngine.mjs';
import { runReportGenerator } from './reports/reportGenerator.mjs';

export async function runAllSeo() {
  console.log('====================================================');
  console.log('   TOOLVERSE.BABY — AUTONOMOUS SEO ENGINE RUNNER    ');
  console.log('====================================================');

  console.log('\n[Stage 1/8] Executing Site Crawler...');
  runSiteCrawler();

  console.log('\n[Stage 2/8] Running Technical SEO Audit...');
  runTechnicalAudit();

  console.log('\n[Stage 3/8] Running Accessibility & Semantic HTML Audit...');
  runAccessibilityAudit();

  console.log('\n[Stage 4/8] Running Keyword Intelligence Engine...');
  runKeywordEngine();

  console.log('\n[Stage 5/8] Running Content Gap & AEO/GEO Engine...');
  runContentGapEngine();

  console.log('\n[Stage 6/8] Running Internal Link Graph & PageRank Simulator...');
  runLinkGraphEngine();

  console.log('\n[Stage 7/8] Running Authority & Backlink Prospecting Engine...');
  runBacklinkEngine();

  console.log('\n[Stage 8/8] Generating Consolidated SEO Reports...');
  const report = runReportGenerator();

  console.log('\n====================================================');
  console.log(`   SEO ENGINE EXECUTION COMPLETE! SCORE: ${report.compositeSeoScore}/100    `);
  console.log('   Reports written to: /seo/reports/latest.json & .md ');
  console.log('====================================================');
}

runAllSeo().catch((err) => {
  console.error('[SEO Engine Error]', err);
  process.exit(1);
});
