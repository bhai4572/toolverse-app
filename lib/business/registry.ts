import { Business, BusinessCategory, BusinessReview } from './types';

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    slug: 'barber-shops-salons',
    name: 'Barber Shops & Salons',
    aliases: ['Barber Shop', 'Hair Salon', 'Men Grooming Studio', 'Barbering'],
    synonyms: ['haircut', 'barber', 'beard trim', 'hairstylist'],
    description: 'Professional grooming, haircuts, beard trimming, and salon styling services.',
    createdBy: 'system',
    status: 'canonical',
    businessCount: 0,
    usageCount: 0,
    qualityScore: 95,
    createdAt: '2025-01-01',
  },
  {
    slug: 'digital-marketing-agencies',
    name: 'Digital Marketing Agencies',
    aliases: ['Digital Marketing Agency', 'SEO Agency', 'Social Media Agency', 'Marketing Firm'],
    synonyms: ['marketing', 'seo', 'sem', 'ppc', 'branding', 'digital ads'],
    description: 'Search engine optimization, PPC ads, social media strategy, and growth marketing.',
    createdBy: 'system',
    status: 'canonical',
    businessCount: 0,
    usageCount: 0,
    qualityScore: 98,
    createdAt: '2025-01-01',
  },
  {
    slug: 'coffee-shops-cafes',
    name: 'Coffee Shops & Cafes',
    aliases: ['Coffee Shop', 'Café', 'Espresso Bar', 'Specialty Coffee'],
    synonyms: ['coffee', 'latte', 'pastry', 'bakery', 'breakfast'],
    description: 'Artisanal coffee, espresso drinks, fresh pastries, and cafe seating.',
    createdBy: 'system',
    status: 'canonical',
    businessCount: 0,
    usageCount: 0,
    qualityScore: 92,
    createdAt: '2025-01-01',
  },
  {
    slug: 'saas-cloud-software',
    name: 'SaaS & Cloud Software',
    aliases: ['SaaS', 'Cloud Application', 'Software Platform', 'B2B Software'],
    synonyms: ['software', 'cloud', 'app', 'platform', 'b2b'],
    description: 'Web applications, cloud infrastructure, enterprise software, and productivity tools.',
    createdBy: 'system',
    status: 'canonical',
    businessCount: 0,
    usageCount: 0,
    qualityScore: 100,
    createdAt: '2025-01-01',
  },
  {
    slug: 'software-engineering-studios',
    name: 'Software Engineering & Web Studios',
    aliases: ['Software Development Agency', 'Web Design Studio', 'App Development Firm'],
    synonyms: ['web development', 'custom software', 'react', 'mobile apps'],
    description: 'Full-stack software engineering, mobile application development, and UI/UX engineering.',
    createdBy: 'system',
    status: 'canonical',
    businessCount: 0,
    usageCount: 0,
    qualityScore: 96,
    createdAt: '2025-01-01',
  },
];

/**
 * Only real, verified user-submitted businesses belong here.
 * Demo/sample businesses and fabricated customer reviews have been removed
 * to maintain editorial integrity and AdSense policy compliance.
 */
export const INITIAL_BUSINESSES: Business[] = [];

export const INITIAL_REVIEWS: BusinessReview[] = [];

export const INITIAL_BUSINESS_REVIEWS: BusinessReview[] = INITIAL_REVIEWS;

export function findCategoryByQuery(query: string): BusinessCategory | undefined {
  const q = query.trim().toLowerCase();
  return BUSINESS_CATEGORIES.find((cat) => {
    if (cat.name.toLowerCase() === q || cat.slug === q) return true;
    if (cat.aliases.some((a) => a.toLowerCase() === q)) return true;
    if (cat.synonyms.some((s) => s.toLowerCase() === q)) return true;
    return false;
  });
}

export function searchCategories(query: string): BusinessCategory[] {
  if (!query.trim()) return BUSINESS_CATEGORIES;
  const q = query.trim().toLowerCase();
  return BUSINESS_CATEGORIES.filter((cat) => {
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.aliases.some((a) => a.toLowerCase().includes(q)) ||
      cat.synonyms.some((s) => s.toLowerCase().includes(q))
    );
  });
}

export function findBusinessBySlug(slug: string): Business | undefined {
  return INITIAL_BUSINESSES.find((b) => b.slug === slug);
}

export function findBusinessByBusinessId(businessId: string): Business | undefined {
  return INITIAL_BUSINESSES.find((b) => b.businessId === businessId || b.id === businessId);
}
