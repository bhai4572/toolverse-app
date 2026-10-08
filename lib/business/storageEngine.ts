import { Business, BusinessReview, BusinessCategory } from './types';
import { INITIAL_BUSINESSES, BUSINESS_CATEGORIES } from './registry';
import { logAdminAudit } from '../admin/authEngine';

const STORED_BUSINESSES_KEY = 'toolverse_stored_businesses';
const STORED_REVIEWS_KEY = 'toolverse_stored_business_reviews';
const STORED_CATEGORIES_KEY = 'toolverse_stored_categories';
const STORED_SCANS_KEY = 'toolverse_business_qr_scans';

// --- Businesses ---
export function getStoredBusinesses(): Business[] {
  if (typeof window === 'undefined') return INITIAL_BUSINESSES;
  try {
    const raw = localStorage.getItem(STORED_BUSINESSES_KEY);
    const userCreated: Business[] = raw ? JSON.parse(raw) : [];
    // Combine user-created with initial registry
    const allMap = new Map<string, Business>();
    INITIAL_BUSINESSES.forEach((b) => allMap.set(b.id, b));
    userCreated.forEach((b) => allMap.set(b.id, b));
    return Array.from(allMap.values());
  } catch {
    return INITIAL_BUSINESSES;
  }
}

export function getBusinessBySlugOrId(identifier: string): Business | undefined {
  const all = getStoredBusinesses();
  const idMatch = all.find((b) => b.id.toLowerCase() === identifier.toLowerCase());
  if (idMatch) return idMatch;
  return all.find((b) => b.slug.toLowerCase() === identifier.toLowerCase());
}

export function saveBusiness(data: Omit<Business, 'id' | 'createdAt' | 'updatedAt' | 'upvotesCount' | 'viewsCount' | 'qrScansCount' | 'ratingAverage' | 'ratingCount' | 'spamStatus' | 'riskStatus'>): Business {
  const count = getStoredBusinesses().length + 1;
  const businessId = `TV-BIZ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newBiz: Business = {
    ...data,
    id: businessId,
    slug,
    spamStatus: 'CLEAN',
    riskStatus: 'LOW',
    upvotesCount: 1,
    viewsCount: 1,
    qrScansCount: 0,
    ratingAverage: 5.0,
    ratingCount: 1,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(STORED_BUSINESSES_KEY);
    const userCreated: Business[] = raw ? JSON.parse(raw) : [];
    userCreated.unshift(newBiz);
    localStorage.setItem(STORED_BUSINESSES_KEY, JSON.stringify(userCreated));
  }
  return newBiz;
}

export function updateBusinessSpamStatus(businessId: string, status: Business['spamStatus'], adminUsername: string): Business | null {
  const all = getStoredBusinesses();
  const target = all.find((b) => b.id === businessId);
  if (!target) return null;

  target.spamStatus = status;
  target.updatedAt = new Date().toISOString().split('T')[0];

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(STORED_BUSINESSES_KEY);
    const userCreated: Business[] = raw ? JSON.parse(raw) : [];
    const idx = userCreated.findIndex((b) => b.id === businessId);
    if (idx !== -1) {
      userCreated[idx] = target;
    } else {
      userCreated.push(target);
    }
    localStorage.setItem(STORED_BUSINESSES_KEY, JSON.stringify(userCreated));
    logAdminAudit(adminUsername, 'SPAM_STATUS_UPDATED', 'BUSINESS', businessId, `Spam status set to ${status}`);
  }

  return target;
}

// --- QR Scans Analytics ---
export function recordQRScan(businessId: string) {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem(STORED_SCANS_KEY);
  const scans: Record<string, number> = raw ? JSON.parse(raw) : {};
  scans[businessId] = (scans[businessId] || 0) + 1;
  localStorage.setItem(STORED_SCANS_KEY, JSON.stringify(scans));
}

export function getQRScanCount(businessId: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(STORED_SCANS_KEY);
    const scans: Record<string, number> = raw ? JSON.parse(raw) : {};
    return scans[businessId] || 0;
  } catch {
    return 0;
  }
}

// --- Reviews ---
export function getStoredBusinessReviews(businessId: string): BusinessReview[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORED_REVIEWS_KEY);
    const all: BusinessReview[] = raw ? JSON.parse(raw) : [];
    return all.filter((r) => r.businessId === businessId);
  } catch {
    return [];
  }
}

export function saveBusinessReview(review: Omit<BusinessReview, 'id' | 'createdAt' | 'isVerifiedCustomer'>): BusinessReview {
  const newRev: BusinessReview = {
    ...review,
    id: `brev-${Date.now()}`,
    isVerifiedCustomer: true,
    createdAt: new Date().toISOString().split('T')[0],
  };

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(STORED_REVIEWS_KEY);
    const all: BusinessReview[] = raw ? JSON.parse(raw) : [];
    all.unshift(newRev);
    localStorage.setItem(STORED_REVIEWS_KEY, JSON.stringify(all));
  }
  return newRev;
}

// --- Categories ---
export function getStoredCategories(): BusinessCategory[] {
  if (typeof window === 'undefined') return BUSINESS_CATEGORIES;
  try {
    const raw = localStorage.getItem(STORED_CATEGORIES_KEY);
    const userCats: BusinessCategory[] = raw ? JSON.parse(raw) : [];
    const map = new Map<string, BusinessCategory>();
    BUSINESS_CATEGORIES.forEach((c) => map.set(c.slug, c));
    userCats.forEach((c) => map.set(c.slug, c));
    return Array.from(map.values());
  } catch {
    return BUSINESS_CATEGORIES;
  }
}

export function saveCategory(name: string, description: string, createdBy: string = 'user'): BusinessCategory {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newCat: BusinessCategory = {
    slug,
    name,
    aliases: [name],
    synonyms: [],
    description: description || `Businesses and service providers in ${name}`,
    createdBy,
    status: 'canonical',
    businessCount: 1,
    usageCount: 1,
    qualityScore: 85,
    createdAt: new Date().toISOString().split('T')[0],
  };

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(STORED_CATEGORIES_KEY);
    const userCats: BusinessCategory[] = raw ? JSON.parse(raw) : [];
    userCats.unshift(newCat);
    localStorage.setItem(STORED_CATEGORIES_KEY, JSON.stringify(userCats));
  }

  return newCat;
}
