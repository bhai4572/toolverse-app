import { PublisherWebsite, GuestPostPitch, PublisherFilter, PitchStatus } from './types';

/**
 * Only real, verified publisher websites belong here.
 * Demo/sample publishers using .example.* domains and invented DR/DA metrics have been removed.
 */
export const SAMPLE_PUBLISHERS: PublisherWebsite[] = [];

export const INITIAL_PITCHES: GuestPostPitch[] = [];

export function getAllPublishers(filter: PublisherFilter = {}): PublisherWebsite[] {
  let list = [...SAMPLE_PUBLISHERS];

  if (filter.niche) {
    list = list.filter(p =>
      p.niche.toLowerCase() === filter.niche?.toLowerCase() ||
      p.secondaryNiches.some(n => n.toLowerCase().includes(filter.niche?.toLowerCase() || ''))
    );
  }

  if (filter.pricingModel) {
    list = list.filter(p => p.pricingModel === filter.pricingModel);
  }

  if (filter.minDR) {
    list = list.filter(p => p.domainRatingDR >= (filter.minDR || 0));
  }

  if (filter.searchQuery) {
    const q = filter.searchQuery.toLowerCase();
    list = list.filter(p =>
      p.websiteName.toLowerCase().includes(q) ||
      p.websiteUrl.toLowerCase().includes(q) ||
      p.niche.toLowerCase().includes(q)
    );
  }

  return list;
}

export function getPublisherBySlug(slug: string): PublisherWebsite | undefined {
  if (!slug) return undefined;
  const q = slug.trim().toLowerCase();
  return SAMPLE_PUBLISHERS.find(p => p.slug.toLowerCase() === q || p.id.toLowerCase() === q);
}

export function submitGuestPostPitch(input: Omit<GuestPostPitch, 'id' | 'status' | 'createdAt' | 'updatedAt'>): GuestPostPitch {
  const newPitch: GuestPostPitch = {
    ...input,
    id: `pitch-${Date.now()}`,
    status: 'SUBMITTED',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };

  INITIAL_PITCHES.unshift(newPitch);
  return newPitch;
}

export function getPitchesForApplicant(email: string): GuestPostPitch[] {
  if (!email) return INITIAL_PITCHES;
  return INITIAL_PITCHES.filter(p => p.applicantEmail.toLowerCase() === email.toLowerCase());
}

export function updatePitchStatus(pitchId: string, newStatus: PitchStatus, publishedUrl?: string): GuestPostPitch | undefined {
  const pitch = INITIAL_PITCHES.find(p => p.id === pitchId);
  if (pitch) {
    pitch.status = newStatus;
    pitch.updatedAt = new Date().toISOString().split('T')[0];
    if (publishedUrl) {
      pitch.publishedUrl = publishedUrl;
      pitch.publishedAt = new Date().toISOString().split('T')[0];
    }
  }
  return pitch;
}

export function registerPublisherWebsite(input: Partial<PublisherWebsite>): PublisherWebsite {
  const slug = (input.websiteName || 'publisher').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newPub: PublisherWebsite = {
    id: `pub-${Date.now()}`,
    slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
    websiteName: input.websiteName || 'New Publisher',
    websiteUrl: input.websiteUrl || 'https://example.com',
    logoUrl: input.logoUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200',
    niche: input.niche || 'General Tech',
    secondaryNiches: input.secondaryNiches || ['Startup', 'Growth'],
    targetAudience: input.targetAudience || 'Founders and Creators',
    country: input.country || 'United States',
    language: input.language || 'English',
    monthlyTrafficRange: '10,000 - 50,000 monthly visits',
    domainRatingDR: input.domainRatingDR || 45,
    domainAuthorityDA: input.domainAuthorityDA || 42,
    spamScorePercentage: 0,
    publishingTurnaroundDays: input.publishingTurnaroundDays || 5,
    responseRatePercentage: 100,
    acceptedTopics: input.acceptedTopics || ['Tech', 'Startup', 'Software'],
    rejectedTopics: ['Spam', 'Gambling'],
    minimumWordCount: input.minimumWordCount || 1000,
    maximumExternalLinks: input.maximumExternalLinks || 2,
    supportedLinkAttributes: input.supportedLinkAttributes || ['DOFOLLOW', 'NOFOLLOW'],
    pricingModel: input.pricingModel || 'FREE_EDITORIAL',
    editorialGuidelines: input.editorialGuidelines || 'High-quality, original content required.',
    verificationStatus: 'VERIFIED_OWNER',
    verificationMethod: input.verificationMethod || 'DNS_TXT',
    totalPitchesReceived: 0,
    publishedArticlesCount: 0,
    ratingScore: 5.0,
    createdAt: new Date().toISOString().split('T')[0]
  };

  SAMPLE_PUBLISHERS.unshift(newPub);
  return newPub;
}
