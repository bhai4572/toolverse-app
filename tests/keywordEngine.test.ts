import { describe, it, expect } from 'vitest';
import {
  classifyIntent,
  expandKeywords,
  clusterKeywords,
} from '../lib/seo/keywords/keywordEngine';

describe('Keyword Expansion and Intent Engine', () => {
  it('correctly classifies search intent based on syntax patterns', () => {
    expect(classifyIntent('how to audit technical seo')).toBe('informational');
    expect(classifyIntent('best seo tools 2026')).toBe('commercial');
    expect(classifyIntent('buy domain names online')).toBe('transactional');
    expect(classifyIntent('free vs paid site crawler')).toBe('commercial');
    expect(classifyIntent('what is a canonical link')).toBe('informational');
  });

  it('expands seed queries into diverse questions and commercial terms', () => {
    const ideas = expandKeywords('rank tracker');
    expect(ideas.length).toBeGreaterThan(10);

    const questions = ideas.filter((i) => i.category === 'question');
    expect(questions.length).toBeGreaterThan(3);
    expect(questions.some((q) => q.keyword.includes('how'))).toBe(true);

    const commercial = ideas.filter((i) => i.category === 'commercial');
    expect(commercial.some((c) => c.keyword.includes('best'))).toBe(true);
  });

  it('filters negative keywords', () => {
    const ideas = expandKeywords('pdf merge software', {
      negativeWords: ['crack', 'torrent'],
    });

    for (const idea of ideas) {
      expect(idea.keyword).not.toContain('crack');
      expect(idea.keyword).not.toContain('torrent');
    }
  });

  it('clusters expanded ideas into topic groups', () => {
    const ideas = expandKeywords('website speed');
    const clusters = clusterKeywords(ideas);
    expect(clusters.length).toBeGreaterThanOrEqual(2);
    expect(clusters.every((c) => c.keywords.length > 0)).toBe(true);
  });
});
