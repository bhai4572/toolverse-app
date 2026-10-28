/**
 * ToolVerse Keyword Expansion & Intent Engine
 * Provides authentic seed expansion, question discovery, intent classification,
 * topic clustering, and negative filtering without fabricating synthetic search volume.
 */

export type KeywordIntent = 'informational' | 'commercial' | 'transactional' | 'navigational';

export interface KeywordIdea {
  keyword: string;
  intent: KeywordIntent;
  category: 'seed' | 'question' | 'commercial' | 'informational' | 'comparison';
  rootTopic: string;
}

export interface KeywordCluster {
  rootTopic: string;
  intent: KeywordIntent;
  count: number;
  keywords: string[];
}

const QUESTION_PREFIXES = [
  'how to',
  'what is',
  'why does',
  'when to',
  'where to find',
  'who is',
  'can you',
  'is it safe to',
  'which is better',
];

const COMMERCIAL_MODIFIERS = [
  'best',
  'top',
  'vs',
  'versus',
  'review',
  'reviews',
  'pricing',
  'cost',
  'alternative',
  'alternatives',
  'comparison',
];

const TRANSACTIONAL_MODIFIERS = [
  'buy',
  'order',
  'purchase',
  'discount',
  'coupon',
  'deal',
  'hire',
  'download',
  'service',
  'near me',
];

const DEFAULT_NEGATIVES = ['crack', 'torrent', 'warez', 'nulled', 'keygen', 'hack'];

export function classifyIntent(keyword: string): KeywordIntent {
  const lower = keyword.toLowerCase().trim();

  // Transactional checks
  for (const mod of TRANSACTIONAL_MODIFIERS) {
    if (new RegExp(`\\b${mod}\\b`, 'i').test(lower)) {
      return 'transactional';
    }
  }

  // Commercial checks
  for (const mod of COMMERCIAL_MODIFIERS) {
    if (new RegExp(`\\b${mod}\\b`, 'i').test(lower)) {
      return 'commercial';
    }
  }

  // Informational checks
  for (const q of QUESTION_PREFIXES) {
    if (lower.startsWith(q) || new RegExp(`\\b${q}\\b`, 'i').test(lower)) {
      return 'informational';
    }
  }
  if (/\b(guide|tutorial|steps|tips|examples|definition|meaning)\b/i.test(lower)) {
    return 'informational';
  }

  // Default intent
  return 'informational';
}

export function expandKeywords(
  seed: string,
  options: {
    negativeWords?: string[];
    includeQuestions?: boolean;
    includeCommercial?: boolean;
  } = {}
): KeywordIdea[] {
  const cleanSeed = seed.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '');
  if (!cleanSeed) return [];

  const negatives = new Set([
    ...DEFAULT_NEGATIVES,
    ...(options.negativeWords || []).map((w) => w.toLowerCase().trim()),
  ]);

  const results: KeywordIdea[] = [];
  const seen = new Set<string>();

  const add = (kw: string, category: KeywordIdea['category']) => {
    const trimmed = kw.trim();
    if (trimmed.length < 3) return;
    if (seen.has(trimmed)) return;

    // Check negatives
    for (const neg of negatives) {
      if (neg && new RegExp(`\\b${neg}\\b`, 'i').test(trimmed)) {
        return;
      }
    }

    seen.add(trimmed);
    results.push({
      keyword: trimmed,
      intent: classifyIntent(trimmed),
      category,
      rootTopic: cleanSeed,
    });
  };

  // Base seed
  add(cleanSeed, 'seed');

  // Commercial expansions
  if (options.includeCommercial !== false) {
    add(`best ${cleanSeed}`, 'commercial');
    add(`top 10 ${cleanSeed}`, 'commercial');
    add(`${cleanSeed} reviews`, 'commercial');
    add(`${cleanSeed} pricing`, 'commercial');
    add(`${cleanSeed} alternatives`, 'commercial');
    add(`${cleanSeed} vs competitors`, 'comparison');
    add(`${cleanSeed} for small business`, 'commercial');
    add(`${cleanSeed} for enterprise`, 'commercial');
    add(`affordable ${cleanSeed}`, 'commercial');
    add(`free vs paid ${cleanSeed}`, 'comparison');
  }

  // Question expansions
  if (options.includeQuestions !== false) {
    add(`how to use ${cleanSeed}`, 'question');
    add(`what is ${cleanSeed}`, 'question');
    add(`why do you need ${cleanSeed}`, 'question');
    add(`when should you use ${cleanSeed}`, 'question');
    add(`can you do ${cleanSeed} for free`, 'question');
    add(`how does ${cleanSeed} work`, 'question');
    add(`is ${cleanSeed} worth it`, 'question');
  }

  // Long-tail & modifier patterns
  add(`${cleanSeed} guide`, 'informational');
  add(`${cleanSeed} checklist`, 'informational');
  add(`${cleanSeed} tutorial for beginners`, 'informational');
  add(`${cleanSeed} best practices`, 'informational');
  add(`${cleanSeed} examples`, 'informational');
  add(`${cleanSeed} template`, 'informational');
  add(`${cleanSeed} tips and tricks`, 'informational');

  return results;
}

export function clusterKeywords(ideas: KeywordIdea[]): KeywordCluster[] {
  const clusterMap = new Map<string, KeywordIdea[]>();

  for (const idea of ideas) {
    // Cluster by category / sub-topic
    const key = idea.category;
    const existing = clusterMap.get(key) || [];
    existing.push(idea);
    clusterMap.set(key, existing);
  }

  const clusters: KeywordCluster[] = [];
  for (const [cat, kws] of clusterMap.entries()) {
    clusters.push({
      rootTopic: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Clusters`,
      intent: kws[0]?.intent || 'informational',
      count: kws.length,
      keywords: kws.map((k) => k.keyword),
    });
  }

  return clusters;
}
