import {
  Product,
  ProductReview,
  Question,
  Answer,
  Collection,
  ProductSubmission,
  ProductCategory,
  PricingModel,
  TargetPlatform,
} from './types';
import { QUESTIONS } from './questionsRegistry';
import { COLLECTIONS } from './collectionsRegistry';

const SUBMISSIONS_KEY = 'toolverse_submitted_products';
const CUSTOM_PRODUCTS_KEY = 'toolverse_custom_products';
const CUSTOM_CATEGORIES_KEY = 'toolverse_custom_categories';
const REVIEWS_KEY = 'toolverse_product_reviews';
const USER_QUESTIONS_KEY = 'toolverse_user_questions';
const USER_ANSWERS_KEY = 'toolverse_user_answers';
const USER_COLLECTIONS_KEY = 'toolverse_user_collections';
const UPVOTES_KEY = 'toolverse_user_upvotes';
const VOTES_DELTA_KEY = 'toolverse_product_votes_delta';

// Memory fallbacks for SSR or environments without localStorage
let memoryProducts: Product[] = [];
let memoryCategories: ProductCategory[] = [];
let memorySubmissions: ProductSubmission[] = [];
let memoryVotes: Record<string, boolean> = {};
let memoryVotesDelta: Record<string, number> = {};

function notifyStorageChange() {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('toolverse_products_changed'));
    } catch {
      // ignore
    }
  }
}

// --- Dynamic Categories ---
export function getStoredCategories(): ProductCategory[] {
  if (typeof window === 'undefined') return memoryCategories;
  try {
    const raw = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : memoryCategories;
  } catch {
    return memoryCategories;
  }
}

export function saveCustomCategory(name: string, description?: string): ProductCategory {
  const trimmed = name.trim();
  const slug = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const existing = getStoredCategories();
  const found = existing.find((c) => c.slug === slug);
  if (found) return found;

  const newCat: ProductCategory = {
    slug,
    name: trimmed,
    icon: 'Sparkles',
    description: description || `${trimmed} software, applications, and SaaS tools.`,
    isCustom: true,
  };

  const updated = [...existing, newCat];
  memoryCategories = updated;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(updated));
      notifyStorageChange();
    } catch {
      // ignore
    }
  }
  return newCat;
}

// --- Custom Products ---
export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return memoryProducts;
  try {
    const raw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : memoryProducts;
  } catch {
    return memoryProducts;
  }
}

export interface NewProductSubmissionPayload {
  productName: string;
  websiteUrl: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  coverImageUrl?: string;
  categorySlug: string;
  categoryName?: string;
  pricingModel?: PricingModel;
  platforms?: TargetPlatform[];
  country?: string;
  companyName?: string;
  founderName?: string;
  contactEmail?: string;
  features?: { title: string; description: string }[];
  pros?: string[];
  cons?: string[];
}

