import { describe, expect, it } from 'vitest';
import { NEWS_CATEGORIES, formatNewsDate } from '../lib/news/newsEngine';

describe('newsEngine', () => {
  it('exposes tier-1 news categories', () => {
    const ids = NEWS_CATEGORIES.map((c) => c.id);
    expect(ids).toEqual(['all', 'us', 'uk', 'tech', 'finance', 'gaming']);
  });

  it('formats ISO dates safely', () => {
    expect(formatNewsDate(null)).toBe('Recently');
    expect(formatNewsDate('not-a-date')).toBe('Recently');
    const label = formatNewsDate('2026-03-10T12:00:00.000Z');
    expect(label).not.toBe('Recently');
    expect(label.length).toBeGreaterThan(3);
  });
});
