import { BiddingCampaign, Business } from './types';
import { logAdminAudit } from '../admin/authEngine';

const BIDDING_CAMPAIGNS_KEY = 'toolverse_bidding_campaigns';

export function getStoredBiddingCampaigns(): BiddingCampaign[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BIDDING_CAMPAIGNS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function createOrUpdateBiddingCampaign(
  business: Business,
  position: 1 | 2 | 3,
  dailyBudget: number,
  maxBid: number,
  durationDays: 1 | 7 | 30 | 90,
  adminUsername?: string
): BiddingCampaign {
  const campaigns = getStoredBiddingCampaigns();
  const startDate = new Date().toISOString().split('T')[0];
  const endDateObj = new Date();
  endDateObj.setDate(endDateObj.getDate() + durationDays);
  const endDate = endDateObj.toISOString().split('T')[0];

  const campaign: BiddingCampaign = {
    id: `bid-${Date.now()}`,
    businessId: business.id,
    businessName: business.name,
    categorySlug: business.categorySlug,
    position,
    dailyBudget,
    maxBid,
    currentBid: maxBid,
    startDate,
    endDate,
    durationDays,
    status: 'ACTIVE',
    impressions: 0,
    clicks: 0,
    createdAt: new Date().toISOString(),
  };

  campaigns.unshift(campaign);

  if (typeof window !== 'undefined') {
    localStorage.setItem(BIDDING_CAMPAIGNS_KEY, JSON.stringify(campaigns));
    if (adminUsername) {
      logAdminAudit(adminUsername, 'CAMPAIGN_CREATED', 'BIDDING', business.id, `Created sponsored campaign for ${business.name} at Position #${position}`);
    }
  }

  return campaign;
}

/** Evaluate current sponsored Top 3 rankings for a category based on active campaigns */
export function getActiveSponsoredPositions(categorySlug: string): Record<number, BiddingCampaign> {
  const campaigns = getStoredBiddingCampaigns().filter(
    (c) => c.categorySlug === categorySlug && c.status === 'ACTIVE'
  );

  const result: Record<number, BiddingCampaign> = {};
  for (const pos of [1, 2, 3]) {
    const topBid = campaigns
      .filter((c) => c.position === pos)
      .sort((a, b) => b.currentBid - a.currentBid)[0];
    if (topBid) {
      result[pos] = topBid;
    }
  }
  return result;
}
