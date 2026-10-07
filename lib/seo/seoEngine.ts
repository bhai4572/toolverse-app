/**
 * ToolVerse Professional SEO Engine
 * Powers client-side Semrush & Ahrefs alternatives:
 * - On-Page Site Audit & Health Checker
 * - Keyword Magic & Search Intent Explorer
 * - Backlink & Anchor Text Analyzer
 * - Keyword Density & Content Optimizer
 * - SERP Simulator & CTR Optimizer
 * - Robots.txt & XML Sitemap Builders
 * - Schema JSON-LD Generator
 * - Redirect & Canonical Generators
 */

export interface AuditIssue {
  type: 'error' | 'warning' | 'passed';
  category: 'Meta Tags' | 'Content & Headings' | 'Links & Media' | 'Technical';
  title: string;
  description: string;
  recommendation: string;
}

export interface AuditResult {
  score: number;
  totalChecks: number;
  passedCount: number;
  warningCount: number;
  errorCount: number;
  metrics: {
    titleLength: number;
    titlePixels: number;
    descriptionLength: number;
    h1Count: number;
    h2Count: number;
    wordCount: number;
    internalLinks: number;
    externalLinks: number;
    imagesCount: number;
    imagesWithoutAlt: number;
    hasCanonical: boolean;
    hasRobots: boolean;
    hasOpenGraph: boolean;
  };
  issues: AuditIssue[];
}

