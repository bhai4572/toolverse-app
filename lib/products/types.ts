export type PricingModel = 'Free' | 'Freemium' | 'Paid' | 'Free Trial' | 'Open Source';
export type TargetPlatform = 'Web' | 'Mac' | 'Windows' | 'Linux' | 'iOS' | 'Android' | 'Chrome Extension' | 'API';

export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductPricingPlan {
  name: string;
  price: string;
  period?: 'month' | 'year' | 'one-time' | 'free';
  features: string[];
  isPopular?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  websiteUrl: string;
  logoUrl: string;
  coverImageUrl?: string;
  screenshots: string[];
  categorySlug: string;
  categoryName: string;
  subcategory?: string;
  features: ProductFeature[];
  pricingModel: PricingModel;
  pricingPlans: ProductPricingPlan[];
  platforms: TargetPlatform[];
  country: string;
  companyName: string;
  companySlug: string;
  founderName?: string;
  founderTwitter?: string;
  launchDate: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    discord?: string;
  };
  documentationUrl?: string;
  demoUrl?: string;
  supportUrl?: string;
  isVerified: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isNew: boolean;
  upvotesCount: number;
  viewsCount: number;
  ratingAverage: number;
  ratingCount: number;
  pros: string[];
  cons: string[];
  relatedToolverseToolSlugs: string[];
  relatedProductSlugs: string[];
  lastUpdated: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface ProductReview {
  id: string;
  productId: string;
  productSlug: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userTitle?: string;
  rating: number; // 1 to 5
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  usagePeriod: string;
  date: string;
  upvotes: number;
  isVerifiedUser: boolean;
}

export interface AlternativePage {
  slug: string; // e.g. 'canva', 'chatgpt', 'notion', 'photoshop'
  targetProductName: string;
  targetProductCategory: string;
  targetProductDescription: string;
  targetProductPricing: string;
  targetProductWebsite: string;
  targetProductLogo?: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  bestFor: string;
  keySelectionCriteria: string[];
  topAlternativeSlugs: string[];
  relatedToolverseToolSlugs: string[];
  faqs: { question: string; answer: string }[];
  lastUpdated: string;
}

export interface ComparisonPage {
  slug: string; // e.g. 'canva-vs-figma', 'chatgpt-vs-claude'
  productASlug: string;
  productBSlug: string;
  title: string;
  metaDescription: string;
  verdict: string;
  comparisonMatrix: {
    feature: string;
    productAValue: string;
    productBValue: string;
    winner?: 'A' | 'B' | 'Tie';
  }[];
  bestForProductA: string;
  bestForProductB: string;
  lastUpdated: string;
}

export interface Answer {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorTitle?: string;
  content: string;
  date: string;
  upvotes: number;
  isAccepted: boolean;
  relatedProductSlugs?: string[];
  relatedToolverseToolSlugs?: string[];
}

export interface Question {
  id: string;
  slug: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  categorySlug: string;
  categoryName: string;
  date: string;
  upvotes: number;
  views: number;
  answersCount: number;
  answers: Answer[];
  tags: string[];
  relatedProductSlugs?: string[];
  relatedToolverseToolSlugs?: string[];
}

export interface CollectionItem {
  type: 'product' | 'toolverse_tool';
  slug: string;
  note?: string;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  authorName: string;
  authorSlug: string;
  authorAvatar?: string;
  categorySlug: string;
  items: CollectionItem[];
  upvotes: number;
  saves: number;
  isFeatured: boolean;
  lastUpdated: string;
}

export interface UserProfile {
  username: string;
  name: string;
  bio: string;
  avatarUrl?: string;
  website?: string;
  twitter?: string;
  github?: string;
  reputation: number;
  joinedDate: string;
  expertise: string[];
  productsSubmitted: string[];
  reviewsCount: number;
  answersCount: number;
  collectionsCount: number;
  isVerified: boolean;
}

export interface CompanyProfile {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
  location: string;
  foundedYear: string;
  teamSize: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  products: string[]; // product slugs
  isVerified: boolean;
}

export interface ProductSubmission {
  id: string;
  productName: string;
  websiteUrl: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  categorySlug: string;
  pricingModel: PricingModel;
  platforms: TargetPlatform[];
  country: string;
  companyName: string;
  founderName: string;
  contactEmail: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface IndexabilityScore {
  score: number; // 0 - 100
  isIndexable: boolean;
  reasons: string[];
}
