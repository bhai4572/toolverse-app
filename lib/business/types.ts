export type BusinessType =
  | 'Local Business'
  | 'Online Business'
  | 'Service'
  | 'Agency'
  | 'Restaurant'
  | 'Retail'
  | 'SaaS'
  | 'Software'
  | 'Startup'
  | 'Professional Service'
  | 'Other';

export type VerificationLevel = 0 | 1 | 2 | 3 | 4;

export type RiskStatus = 'LOW' | 'MEDIUM' | 'HIGH';

export type SpamStatus = 'CLEAN' | 'SPAM' | 'SUSPICIOUS' | 'UNDER_REVIEW' | 'SUSPENDED';

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'VERIFICATION_REVIEWER' | 'SUPPORT';

export interface BusinessServiceItem {
  id: string;
  name: string;
  description: string;
  price?: string;
}

export interface BusinessHours {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  openTime: string;
  closeTime: string;
  isClosed?: boolean;
}

export interface Business {
  id: string; // Permanent Business ID e.g. 'TV-BIZ-8F4K2P'
  slug: string;
  name: string;
  businessType: BusinessType;
  categorySlug: string;
  categoryName: string;
  description: string;
  longDescription: string;
  logoUrl: string;
  coverImageUrl?: string;
  photos: string[];
  websiteUrl: string;
  email: string;
  phone: string;
  address?: string;
  city: string;
  state?: string;
  country: string;
  isGlobalOnline: boolean;
  serviceArea?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  businessHours: BusinessHours[];
  services: BusinessServiceItem[];
  verificationLevel: VerificationLevel;
  isVerified: boolean;
  ownerEmail: string;
  riskStatus: RiskStatus;
  spamStatus: SpamStatus;
  rankingPosition?: number;
  rankingSnapshotDate?: string;
  isSponsored: boolean;
  sponsoredPosition?: 1 | 2 | 3;
  upvotesCount: number;
  viewsCount: number;
  qrScansCount: number;
  ratingAverage: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessCategory {
  slug: string;
  name: string;
  parentSlug?: string;
  aliases: string[];
  synonyms: string[];
  description: string;
  createdBy: string; // e.g. 'system' or user email
  status: 'canonical' | 'pending' | 'rejected';
  businessCount: number;
  usageCount: number;
  qualityScore: number;
  createdAt: string;
}

export interface BusinessDocument {
  id: string;
  name: string;
  fileType: string;
  fileSize: number; // in bytes
  url: string; // Secure relative/private URL
  uploadedAt: string;
}

export interface VerificationRequest {
  id: string;
  businessId: string;
  businessName: string;
  ownerEmail: string;
  country: string;
  categoryName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MORE_INFO_NEEDED';
  requiredDocuments: string[];
  submittedDocuments: BusinessDocument[];
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
  passwordHash: string;
  createdAt: string;
}

export interface BusinessReport {
  id: string;
  businessId: string;
  businessName: string;
  reporterEmail: string;
  reason: 'FAKE' | 'IMPERSONATION' | 'WRONG_INFO' | 'SCAM' | 'OFFENSIVE' | 'SPAM' | 'DUPLICATE' | 'OTHER';
  description: string;
  status: 'NEW' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface BiddingCampaign {
  id: string;
  businessId: string;
  businessName: string;
  categorySlug: string;
  position: 1 | 2 | 3;
  dailyBudget: number; // in USD
  maxBid: number; // in USD per day
  currentBid: number;
  startDate: string;
  endDate: string;
  durationDays: 1 | 7 | 30 | 90;
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'PENDING_PAYMENT';
  impressions: number;
  clicks: number;
  createdAt: string;
}

export interface BusinessReview {
  id: string;
  businessId: string;
  businessSlug: string;
  userId: string;
  userName: string;
  userEmail?: string;
  rating: number; // 1 to 5
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  usageExperience: string;
  ownerResponse?: {
    content: string;
    date: string;
  };
  isVerifiedCustomer: boolean;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminUsername: string;
  action: string;
  targetType: 'BUSINESS' | 'VERIFICATION' | 'REPORT' | 'CATEGORY' | 'BIDDING' | 'USER' | 'POLICY';
  targetId: string;
  details: string;
  timestamp: string;
}

export interface PolicyDocument {
  slug: string;
  title: string;
  version: string;
  effectiveDate: string;
  contentMarkdown: string;
  requiresConsent: boolean;
  status: 'published' | 'review_required';
  lastReviewedBy?: string;
  lastReviewedAt?: string;
}
