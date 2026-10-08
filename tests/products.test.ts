import { describe, it, expect } from 'vitest';
import { PRODUCTS, getProductBySlug, getProductsByCategory } from '../lib/products/registry';
import { ALTERNATIVE_PAGES, getAlternativeBySlug } from '../lib/products/alternativesRegistry';
import { COMPARISON_PAGES, getComparisonBySlug } from '../lib/products/comparisonsRegistry';
import { QUESTIONS, getQuestionBySlug } from '../lib/products/questionsRegistry';
import { COLLECTIONS, getCollectionBySlug } from '../lib/products/collectionsRegistry';
import { evaluateProductPageQuality } from '../lib/products/seoQualityEngine';

describe('Global Product Discovery & Ecosystem Tests', () => {
  it('ensures all registered products have valid required fields and unique slugs', () => {
    const slugs = PRODUCTS.map((p) => p.slug);
    const set = new Set(slugs);
    expect(slugs.length).toBe(set.size);

    PRODUCTS.forEach((prod) => {
      expect(prod.name).toBeTruthy();
      expect(prod.description).toBeTruthy();
      expect(prod.websiteUrl.startsWith('http')).toBe(true);
      expect(prod.categorySlug).toBeTruthy();
      expect(prod.pricingPlans.length).toBeGreaterThan(0);
      expect(prod.status).toBe('approved');
    });
  });

  it('verifies product quality gate score evaluation', () => {
    const canva = getProductBySlug('canva');
    expect(canva).toBeDefined();

    if (canva) {
      const quality = evaluateProductPageQuality(canva);
      expect(quality.score).toBeGreaterThanOrEqual(70);
      expect(quality.isIndexable).toBe(true);
    }
  });

  it('verifies software alternatives registry integrity', () => {
    expect(ALTERNATIVE_PAGES.length).toBeGreaterThan(0);

    const canvaAlt = getAlternativeBySlug('canva');
    expect(canvaAlt).toBeDefined();
    expect(canvaAlt?.topAlternativeSlugs.length).toBeGreaterThan(0);
  });

  it('verifies side-by-side comparison engine data', () => {
    expect(COMPARISON_PAGES.length).toBeGreaterThan(0);

    const comp = getComparisonBySlug('canva-vs-figma');
    expect(comp).toBeDefined();
    expect(comp?.comparisonMatrix.length).toBeGreaterThan(0);
  });

  it('verifies community Q&A registry integrity', () => {
    expect(QUESTIONS.length).toBeGreaterThan(0);

    const q = getQuestionBySlug('best-free-alternative-to-photoshop-online');
    expect(q).toBeDefined();
    expect(q?.answers.length).toBeGreaterThan(0);
  });

  it('verifies curated collections registry integrity', () => {
    expect(COLLECTIONS.length).toBeGreaterThan(0);

    const col = getCollectionBySlug('best-free-ai-tools-2026');
    expect(col).toBeDefined();
    expect(col?.items.length).toBeGreaterThan(0);
  });
});
