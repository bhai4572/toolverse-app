import { Business, BusinessCategory } from './types';

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    slug: 'barber-shops-salons',
    name: 'Barber Shops & Salons',
    aliases: ['Barber Shop', 'Hair Salon', 'Men Grooming Studio', 'Barbering'],
    synonyms: ['haircut', 'barber', 'beard trim', 'hairstylist'],
    description: 'Professional grooming, haircuts, beard trimming, and salon styling services.',
    createdBy: 'system',
    status: 'canonical',
    businessCount: 4,
    usageCount: 120,
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
    businessCount: 6,
    usageCount: 240,
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
    businessCount: 3,
    usageCount: 180,
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
    businessCount: 8,
    usageCount: 520,
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
    businessCount: 5,
    usageCount: 310,
    qualityScore: 96,
    createdAt: '2025-01-01',
  },
];

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'TV-BIZ-8F4K2P',
    slug: 'ali-barber-studio',
    name: 'Ali Barber Studio',
    businessType: 'Local Business',
    categorySlug: 'barber-shops-salons',
    categoryName: 'Barber Shops & Salons',
    description: 'Premier men grooming studio specializing in modern hair styling, beard sculpting, and hot towel shaves.',
    longDescription: 'Ali Barber Studio is a top-rated grooming space located in Gulberg, Lahore. Founded by master barber Ali Raza, the studio offers precision haircuts, beard trimming, scalp treatments, and bridal grooming packages using premium imported hair products.',
    logoUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=128&h=128&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&fit=crop',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&fit=crop'
    ],
    websiteUrl: 'https://alibarberstudio.com',
    email: 'contact@alibarberstudio.com',
    phone: '+92 300 8472910',
    address: 'Block M, Main Boulevard, Gulberg III',
    city: 'Lahore',
    state: 'Punjab',
    country: 'Pakistan',
    isGlobalOnline: false,
    serviceArea: 'Lahore Metropolitan',
    socialLinks: {
      instagram: 'https://instagram.com/alibarberstudio',
      facebook: 'https://facebook.com/alibarberstudio'
    },
    businessHours: [
      { day: 'Monday', openTime: '10:00 AM', closeTime: '10:00 PM' },
      { day: 'Tuesday', openTime: '10:00 AM', closeTime: '10:00 PM' },
      { day: 'Wednesday', openTime: '10:00 AM', closeTime: '10:00 PM' },
      { day: 'Thursday', openTime: '10:00 AM', closeTime: '10:00 PM' },
      { day: 'Friday', openTime: '02:00 PM', closeTime: '11:00 PM' },
      { day: 'Saturday', openTime: '10:00 AM', closeTime: '11:00 PM' },
      { day: 'Sunday', openTime: '10:00 AM', closeTime: '10:00 PM' }
    ],
    services: [
      { id: 's1', name: 'Executive Haircut & Wash', description: 'Precision haircut with scalp massage & blow dry', price: '$15' },
      { id: 's2', name: 'Beard Sculpting & Hot Towel', description: 'Beard shaping, razor line-up, and herbal hot towel refresh', price: '$10' }
    ],
    verificationLevel: 3,
    isVerified: true,
    ownerEmail: 'ali@alibarberstudio.com',
    riskStatus: 'LOW',
    spamStatus: 'CLEAN',
    rankingPosition: 1,
    rankingSnapshotDate: '2026-10-01',
    isSponsored: false,
    upvotesCount: 340,
    viewsCount: 12400,
    qrScansCount: 1850,
    ratingAverage: 4.9,
    ratingCount: 84,
    createdAt: '2025-02-15',
    updatedAt: '2026-10-01'
  },
  {
    id: 'TV-BIZ-3M9Q7L',
    slug: 'apex-digital-marketing',
    name: 'Apex Digital Marketing',
    businessType: 'Agency',
    categorySlug: 'digital-marketing-agencies',
    categoryName: 'Digital Marketing Agencies',
    description: 'Data-driven performance marketing agency specializing in technical SEO, Google Ads, and e-commerce growth.',
    longDescription: 'Apex Digital Marketing is an award-winning growth agency based in London, UK. We help SaaS companies, e-commerce brands, and local enterprises acquire customers efficiently through Google Search, Meta Ads, and content authority engineering.',
    logoUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=128&h=128&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&fit=crop'
    ],
    websiteUrl: 'https://apexdigitalmarketing.co.uk',
    email: 'hello@apexdigitalmarketing.co.uk',
    phone: '+44 20 7946 0912',
    address: '71-75 Shelton Street, Covent Garden',
    city: 'London',
    state: 'England',
    country: 'United Kingdom',
    isGlobalOnline: true,
    serviceArea: 'Worldwide',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/apexdigital',
      twitter: 'https://twitter.com/apexdigital'
    },
    businessHours: [
      { day: 'Monday', openTime: '09:00 AM', closeTime: '06:00 PM' },
      { day: 'Tuesday', openTime: '09:00 AM', closeTime: '06:00 PM' },
      { day: 'Wednesday', openTime: '09:00 AM', closeTime: '06:00 PM' },
      { day: 'Thursday', openTime: '09:00 AM', closeTime: '06:00 PM' },
      { day: 'Friday', openTime: '09:00 AM', closeTime: '05:00 PM' }
    ],
    services: [
      { id: 's1', name: 'Technical SEO Audit & Growth', description: 'Comprehensive site audit, schema markup, and keyword strategy', price: '$1500/mo' },
      { id: 's2', name: 'PPC & Performance Ad Campaigns', description: 'Google Search & Social Media advertising management', price: '$2000/mo' }
    ],
    verificationLevel: 3,
    isVerified: true,
    ownerEmail: 'dirk@apexdigitalmarketing.co.uk',
    riskStatus: 'LOW',
    spamStatus: 'CLEAN',
    rankingPosition: 1,
    rankingSnapshotDate: '2026-10-02',
    isSponsored: true,
    sponsoredPosition: 1,
    upvotesCount: 520,
    viewsCount: 28900,
    qrScansCount: 2100,
    ratingAverage: 4.8,
    ratingCount: 112,
    createdAt: '2025-01-10',
    updatedAt: '2026-10-02'
  },
  {
    id: 'TV-BIZ-9X2V4W',
    slug: 'artisan-coffee-roasters',
    name: 'Artisan Coffee Roasters',
    businessType: 'Restaurant',
    categorySlug: 'coffee-shops-cafes',
    categoryName: 'Coffee Shops & Cafes',
    description: 'Specialty coffee roastery serving single-origin espresso, pour-overs, and handcrafted pastries.',
    longDescription: 'Artisan Coffee Roasters sources single-origin green coffee beans directly from ethical farmers in Ethiopia, Colombia, and Guatemala. Roasted in small batches daily, our cafe provides a warm space for remote work, espresso lovers, and fresh sourdough breads.',
    logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=128&h=128&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&fit=crop'
    ],
    websiteUrl: 'https://artisancoffeeroasters.ca',
    email: 'info@artisancoffeeroasters.ca',
    phone: '+1 416 555 0184',
    address: '492 Queen Street West',
    city: 'Toronto',
    state: 'Ontario',
    country: 'Canada',
    isGlobalOnline: false,
    serviceArea: 'Greater Toronto Area',
    socialLinks: {
      instagram: 'https://instagram.com/artisancoffeeto'
    },
    businessHours: [
      { day: 'Monday', openTime: '07:00 AM', closeTime: '07:00 PM' },
      { day: 'Tuesday', openTime: '07:00 AM', closeTime: '07:00 PM' },
      { day: 'Wednesday', openTime: '07:00 AM', closeTime: '07:00 PM' },
      { day: 'Thursday', openTime: '07:00 AM', closeTime: '07:00 PM' },
      { day: 'Friday', openTime: '07:00 AM', closeTime: '08:00 PM' },
      { day: 'Saturday', openTime: '08:00 AM', closeTime: '08:00 PM' },
      { day: 'Sunday', openTime: '08:00 AM', closeTime: '06:00 PM' }
    ],
    services: [
      { id: 's1', name: 'Single Origin Pour Over', description: 'Freshly ground Ethiopian Yirgacheffe coffee', price: '$5.50' },
      { id: 's2', name: 'Roasted Whole Bean 340g', description: 'Take home roasted coffee bag', price: '$18.00' }
    ],
    verificationLevel: 2,
    isVerified: true,
    ownerEmail: 'clara@artisancoffeeroasters.ca',
    riskStatus: 'LOW',
    spamStatus: 'CLEAN',
    rankingPosition: 1,
    rankingSnapshotDate: '2026-10-04',
    isSponsored: false,
    upvotesCount: 290,
    viewsCount: 14500,
    qrScansCount: 980,
    ratingAverage: 4.9,
    ratingCount: 65,
    createdAt: '2025-03-01',
    updatedAt: '2026-10-04'
  }
];

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

