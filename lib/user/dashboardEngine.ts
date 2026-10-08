/**
 * Toolverse User Roles & Dashboard Analytics Engine
 */

export type UserRole = 'VISITOR' | 'FOUNDER' | 'PUBLISHER' | 'WRITER' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  avatarUrl?: string;
  savedStartups: string[];
  savedTools: string[];
  savedPublishers: string[];
  createdAt: string;
}

export interface FounderDashboardMetrics {
  totalListingsCount: number;
  totalViewsCount: number;
  totalOutboundClicksCount: number;
  totalUpvotesCount: number;
  activePitchesCount: number;
  publishedPlacementsCount: number;
  listingCompletionScorePercentage: number;
}

export interface PublisherDashboardMetrics {
  totalWebsitesCount: number;
  verifiedWebsitesCount: number;
  pendingPitchesCount: number;
  acceptedPitchesCount: number;
  publishedArticlesCount: number;
  averageResponseTimeDays: number;
}

export const CURRENT_MOCK_USER: UserProfile = {
  id: 'usr-demo-founder',
  name: 'Alex Rivera',
  email: 'alex@nexusai.example.com',
  role: 'FOUNDER',
  companyName: 'Nexus AI Copywriter',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  savedStartups: ['stp-devflow-db', 'stp-rankpulse-seo'],
  savedTools: ['json-formatter', 'pdf-merge'],
  savedPublishers: ['pub-tech-journal', 'pub-seo-mastery'],
  createdAt: '2026-08-01'
};

export function getFounderMetrics(): FounderDashboardMetrics {
  return {
    totalListingsCount: 2,
    totalViewsCount: 2840,
    totalOutboundClicksCount: 690,
    totalUpvotesCount: 437,
    activePitchesCount: 3,
    publishedPlacementsCount: 1,
    listingCompletionScorePercentage: 95
  };
}

export function getPublisherMetrics(): PublisherDashboardMetrics {
  return {
    totalWebsitesCount: 1,
    verifiedWebsitesCount: 1,
    pendingPitchesCount: 4,
    acceptedPitchesCount: 12,
    publishedArticlesCount: 58,
    averageResponseTimeDays: 2
  };
}
