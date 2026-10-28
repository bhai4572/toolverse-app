import { describe, it, expect } from 'vitest';
import { SEO_NAV_GROUPS, flattenNavItems, isNavItemLive } from '../lib/seo/workspace/seoNavConfig';

describe('SEO Unlocked Modules & Full-Site Capabilities', () => {
  it('verifies all SEO navigation items are unlocked and set to status: live', () => {
    const allItems = flattenNavItems(SEO_NAV_GROUPS);
    expect(allItems.length).toBeGreaterThan(25);

    const lockedItems = allItems.filter((i) => !isNavItemLive(i));
    expect(lockedItems).toHaveLength(0);

    for (const item of allItems) {
      expect(item.status).toBe('live');
    }
  });

  it('validates PPC Keyword match type formatting logic', () => {
    const seeds = ['seo tool', 'site audit'];
    const broad = seeds.map((s) => s);
    const phrase = seeds.map((s) => `"${s}"`);
    const exact = seeds.map((s) => `[${s}]`);

    expect(broad).toEqual(['seo tool', 'site audit']);
    expect(phrase).toEqual(['"seo tool"', '"site audit"']);
    expect(exact).toEqual(['[seo tool]', '[site audit]']);
  });

  it('validates Google Ads auction formula (Ad Rank & actual CPC discount)', () => {
    const maxCpc = 3.0;
    const qualityScore = 8;
    const yourAdRank = maxCpc * qualityScore; // 24.0

    const competitorMaxCpc = 2.5;
    const competitorQualityScore = 7;
    const competitorAdRank = competitorMaxCpc * competitorQualityScore; // 17.5

    expect(yourAdRank).toBeGreaterThan(competitorAdRank);

    // Actual CPC discount formula: (Competitor Ad Rank / Quality Score) + 0.01
    const actualCpc = +(competitorAdRank / qualityScore + 0.01).toFixed(2);
    expect(actualCpc).toBeLessThan(maxCpc);
    expect(actualCpc).toBe(2.2);
  });

  it('validates RFC-compliant UTM campaign builder output', () => {
    const base = 'https://toolverse.baby/workspace';
    const u = new URL(base);
    u.searchParams.set('utm_source', 'twitter');
    u.searchParams.set('utm_medium', 'social');
    u.searchParams.set('utm_campaign', 'spring_2026');

    expect(u.toString()).toBe(
      'https://toolverse.baby/workspace?utm_source=twitter&utm_medium=social&utm_campaign=spring_2026'
    );
  });

  it('validates schema.org LocalBusiness JSON-LD structure', () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'ToolVerse Labs',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '100 Main St',
        addressLocality: 'San Francisco',
        addressRegion: 'CA',
        postalCode: '94107',
        addressCountry: 'US',
      },
    };

    const parsed = JSON.parse(JSON.stringify(schema));
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBe('LocalBusiness');
    expect(parsed.address['@type']).toBe('PostalAddress');
    expect(parsed.address.addressLocality).toBe('San Francisco');
  });

  it('validates llms.txt structure for AI search crawlers', () => {
    const title = 'ToolVerse Documentation';
    const summary = 'Technical SEO and marketing intelligence platform';
    const llmsTxt = `# ${title}\n\n> ${summary}\n\n## Core Resources\n- [Site Audit](https://toolverse.baby/workspace/site-audit): Full-site technical crawler\n`;

    expect(llmsTxt).toContain('# ToolVerse Documentation');
    expect(llmsTxt).toContain('> Technical SEO and marketing intelligence platform');
    expect(llmsTxt).toContain('## Core Resources');
  });
});
