/**
 * Toolverse Guest Posting & Publisher Marketplace Types
 */

export type LinkAttribute = 'DOFOLLOW' | 'NOFOLLOW' | 'SPONSORED' | 'UGC';

export type PublisherPricingModel = 'FREE_EDITORIAL' | 'SPONSORED_FEE' | 'INVITE_ONLY' | 'NEGOTIABLE';

export type PitchStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'REVISION_REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'PUBLISHED';

export interface PublisherWebsite {
  id: string;
  slug: string;
  websiteName: string;
  websiteUrl: string;
  logoUrl?: string;
  niche: string;
  secondaryNiches: string[];
  targetAudience: string;
  country: string;
  language: string;
  monthlyTrafficRange: string;
  domainRatingDR: number;
  domainAuthorityDA: number;
  spamScorePercentage: number;
  publishingTurnaroundDays: number;
  responseRatePercentage: number;
  acceptedTopics: string[];
  rejectedTopics: string[];
  minimumWordCount: number;
  maximumExternalLinks: number;
  supportedLinkAttributes: LinkAttribute[];
  pricingModel: PublisherPricingModel;
  sponsoredFeeUsd?: number;
  editorialGuidelines: string;
  verificationStatus: 'VERIFIED_OWNER' | 'UNDER_REVIEW' | 'UNVERIFIED';
  verificationMethod?: 'DNS_TXT' | 'META_TAG' | 'HTML_FILE';
  totalPitchesReceived: number;
  publishedArticlesCount: number;
  ratingScore: number;
  createdAt: string;
}

export interface GuestPostPitch {
  id: string;
  publisherId: string;
  publisherName: string;
  applicantName: string;
  applicantEmail: string;
  applicantCompany?: string;
  proposedTitle: string;
  alternativeTitles: string[];
  articleOutline: string;
  pitchMessage: string;
  targetUrl: string;
  desiredAnchorText: string;
  authorBio: string;
  sampleWritingUrls: string[];
  status: PitchStatus;
  publishedUrl?: string;
  publishedAt?: string;
  linkAttributeAssigned?: LinkAttribute;
  createdAt: string;
  updatedAt: string;
}

export interface PublisherFilter {
  niche?: string;
  country?: string;
  language?: string;
  pricingModel?: PublisherPricingModel;
  minDR?: number;
  linkAttribute?: LinkAttribute;
  searchQuery?: string;
}