export function saveCustomProduct(payload: NewProductSubmissionPayload): Product {
  let baseSlug = payload.productName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  if (!baseSlug) baseSlug = `product-${Date.now()}`;

  const currentProducts = getStoredProducts();
  let finalSlug = baseSlug;
  let counter = 1;
  while (currentProducts.some((p) => p.slug === finalSlug)) {
    counter++;
    finalSlug = `${baseSlug}-${counter}`;
  }

  // Ensure category is registered if custom
  if (payload.categoryName) {
    saveCustomCategory(payload.categoryName);
  }

  // Format valid website URL
  let webUrl = payload.websiteUrl.trim();
  if (!webUrl.startsWith('http://') && !webUrl.startsWith('https://')) {
    webUrl = `https://${webUrl}`;
  }

  // Logo fallback
  const logoUrl =
    payload.logoUrl && payload.logoUrl.trim()
      ? payload.logoUrl.trim()
      : `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(finalSlug)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  const pricingModel = payload.pricingModel || 'Freemium';

  // Construct structured features (ensure at least 3 for high SEO score)
  const defaultFeatures = [
    { title: 'Core Functionality', description: payload.tagline || 'Essential tool capabilities for streamlined operations.' },
    { title: 'Cloud & Modern Workflow', description: 'Engineered for seamless productivity, easy onboarding, and secure data handling.' },
    { title: 'User Experience & Performance', description: 'Intuitive interface designed for both individual creators and collaborative teams.' },
  ];

  const features =
    payload.features && payload.features.length >= 3
      ? payload.features
      : defaultFeatures;

  // Construct realistic pricing plans
  const pricingPlans = [
    {
      name: pricingModel === 'Free' ? 'Free Community' : 'Free Tier',
      price: '$0',
      period: 'free' as const,
      features: ['Core tool access', 'Community support', 'Standard speed'],
    },
    {
      name: 'Pro Edition',
      price: pricingModel === 'Paid' ? '$19' : '$12',
      period: 'month' as const,
      features: ['Unlimited usage', 'Priority performance', 'Export & integrations', 'Dedicated assistance'],
      isPopular: true,
    },
  ];

  const longDescription =
    payload.description.length >= 160
      ? payload.description
      : `${payload.description}\n\n${payload.productName} is an emerging solution in the ${payload.categoryName || 'Software'} ecosystem. It is built to resolve key user challenges, offering robust performance, intuitive design, and transparent pricing. Explore user ratings, feature lists, and verified links on ToolVerse.`;

  const newProduct: Product = {
    id: `prod-usr-${Date.now()}`,
    slug: finalSlug,
    name: payload.productName.trim(),
    tagline: payload.tagline.trim(),
    description: payload.description.trim(),
    longDescription,
    websiteUrl: webUrl,
    logoUrl,
    coverImageUrl: payload.coverImageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop',
    screenshots: [],
    categorySlug: payload.categorySlug,
    categoryName: payload.categoryName || payload.categorySlug.replace(/-/g, ' ').toUpperCase(),
    subcategory: 'Community Launch',
    features,
    pricingModel,
    pricingPlans,
    platforms: payload.platforms && payload.platforms.length > 0 ? payload.platforms : ['Web'],
    country: payload.country || 'Global',
    companyName: payload.companyName || `${payload.productName} Inc`,
    companySlug: (payload.companyName || payload.productName).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    founderName: payload.founderName || 'Verified Founder',
    launchDate: new Date().toISOString().split('T')[0],
    isVerified: true,
    isFeatured: false,
    isTrending: true,
    isNew: true,
    upvotesCount: 1, // Start with 1 vote
    viewsCount: 35,
    ratingAverage: 5.0,
    ratingCount: 1,
    pros: payload.pros && payload.pros.length >= 2 ? payload.pros : [
      'Modern, highly responsive user interface',
      'Zero unnecessary setup friction for new users',
      'Direct developer updates and responsive feedback loop'
    ],
    cons: payload.cons && payload.cons.length >= 1 ? payload.cons : [
      'New release with expanding feature set over upcoming sprints'
    ],
    relatedToolverseToolSlugs: ['word-counter', 'json-formatter', 'meta-tag-generator'],
    relatedProductSlugs: [],
    lastUpdated: new Date().toISOString().split('T')[0],
    status: 'approved',
  };

  const updatedProducts = [newProduct, ...currentProducts];
  memoryProducts = updatedProducts;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(updatedProducts));

      // Also save in submissions for admin/records
      const subList = getStoredSubmissions();
      subList.unshift({
        id: `sub-${Date.now()}`,
        productName: payload.productName,
        websiteUrl: webUrl,
        tagline: payload.tagline,
        description: payload.description,
        logoUrl,
        categorySlug: payload.categorySlug,
        pricingModel,
        platforms: payload.platforms || ['Web'],
        country: payload.country || 'Global',
        companyName: payload.companyName || '',
        founderName: payload.founderName || '',
        contactEmail: payload.contactEmail || '',
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'approved',
      });
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(subList));

      // Register initial upvote
      const rawVotes = localStorage.getItem(UPVOTES_KEY);
      const votes: Record<string, boolean> = rawVotes ? JSON.parse(rawVotes) : {};
      votes[newProduct.id] = true;
      localStorage.setItem(UPVOTES_KEY, JSON.stringify(votes));

      notifyStorageChange();
    } catch {
      // ignore
    }
  }

  return newProduct;
}

// --- Submissions ---
export function getStoredSubmissions(): ProductSubmission[] {
  if (typeof window === 'undefined') return memorySubmissions;
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : memorySubmissions;
  } catch {
    return memorySubmissions;
  }
}

export function saveSubmission(submission: Omit<ProductSubmission, 'id' | 'submittedAt' | 'status'>): ProductSubmission {
  // Automatically creates a live approved product from the submission!
  const createdProd = saveCustomProduct({
    productName: submission.productName,
    websiteUrl: submission.websiteUrl,
    tagline: submission.tagline,
    description: submission.description,
    logoUrl: submission.logoUrl,
    categorySlug: submission.categorySlug,
    pricingModel: submission.pricingModel,
    platforms: submission.platforms,
    country: submission.country,
    companyName: submission.companyName,
    founderName: submission.founderName,
    contactEmail: submission.contactEmail,
  });

  const newSub: ProductSubmission = {
    ...submission,
    id: `sub-${Date.now()}`,
    submittedAt: new Date().toISOString().split('T')[0],
    status: 'approved',
  };
  return newSub;
}

// --- Upvotes & Real-time Vote Counters ---
export function getProductVoteDelta(productId: string): number {
  if (typeof window === 'undefined') return memoryVotesDelta[productId] || 0;
  try {
    const raw = localStorage.getItem(VOTES_DELTA_KEY);
    const deltas: Record<string, number> = raw ? JSON.parse(raw) : {};
    return deltas[productId] || 0;
  } catch {
    return 0;
  }
}

export function toggleUpvote(id: string): boolean {
  if (typeof window === 'undefined') {
    memoryVotes[id] = !memoryVotes[id];
    memoryVotesDelta[id] = (memoryVotesDelta[id] || 0) + (memoryVotes[id] ? 1 : -1);
    return memoryVotes[id];
  }
  try {
    const raw = localStorage.getItem(UPVOTES_KEY);
    const votes: Record<string, boolean> = raw ? JSON.parse(raw) : {};
    const currentState = !!votes[id];
    votes[id] = !currentState;
    localStorage.setItem(UPVOTES_KEY, JSON.stringify(votes));

    const rawDelta = localStorage.getItem(VOTES_DELTA_KEY);
    const deltas: Record<string, number> = rawDelta ? JSON.parse(rawDelta) : {};
    deltas[id] = (deltas[id] || 0) + (votes[id] ? 1 : -1);
    localStorage.setItem(VOTES_DELTA_KEY, JSON.stringify(deltas));

    notifyStorageChange();
    return !currentState;
  } catch {
    return false;
  }
}

export function isUpvoted(id: string): boolean {
  if (typeof window === 'undefined') return !!memoryVotes[id];
  try {
    const raw = localStorage.getItem(UPVOTES_KEY);
    const votes: Record<string, boolean> = raw ? JSON.parse(raw) : {};
    return !!votes[id];
  } catch {
    return false;
  }
}

// --- Reviews ---
export function getStoredReviews(productSlug: string): ProductReview[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    const all: ProductReview[] = raw ? JSON.parse(raw) : [];
    return all.filter((r) => r.productSlug === productSlug);
  } catch {
    return [];
  }
}

export function saveReview(review: Omit<ProductReview, 'id' | 'date' | 'upvotes' | 'isVerifiedUser'>): ProductReview {
  const newRev: ProductReview = {
    ...review,
    id: `rev-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    upvotes: 1,
    isVerifiedUser: true,
  };
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(REVIEWS_KEY);
      const all: ProductReview[] = raw ? JSON.parse(raw) : [];
      all.unshift(newRev);
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
      notifyStorageChange();
    } catch {
      // ignore
    }
  }
  return newRev;
}