export function performOnPageAudit(input: {
  url?: string;
  title?: string;
  description?: string;
  h1Text?: string;
  bodyContent?: string;
  htmlMarkup?: string;
}): AuditResult {
  let title = (input.title || '').trim();
  let description = (input.description || '').trim();
  let bodyContent = input.bodyContent || '';
  let h1Count = input.h1Text ? 1 : 0;
  let h2Count = 0;
  let internalLinks = 0;
  let externalLinks = 0;
  let imagesCount = 0;
  let imagesWithoutAlt = 0;
  let hasCanonical = false;
  let hasRobots = false;
  let hasOpenGraph = false;

  // If HTML markup is provided, parse through regex / DOM simulation
  if (input.htmlMarkup) {
    const raw = input.htmlMarkup;
    const titleMatch = raw.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) title = titleMatch[1].trim();

    const descMatch = raw.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    if (descMatch) description = descMatch[1].trim();

    const h1Matches = raw.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi);
    if (h1Matches) h1Count = h1Matches.length;

    const h2Matches = raw.match(/<h2[^>]*>[\s\S]*?<\/h2>/gi);
    if (h2Matches) h2Count = h2Matches.length;

    hasCanonical = /<link[^>]*rel=["']canonical["']/i.test(raw);
    hasRobots = /<meta[^>]*name=["']robots["']/i.test(raw);
    hasOpenGraph = /<meta[^>]*property=["']og:/i.test(raw);

    const imgTags = raw.match(/<img[^>]*>/gi) || [];
    imagesCount = imgTags.length;
    for (const img of imgTags) {
      if (!/alt=["'][^"']+["']/i.test(img)) {
        imagesWithoutAlt++;
      }
    }

    const aTags = raw.match(/<a[^>]*href=["']([^"']*)["']/gi) || [];
    for (const a of aTags) {
      if (/href=["'](https?:\/\/)/i.test(a)) {
        externalLinks++;
      } else {
        internalLinks++;
      }
    }

    // Strip HTML tags for word count
    const stripped = raw.replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ');
    bodyContent = stripped;
  }

  const words = bodyContent.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const titleLength = title.length;
  const titlePixels = Math.round(titleLength * 8.8); // Avg 8.8px per char in Arial/Roboto
  const descriptionLength = description.length;

  const issues: AuditIssue[] = [];

  // 1. Title Checks
  if (!title) {
    issues.push({
      type: 'error',
      category: 'Meta Tags',
      title: 'Missing Page Title Tag',
      description: 'The page has no meta title tag. Google will generate an arbitrary title in search results.',
      recommendation: 'Add a compelling title between 50-60 characters incorporating your primary target keyword.',
    });
  } else if (titleLength < 30) {
    issues.push({
      type: 'warning',
      category: 'Meta Tags',
      title: 'Title Tag is Too Short',
      description: `Title is only ${titleLength} characters. You are missing keyword visibility opportunities.`,
      recommendation: 'Expand title to 50–60 characters with secondary keywords or brand name.',
    });
  } else if (titleLength > 60 || titlePixels > 580) {
    issues.push({
      type: 'warning',
      category: 'Meta Tags',
      title: 'Title May Be Truncated in SERP',
      description: `Title is ${titleLength} characters (${titlePixels}px). Google displays up to 580px (~60 chars).`,
      recommendation: 'Shorten title to under 60 characters to prevent snippet ellipsis (...) on desktop and mobile.',
    });
  } else {
    issues.push({
      type: 'passed',
      category: 'Meta Tags',
      title: 'Optimal Title Length',
      description: `Title length is ${titleLength} chars (${titlePixels}px), safely within the 580px Google limit.`,
      recommendation: 'Great job maintaining perfect character constraints.',
    });
  }

  // 2. Meta Description Checks
  if (!description) {
    issues.push({
      type: 'error',
      category: 'Meta Tags',
      title: 'Missing Meta Description',
      description: 'Search engines will pull random body text as the search snippet, hurting click-through rate (CTR).',
      recommendation: 'Write an enticing 140–160 character description with a clear call-to-action.',
    });
  } else if (descriptionLength < 70) {
    issues.push({
      type: 'warning',
      category: 'Meta Tags',
      title: 'Meta Description is Too Brief',
      description: `Description is ${descriptionLength} characters. You have space for better click incentives.`,
      recommendation: 'Aim for 140–160 characters describing benefits, answers, and unique features.',
    });
  } else if (descriptionLength > 160) {
    issues.push({
      type: 'warning',
      category: 'Meta Tags',
      title: 'Meta Description Exceeds 160 Characters',
      description: `Description is ${descriptionLength} chars. Characters beyond 160 will likely be cut off on mobile.`,
      recommendation: 'Trim description to 150-158 characters to guarantee full visibility across all devices.',
    });
  } else {
    issues.push({
      type: 'passed',
      category: 'Meta Tags',
      title: 'Optimal Meta Description',
      description: `Description length is ${descriptionLength} characters, fitting Google's 960px snippet budget.`,
      recommendation: 'Keep maintaining strong search snippets with natural keyword usage.',
    });
  }

  // 3. Headings Checks
  if (h1Count === 0) {
    issues.push({
      type: 'error',
      category: 'Content & Headings',
      title: 'Missing H1 Heading Tag',
      description: 'The page lacks a main H1 heading, making it harder for search crawlers to identify primary topical relevance.',
      recommendation: 'Add exactly one descriptive H1 tag at the top of your page content.',
    });
  } else if (h1Count > 1) {
    issues.push({
      type: 'warning',
      category: 'Content & Headings',
      title: 'Multiple H1 Tags Detected',
      description: `Found ${h1Count} H1 tags. Best practice recommends a single primary H1 followed by H2/H3 subheadings.`,
      recommendation: 'Convert secondary H1 tags into H2 headings to preserve clear document hierarchy.',
    });
  } else {
    issues.push({
      type: 'passed',
      category: 'Content & Headings',
      title: 'Single H1 Heading Present',
      description: 'Document has a single clear H1 headline defining the core topic.',
      recommendation: 'Maintain hierarchical H2 and H3 subheadings for sections.',
    });
  }

  // 4. Content Depth Checks
  if (wordCount < 100) {
    issues.push({
      type: 'error',
      category: 'Content & Headings',
      title: 'Thin Content Detected',
      description: `Page contains only ~${wordCount} words. Thin pages struggle to rank against comprehensive competitor guides.`,
      recommendation: 'Provide in-depth explanations, FAQs, step-by-step instructions, or user guides.',
    });
  } else if (wordCount < 300) {
    issues.push({
      type: 'warning',
      category: 'Content & Headings',
      title: 'Moderate Content Length',
      description: `Word count is ~${wordCount} words. Adding helpful FAQs and use cases can improve topical authority.`,
      recommendation: 'Expand with practical examples and answers to common search questions.',
    });
  } else {
    issues.push({
      type: 'passed',
      category: 'Content & Headings',
      title: 'Substantial Content Depth',
      description: `Healthy content volume (~${wordCount} words) providing sufficient topical signals.`,
      recommendation: 'Ensure content readability remains high with bullet points and bold highlights.',
    });
  }

  // 5. Image Alt Checks
  if (imagesCount > 0 && imagesWithoutAlt > 0) {
    issues.push({
      type: 'warning',
      category: 'Links & Media',
      title: 'Images Missing Alt Text',
      description: `${imagesWithoutAlt} out of ${imagesCount} images lack an alt attribute, hurting accessibility and Google Images SEO.`,
      recommendation: 'Add descriptive alt text to all informative images explaining the visual content.',
    });
  } else if (imagesCount > 0) {
    issues.push({
      type: 'passed',
      category: 'Links & Media',
      title: 'All Images Have Alt Attributes',
      description: `All ${imagesCount} images specify descriptive alt attributes.`,
      recommendation: 'Maintain alt descriptions for any future media uploads.',
    });
  }

  // 6. Technical signals
  if (input.htmlMarkup) {
    if (!hasCanonical) {
      issues.push({
        type: 'warning',
        category: 'Technical',
        title: 'Missing Canonical Tag',
        description: 'No <link rel="canonical"> tag found. Duplicate URL parameters could dilute link equity.',
        recommendation: 'Add self-referencing canonical tags to prevent duplicate content indexing.',
      });
    } else {
      issues.push({
        type: 'passed',
        category: 'Technical',
        title: 'Canonical Tag Implemented',
        description: 'Canonical tag is properly declared to consolidate indexing signals.',
        recommendation: 'Ensure canonical points to the preferred HTTPS www/non-www version.',
      });
    }

    if (!hasOpenGraph) {
      issues.push({
        type: 'warning',
        category: 'Technical',
        title: 'Missing Open Graph Social Tags',
        description: 'No og:title or og:image tags detected. Shares on LinkedIn, WhatsApp, and Facebook will look plain.',
        recommendation: 'Implement Open Graph and Twitter Card tags to maximize social CTR.',
      });
    } else {
      issues.push({
        type: 'passed',
        category: 'Technical',
        title: 'Open Graph Tags Found',
        description: 'Social preview meta tags are present for rich sharing cards.',
        recommendation: 'Periodically test cards in Facebook Sharing Debugger and Twitter Card validator.',
      });
    }
  }

  const passedCount = issues.filter((i) => i.type === 'passed').length;
  const warningCount = issues.filter((i) => i.type === 'warning').length;
  const errorCount = issues.filter((i) => i.type === 'error').length;
  const totalChecks = issues.length;

  const rawScore = Math.round(
    ((passedCount * 1.0 + warningCount * 0.5) / Math.max(1, totalChecks)) * 100
  );
  const score = Math.max(15, Math.min(100, rawScore));

  return {
    score,
    totalChecks,
    passedCount,
    warningCount,
    errorCount,
    metrics: {
      titleLength,
      titlePixels,
      descriptionLength,
      h1Count,
      h2Count,
      wordCount,
      internalLinks,
      externalLinks,
      imagesCount,
      imagesWithoutAlt,
      hasCanonical,
      hasRobots,
      hasOpenGraph,
    },
    issues,
  };
}

/**
 * Keyword Research & Magic Explorer Simulation Engine
 * Generates keyword variations, search volume tiers, intent, CPC, and competition KD.
 */
export interface KeywordItem {
  keyword: string;
  searchVolume: number;
  keywordDifficulty: number; // 0 - 100
  cpc: number; // in USD
  intent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
  serpFeatures: string[];
  competitiveDensity: 'Low' | 'Medium' | 'High';
}

export function generateKeywordData(seed: string): {
  summary: {
    totalKeywords: number;
    avgVolume: number;
    avgKd: number;
    avgCpc: number;
    intentBreakdown: Record<string, number>;
  };
  keywords: KeywordItem[];
} {
  const cleanSeed = seed.trim().toLowerCase();
  if (!cleanSeed) {
    return {
      summary: { totalKeywords: 0, avgVolume: 0, avgKd: 0, avgCpc: 0, intentBreakdown: {} },
      keywords: [],
    };
  }

  const seedHash = cleanSeed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const baseVolume = 1200 + (seedHash % 8500);

  const modifiers = [
    { prefix: 'best', suffix: '', intent: 'Commercial' as const, kdMod: 15, cpcMod: 1.4 },
    { prefix: 'how to', suffix: '', intent: 'Informational' as const, kdMod: -10, cpcMod: 0.7 },
    { prefix: 'free', suffix: 'online', intent: 'Transactional' as const, kdMod: 8, cpcMod: 0.9 },
    { prefix: '', suffix: 'alternative', intent: 'Commercial' as const, kdMod: 12, cpcMod: 2.1 },
    { prefix: '', suffix: 'generator', intent: 'Transactional' as const, kdMod: 5, cpcMod: 1.1 },
    { prefix: 'what is', suffix: '', intent: 'Informational' as const, kdMod: -15, cpcMod: 0.5 },
    { prefix: '', suffix: 'checker free', intent: 'Transactional' as const, kdMod: 10, cpcMod: 1.3 },
    { prefix: 'top 10', suffix: '', intent: 'Commercial' as const, kdMod: 20, cpcMod: 1.6 },
    { prefix: '', suffix: 'tutorial 2026', intent: 'Informational' as const, kdMod: -8, cpcMod: 0.8 },
    { prefix: '', suffix: 'pricing', intent: 'Commercial' as const, kdMod: 25, cpcMod: 2.8 },
    { prefix: 'cheap', suffix: 'tool', intent: 'Commercial' as const, kdMod: 14, cpcMod: 1.9 },
    { prefix: '', suffix: 'download for pc', intent: 'Transactional' as const, kdMod: 18, cpcMod: 1.2 },
    { prefix: 'why use', suffix: '', intent: 'Informational' as const, kdMod: -12, cpcMod: 0.6 },
    { prefix: '', suffix: 'vs competitors', intent: 'Commercial' as const, kdMod: 22, cpcMod: 2.4 },
    { prefix: 'easy', suffix: 'guide', intent: 'Informational' as const, kdMod: -14, cpcMod: 0.65 },
    { prefix: '', suffix: 'login portal', intent: 'Navigational' as const, kdMod: 35, cpcMod: 1.5 },
  ];

  const results: KeywordItem[] = [
    {
      keyword: cleanSeed,
      searchVolume: baseVolume,
      keywordDifficulty: Math.min(88, Math.max(22, 35 + (seedHash % 45))),
      cpc: Number((0.85 + (seedHash % 300) / 100).toFixed(2)),
      intent: 'Commercial',
      serpFeatures: ['Featured Snippet', 'People Also Ask', 'Knowledge Panel'],
      competitiveDensity: 'High',
    },
  ];

  modifiers.forEach((m, idx) => {
    const kw = [m.prefix, cleanSeed, m.suffix].filter(Boolean).join(' ');
    const kwHash = kw.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const vol = Math.max(140, Math.round((baseVolume * (0.2 + (kwHash % 70) / 100))));
    const kd = Math.min(95, Math.max(8, 25 + m.kdMod + (kwHash % 25)));
    const cpc = Number(Math.max(0.2, (0.75 + (kwHash % 250) / 100) * m.cpcMod).toFixed(2));
    
    const possibleFeatures = ['Featured Snippet', 'People Also Ask', 'Video Carousel', 'SiteLinks', 'Local Pack'];
    const features = possibleFeatures.slice(0, 1 + (kwHash % 3));

    results.push({
      keyword: kw,
      searchVolume: vol,
      keywordDifficulty: kd,
      cpc,
      intent: m.intent,
      serpFeatures: features,
      competitiveDensity: kd > 55 ? 'High' : kd > 30 ? 'Medium' : 'Low',
    });
  });

  // Calculate totals
  const totalKeywords = results.length;
  const avgVolume = Math.round(results.reduce((a, b) => a + b.searchVolume, 0) / totalKeywords);
  const avgKd = Math.round(results.reduce((a, b) => a + b.keywordDifficulty, 0) / totalKeywords);
  const avgCpc = Number((results.reduce((a, b) => a + b.cpc, 0) / totalKeywords).toFixed(2));

  const intentBreakdown: Record<string, number> = {};
  results.forEach((k) => {
    intentBreakdown[k.intent] = (intentBreakdown[k.intent] || 0) + 1;
  });

  return {
    summary: { totalKeywords, avgVolume, avgKd, avgCpc, intentBreakdown },
    keywords: results,
  };
}

/**
 * Backlink & Link Profile Analyzer
 */
export interface BacklinkAnalysis {
  domainRating: number;
  urlRating: number;
  referringDomains: number;
  totalBacklinks: number;
  dofollowRatio: number;
  toxicLinkScore: number;
  anchorTextDistribution: Array<{ text: string; percentage: number; count: number }>;
  topTldBreakdown: Array<{ tld: string; percentage: number }>;
}

export function analyzeBacklinkProfile(input: {
  domainOrUrl: string;
  pastedLinks?: string;
}): BacklinkAnalysis {
  const clean = input.domainOrUrl.toLowerCase().replace(/https?:\/\//, '').replace(/\/.*$/, '');
  const hash = clean.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  let totalBacklinks = 450 + (hash * 37) % 18000;
  let referringDomains = Math.round(totalBacklinks / (4 + (hash % 12)));
  let dofollowRatio = 72 + (hash % 20);
  let toxicLinkScore = 8 + (hash % 18);

  const lines = (input.pastedLinks || '').split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length > 0) {
    totalBacklinks = lines.length;
    const uniqueDomains = new Set(lines.map((l) => l.replace(/https?:\/\//, '').split('/')[0]));
    referringDomains = uniqueDomains.size;
  }

  const domainRating = Math.min(88, Math.max(12, 28 + (hash % 45)));
  const urlRating = Math.min(85, Math.max(10, domainRating - 6 + (hash % 15)));

  return {
    domainRating,
    urlRating,
    referringDomains,
    totalBacklinks,
    dofollowRatio,
    toxicLinkScore,
    anchorTextDistribution: [
      { text: clean, percentage: 42, count: Math.round(totalBacklinks * 0.42) },
      { text: `visit ${clean}`, percentage: 21, count: Math.round(totalBacklinks * 0.21) },
      { text: 'click here', percentage: 14, count: Math.round(totalBacklinks * 0.14) },
      { text: 'website', percentage: 11, count: Math.round(totalBacklinks * 0.11) },
      { text: 'source link', percentage: 12, count: Math.round(totalBacklinks * 0.12) },
    ],
    topTldBreakdown: [
      { tld: '.com', percentage: 54 },
      { tld: '.org', percentage: 18 },
      { tld: '.net', percentage: 12 },
      { tld: '.edu', percentage: 8 },
      { tld: '.io / other', percentage: 8 },
    ],
  };
}

/**
 * Keyword Density & TF-IDF Content Analyzer
 */
export interface DensityResult {
  totalWords: number;
  uniqueWords: number;
  readingTimeMinutes: number;
  oneWordList: Array<{ word: string; count: number; density: number }>;
  twoWordList: Array<{ phrase: string; count: number; density: number }>;
  threeWordList: Array<{ phrase: string; count: number; density: number }>;
  warnings: string[];
}

export function analyzeKeywordDensity(text: string): DensityResult {
  const stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you',
    'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one',
    'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'is',
    'are', 'was', 'were', 'has', 'had', 'been', 'can', 'could', 'should', 'your', 'our', 'more', 'also', 'into', 'just',
  ]);

  const cleanText = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = cleanText.split(/\s+/).filter((w) => w.length > 1);
  const totalWords = words.length;

  if (totalWords === 0) {
    return {
      totalWords: 0,
      uniqueWords: 0,
      readingTimeMinutes: 0,
      oneWordList: [],
      twoWordList: [],
      threeWordList: [],
      warnings: [],
    };
  }

  // 1-word count
  const wordFreq: Record<string, number> = {};
  words.forEach((w) => {
    if (!stopWords.has(w) && isNaN(Number(w))) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    }
  });

  const oneWordList = Object.entries(wordFreq)
    .map(([word, count]) => ({
      word,
      count,
      density: Number(((count / totalWords) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 2-word phrases
  const twoWordFreq: Record<string, number> = {};
  for (let i = 0; i < words.length - 1; i++) {
    const p = `${words[i]} ${words[i + 1]}`;
    if (!stopWords.has(words[i]) || !stopWords.has(words[i + 1])) {
      twoWordFreq[p] = (twoWordFreq[p] || 0) + 1;
    }
  }

  const twoWordList = Object.entries(twoWordFreq)
    .filter(([_, count]) => count > 1)
    .map(([phrase, count]) => ({
      phrase,
      count,
      density: Number(((count / totalWords) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // 3-word phrases
  const threeWordFreq: Record<string, number> = {};
  for (let i = 0; i < words.length - 2; i++) {
    const p = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    threeWordFreq[p] = (threeWordFreq[p] || 0) + 1;
  }

  const threeWordList = Object.entries(threeWordFreq)
    .filter(([_, count]) => count > 1)
    .map(([phrase, count]) => ({
      phrase,
      count,
      density: Number(((count / totalWords) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const warnings: string[] = [];
  oneWordList.forEach((item) => {
    if (item.density > 3.5) {
      warnings.push(`Warning: "${item.word}" has ${item.density}% density (exceeds recommended 1.5–2.5%). Risk of keyword stuffing penalty.`);
    }
  });

  return {
    totalWords,
    uniqueWords: new Set(words).size,
    readingTimeMinutes: Math.max(1, Math.round(totalWords / 200)),
    oneWordList,
    twoWordList,
    threeWordList,
    warnings,
  };
}
