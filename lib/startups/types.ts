/**
 * Toolverse Startup Directory & Launch Platform Types
 */

export type PricingModel = 'FREE' | 'FREEMIUM' | 'PAID' | 'FREE_TRIAL' | 'OPEN_SOURCE';

export type FundingStage = 'BOOTSTRAPPED' | 'PRE_SEED' | 'SEED' | 'SERIES_A' | 'SERIES_B' | 'PUBLIC';

export type ProductPlatform = 'WEB' | 'IOS' | 'ANDROID' | 'CHROME_EXTENSION' | 'MAC' | 'WINDOWS' | 'API';

export type ListingStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';

export interface StartupCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  startupCount: number;
}

export interface Startup {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: string;
  subcategory?: string;
  tags: string[];
  websiteUrl: string;
  demoUrl?: string;
  logoUrl: string;
  coverImageUrl?: string;
  screenshots: string[];
  pricingModel: PricingModel;
  pricingDetails?: string;
  fundingStage: FundingStage;
  teamSize: string;
  country: string;
  city: string;
  platforms: ProductPlatform[];
  keyFeatures: string[];
  targetAudience: string[];
  problemSolved: string;
  founderName: string;
  founderEmail: string;
  founderTwitter?: string;
  founderLinkedIn?: string;
  upvotesCount: number;
  bookmarksCount: number;
  viewsCount: number;
  outboundClicksCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  isClaimed: boolean;
  status: ListingStatus;
  launchedAt: string;
  updatedAt: string;
}

export interface StartupSubmissionInput {
  name: string;
  tagline: string;
  websiteUrl: string;
  category: string;
  country: string;
  city: string;
  pricingModel: PricingModel;
  fundingStage: FundingStage;
  teamSize: string;
  shortDescription: string;
  longDescription: string;
  problemSolved: string;
  targetAudience: string[];
  keyFeatures: string[];
  platforms: ProductPlatform[];
  founderName: string;
  founderEmail: string;
  logoUrl?: string;
}

export interface StartupFilter {
  category?: string;
  country?: string;
  pricingModel?: PricingModel;
  fundingStage?: FundingStage;
  platform?: ProductPlatform;
  searchQuery?: string;
  sortBy?: 'trending' | 'newest' | 'votes' | 'alphabetical';
}