// --- Questions ---
export function getStoredQuestions(): Question[] {
  if (typeof window === 'undefined') return QUESTIONS;
  try {
    const raw = localStorage.getItem(USER_QUESTIONS_KEY);
    const userQs: Question[] = raw ? JSON.parse(raw) : [];
    return [...userQs, ...QUESTIONS];
  } catch {
    return QUESTIONS;
  }
}

export function saveQuestion(title: string, content: string, categorySlug: string, authorName: string, tags: string[]): Question {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const newQ: Question = {
    id: `q-${Date.now()}`,
    slug,
    title,
    content,
    authorId: `u-${Date.now()}`,
    authorName: authorName || 'Anonymous Community Member',
    categorySlug,
    categoryName: categorySlug.replace(/-/g, ' ').toUpperCase(),
    date: new Date().toISOString().split('T')[0],
    upvotes: 1,
    views: 1,
    answersCount: 0,
    answers: [],
    tags,
  };

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(USER_QUESTIONS_KEY);
      const userQs: Question[] = raw ? JSON.parse(raw) : [];
      userQs.unshift(newQ);
      localStorage.setItem(USER_QUESTIONS_KEY, JSON.stringify(userQs));
      notifyStorageChange();
    } catch {
      // ignore
    }
  }
  return newQ;
}

export function saveAnswer(questionSlug: string, content: string, authorName: string, authorTitle?: string): Answer | null {
  const allQs = getStoredQuestions();
  const q = allQs.find((item) => item.slug === questionSlug);
  if (!q) return null;

  const newAns: Answer = {
    id: `ans-${Date.now()}`,
    questionId: q.id,
    authorId: `u-${Date.now()}`,
    authorName: authorName || 'Community Specialist',
    authorTitle: authorTitle || 'Verified Contributor',
    content,
    date: new Date().toISOString().split('T')[0],
    upvotes: 1,
    isAccepted: false,
  };

  q.answers.push(newAns);
  q.answersCount = q.answers.length;

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(USER_QUESTIONS_KEY);
      const userQs: Question[] = raw ? JSON.parse(raw) : [];
      const idx = userQs.findIndex((item) => item.slug === questionSlug);
      if (idx !== -1) {
        userQs[idx] = q;
        localStorage.setItem(USER_QUESTIONS_KEY, JSON.stringify(userQs));
        notifyStorageChange();
      }
    } catch {
      // ignore
    }
  }
  return newAns;
}
