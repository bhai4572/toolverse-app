import { Product, IndexabilityScore } from './types';

/**
 * Programmatic SEO Quality Gate.
 * Evaluates whether a product or user-generated page meets strict usefulness,
 * completeness, and trust criteria before adding it to sitemap.xml or emitting `index, follow`.
 */
export function evaluateProductPageQuality(product: Product): IndexabilityScore {
  let score = 0;
  const reasons: string[] = [];

  // 1. Content Completeness (Max 30 pts)
  if (product.description && product.description.length >= 80) {
    score += 10;
  } else {
    reasons.push('Short description under 80 characters.');
  }

  if (product.longDescription && product.longDescription.length >= 150) {
    score += 10;
  } else {
    reasons.push('Missing comprehensive long description.');
  }

  if (product.features && product.features.length >= 3) {
    score += 10;
  } else {
    reasons.push('Fewer than 3 structured product features.');
  }

  // 2. Trust Signals & Verification (Max 30 pts)
  if (product.websiteUrl && product.websiteUrl.startsWith('http')) {
    score += 10;
  } else {
    reasons.push('Missing valid official website URL.');
  }

  if (product.isVerified) {
    score += 10;
  }

  if (product.founderName || product.companyName) {
    score += 10;
  } else {
    reasons.push('Missing verified company or founder attribution.');
  }

  // 3. Structured Data & Value (Max 25 pts)
  if (product.pricingPlans && product.pricingPlans.length >= 1) {
    score += 10;
  } else {
    reasons.push('Missing explicit pricing plan information.');
  }

  if (product.pros && product.pros.length >= 2 && product.cons && product.cons.length >= 1) {
    score += 10;
  } else {
    reasons.push('Incomplete pros and cons breakdown.');
  }

  if (product.platforms && product.platforms.length >= 1) {
    score += 5;
  }

  // 4. Community Activity & Moderation (Max 15 pts)
  if (product.status === 'approved') {
    score += 10;
  } else {
    reasons.push('Product status is not approved by moderation.');
  }

  if (product.ratingCount > 0 || product.upvotesCount > 5) {
    score += 5;
  }

  const isIndexable = score >= 70 && product.status === 'approved';

  return {
    score,
    isIndexable,
    reasons: isIndexable ? ['Page satisfies all SEO quality and usefulness benchmarks.'] : reasons,
  };
}

export function getRobotsDirective(isIndexable: boolean): string {
  if (isIndexable) {
    return 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  }
  return 'noindex, follow';
}
