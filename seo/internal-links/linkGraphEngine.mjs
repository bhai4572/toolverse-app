/**
 * ToolVerse Autonomous SEO Engine — Internal Link Graph & PageRank Simulator
 * Builds graph topology, computes in/out degrees, runs power-iteration PageRank, and suggests contextual link opportunities.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');

export function runLinkGraphEngine() {
  console.log('[Link Graph Engine] Simulating PageRank and analyzing internal link equity...');

  const crawlPath = path.join(root, 'seo/data/crawl_results.json');
  if (!fs.existsSync(crawlPath)) {
    throw new Error('crawl_results.json missing — run crawler first');
  }

  const crawlData = JSON.parse(fs.readFileSync(crawlPath, 'utf8'));
  const pages = crawlData.pages;

  const nodeMap = new Map();
  pages.forEach((p, index) => {
    nodeMap.set(p.path, {
      id: index,
      path: p.path,
      url: p.url,
      pageType: p.pageType,
      title: p.title,
      outLinks: p.outgoingInternalLinks || [],
      inLinks: [],
      pageRank: 1.0 / pages.length,
    });
  });

  // Populate incoming links
  for (const [pathKey, node] of nodeMap.entries()) {
    for (const targetPath of node.outLinks) {
      if (nodeMap.has(targetPath)) {
        nodeMap.get(targetPath).inLinks.push(pathKey);
      }
    }
  }

  // Run PageRank algorithm (damping factor 0.85, 30 iterations)
  const d = 0.85;
  const N = pages.length;
  const iterations = 30;

  for (let it = 0; it < iterations; it++) {
    const nextRanks = new Map();
    let sinkRank = 0;

    for (const [, node] of nodeMap.entries()) {
      if (node.outLinks.length === 0) {
        sinkRank += node.pageRank;
      }
    }

    for (const [pathKey, node] of nodeMap.entries()) {
      let rankSum = 0;
      for (const inPath of node.inLinks) {
        const inNode = nodeMap.get(inPath);
        if (inNode && inNode.outLinks.length > 0) {
          rankSum += inNode.pageRank / inNode.outLinks.length;
        }
      }
      const newRank = (1 - d) / N + d * (rankSum + sinkRank / N);
      nextRanks.set(pathKey, newRank);
    }

    for (const [pathKey, newRank] of nextRanks.entries()) {
      nodeMap.get(pathKey).pageRank = newRank;
    }
  }

  const nodesList = Array.from(nodeMap.values()).map((n) => ({
    path: n.path,
    url: n.url,
    pageType: n.pageType,
    title: n.title,
    inDegree: n.inLinks.length,
    outDegree: n.outLinks.length,
    pageRankScore: Number((n.pageRank * 1000).toFixed(4)),
    isOrphan: n.inLinks.length === 0 && n.path !== '/',
    isUnderlinked: n.inLinks.length < 3 && n.pageType === 'tool',
  }));

  nodesList.sort((a, b) => b.pageRankScore - a.pageRankScore);

  const orphans = nodesList.filter((n) => n.isOrphan);
  const underlinkedTools = nodesList.filter((n) => n.isUnderlinked);

  // Generate actionable link recommendations
  const linkRecommendations = [];

  // Pair related tools
  const toolNodes = nodesList.filter((n) => n.pageType === 'tool');
  for (const t of toolNodes) {
    if (t.isUnderlinked) {
      // Find tools in same category to cross-link
      const prefix = t.path.replace('/tools/', '').split('-')[0];
      const companion = toolNodes.find((other) => other.path !== t.path && other.path.includes(prefix));
      linkRecommendations.push({
        sourcePage: companion ? companion.path : '/blog',
        targetPage: t.path,
        anchorTextTarget: t.title.split('—')[0].trim(),
        rationale: 'Pass link equity from companion utility to boost crawl discovery and rank potential.',
        expectedPageRankBoost: '+15%',
      });
    }
  }

  const result = {
    timestamp: new Date().toISOString(),
    totalNodes: nodesList.length,
    averageInDegree: Number((nodesList.reduce((acc, n) => acc + n.inDegree, 0) / nodesList.length).toFixed(1)),
    orphansCount: orphans.length,
    orphans,
    underlinkedToolsCount: underlinkedTools.length,
    topAuthorityPages: nodesList.slice(0, 10),
    linkRecommendations: linkRecommendations.slice(0, 15),
    nodeGraph: nodesList,
  };

  const dataDir = path.join(root, 'seo/data');
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'internal_links.json'), JSON.stringify(result, null, 2));

  console.log(
    `[Link Graph Engine] PageRank complete. Top authority: ${nodesList[0]?.path} (${nodesList[0]?.pageRankScore}). Underlinked tools: ${underlinkedTools.length}.`
  );
  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runLinkGraphEngine();
}
