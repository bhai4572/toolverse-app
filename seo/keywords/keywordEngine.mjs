/**
 * ToolVerse Autonomous SEO Engine — Keyword Intelligence Engine
 * Algorithmic keyword extraction, intent classification, semantic clustering, and cannibalization detection.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const BASE_URL = 'https://toolverse.baby';

export function runKeywordEngine() {
  console.log('[Keyword Engine] Generating keyword intelligence and semantic clustering...');

  const crawlPath = path.join(root, 'seo/data/crawl_results.json');
  if (!fs.existsSync(crawlPath)) {
    console.log('[Keyword Engine] crawl_results.json not found, running crawler first...');
    const { runSiteCrawler } = await import('../crawler/siteCrawler.mjs');
    runSiteCrawler();
  }

  const crawlData = JSON.parse(fs.readFileSync(crawlPath, 'utf8'));
  const pages = crawlData.pages;

  const ACTION_VERBS = [
    'compress',
    'merge',
    'split',
    'convert',
    'calculate',
    'resize',
    'format',
    'generate',
    'decode',
    'encode',
    'minify',
    'validate',
    'extract',
    'make',
    'counter',
  ];

  const INFORMATIONAL_TRIGGERS = [
    'how',
    'guide',
    'what',
    'tutorial',
    'checklist',
    'slabs',
    'rules',
    'steps',
    'explained',
  ];

  const COMMERCIAL_TRIGGERS = ['best', 'alternative', 'comparison', 'vs', 'rates', 'fees', 'pricing', 'calculator'];

  function classifyIntent(query, pageType) {
    const q = query.toLowerCase();
    if (q.includes('toolverse') || q === 'home') return 'Navigational';
    if (COMMERCIAL_TRIGGERS.some((t) => q.includes(t)) && !q.startsWith('how to')) return 'Commercial Investigation';
    if (INFORMATIONAL_TRIGGERS.some((t) => q.includes(t)) || pageType === 'blog') return 'Informational';
    if (ACTION_VERBS.some((v) => q.includes(v)) || pageType === 'tool') return 'Transactional';
    return 'Informational';
  }

  function extractSemanticVariations(toolName, category) {
    const clean = toolName.toLowerCase().replace(/—.*$/, '').trim();
    const variations = [
      `free online ${clean}`,
      `${clean} in browser`,
      `client side ${clean} private`,
      `fast ${clean} no upload`,
      `best free ${clean} 2026`,
    ];
    if (category.toLowerCase().includes('pdf')) {
      variations.push(`${clean} without acrobat`, `merge pdf local`);
    } else if (category.toLowerCase().includes('image')) {
      variations.push(`${clean} under 50kb`, `compress photo for portal`);
    } else if (category.toLowerCase().includes('finance') || category.toLowerCase().includes('tax')) {
      variations.push(`${clean} pakistan 2025 2026`, `${clean} net income`);
    }
    return variations;
  }

  const keywordDatabase = [];
  const clusterMap = new Map();

  for (const page of pages) {
    if (page.pageType === 'home' || page.pageType === 'legal') continue;

    const rawTitle = page.h1 || page.title.split('—')[0].trim();
    const primaryKeyword = rawTitle.toLowerCase();
    const intent = classifyIntent(primaryKeyword, page.pageType);
    const cluster = page.path.split('/')[1] || 'general';

    const semanticTerms = extractSemanticVariations(rawTitle, cluster);
    const longTailOpportunities = semanticTerms.map((term) => ({
      query: term,
      intent: classifyIntent(term, page.pageType),
      difficultyEst: term.split(' ').length > 4 ? 'Low' : 'Medium',
      serpFeatureTarget: intent === 'Informational' ? 'Featured Snippet / AI Overview' : 'Direct Utility Result',
    }));

    const entry = {
      targetUrl: page.url,
      path: page.path,
      pageType: page.pageType,
      primaryKeyword,
      searchIntent: intent,
      topicalCluster: cluster,
      secondaryKeywords: semanticTerms.slice(0, 4),
      longTailOpportunities,
      priorityScore: intent === 'Transactional' ? 92 : intent === 'Commercial Investigation' ? 88 : 78,
      status: 'Indexed & Optimized',
    };

    keywordDatabase.push(entry);

    if (!clusterMap.has(cluster)) clusterMap.set(cluster, []);
    clusterMap.get(cluster).push(entry);
  }

  // Detect Keyword Cannibalization
  const cannibalizationAlerts = [];
  for (let i = 0; i < keywordDatabase.length; i++) {
    for (let j = i + 1; j < keywordDatabase.length; j++) {
      const a = keywordDatabase[i];
      const b = keywordDatabase[j];

      const tokensA = new Set(a.primaryKeyword.split(/\s+/).filter((w) => w.length > 3));
      const tokensB = new Set(b.primaryKeyword.split(/\s+/).filter((w) => w.length > 3));

      let intersection = 0;
      for (const t of tokensA) {
        if (tokensB.has(t)) intersection++;
      }
      const union = new Set([...tokensA, ...tokensB]).size;
      const jaccard = union > 0 ? intersection / union : 0;

      // Flag if high overlap and different URLs in same type
      if (jaccard >= 0.75 && a.pageType === b.pageType && a.targetUrl !== b.targetUrl) {
        cannibalizationAlerts.push({
          pageA: a.targetUrl,
          pageB: b.targetUrl,
          keywordA: a.primaryKeyword,
          keywordB: b.primaryKeyword,
          similarityScore: Math.round(jaccard * 100),
          recommendation:
            'Differentiate target query modifiers (e.g. target exact format vs general converter) or cross-link explicitly.',
        });
      }
    }
  }

  const result = {
    timestamp: new Date().toISOString(),
    totalKeywordsTracked: keywordDatabase.length,
    intentDistribution: {
      transactional: keywordDatabase.filter((k) => k.searchIntent === 'Transactional').length,
      informational: keywordDatabase.filter((k) => k.searchIntent === 'Informational').length,
      commercial: keywordDatabase.filter((k) => k.searchIntent === 'Commercial Investigation').length,
      navigational: keywordDatabase.filter((k) => k.searchIntent === 'Navigational').length,
    },
    clustersCount: clusterMap.size,
    cannibalizationAlertsCount: cannibalizationAlerts.length,
    cannibalizationAlerts,
    keywordDatabase,
  };

  const dataDir = path.join(root, 'seo/data');
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'keyword_database.json'), JSON.stringify(result, null, 2));

  console.log(
    `[Keyword Engine] Complete: ${keywordDatabase.length} mapped keywords, ${cannibalizationAlerts.length} cannibalization alerts.`
  );
  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runKeywordEngine();
}
