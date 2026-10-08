import { PublisherWebsite, GuestPostPitch, PublisherFilter, PitchStatus } from './types';

export const SAMPLE_PUBLISHERS: PublisherWebsite[] = [
  {
    id: 'pub-tech-journal',
    slug: 'tech-vision-journal',
    websiteName: 'TechVision Journal',
    websiteUrl: 'https://techvisionjournal.example.com',
    logoUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200',
    niche: 'SaaS & Software',
    secondaryNiches: ['AI Tools', 'Startup Growth', 'Developer Tools'],
    targetAudience: 'Software Engineers, Product Managers, Founders',
    country: 'United States',
    language: 'English',
    monthlyTrafficRange: '50,000 - 100,000 monthly visits',
    domainRatingDR: 68,
    domainAuthorityDA: 65,
    spamScorePercentage: 1,
    publishingTurnaroundDays: 5,
    responseRatePercentage: 96,
    acceptedTopics: ['Software Architecture', 'SaaS Growth Strategies', 'AI Engineering', 'Developer Workflows'],
    rejectedTopics: ['Gambling', 'Crypto Scams', 'Unverified Health Advice', 'PBN Links'],
    minimumWordCount: 1200,
    maximumExternalLinks: 2,
    supportedLinkAttributes: ['DOFOLLOW', 'NOFOLLOW'],
    pricingModel: 'FREE_EDITORIAL',
    editorialGuidelines: 'Articles must be 100% original, backed by verifiable data or personal engineering experience. No promotional sales pitches in the article body.',
    verificationStatus: 'VERIFIED_OWNER',
    verificationMethod: 'DNS_TXT',
    totalPitchesReceived: 142,
    publishedArticlesCount: 58,
    ratingScore: 4.9,
    createdAt: '2026-08-01'
  },
  {
    id: 'pub-startup-weekly',
    slug: 'startup-builder-daily',
    websiteName: 'Startup Builder Daily',
    websiteUrl: 'https://startupbuilderdaily.example.org',
    logoUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200',
    niche: 'Startup Launch & Growth',
    secondaryNiches: ['Productivity', 'No-Code', 'Bootstrapping'],
    targetAudience: 'Indie Hackers, Early Stage Founders, Marketers',
    country: 'United Kingdom',
    language: 'English',
    monthlyTrafficRange: '25,000 - 50,000 monthly visits',
    domainRatingDR: 54,
    domainAuthorityDA: 52,
    spamScorePercentage: 0,
    publishingTurnaroundDays: 3,
    responseRatePercentage: 98,
    acceptedTopics: ['Bootstrapping Case Studies', 'Product Launch Lessons', 'No-Code Stacks', 'User Acquisition'],
    rejectedTopics: ['Plagiarized AI Content', 'Casino', 'CBD', 'Financial Scams'],
    minimumWordCount: 1000,
    maximumExternalLinks: 2,
    supportedLinkAttributes: ['DOFOLLOW', 'SPONSORED'],
    pricingModel: 'FREE_EDITORIAL',
    editorialGuidelines: 'Share real metrics, failures, and actionable insights. Bio may include 1 link to founder\'s startup or personal X profile.',
    verificationStatus: 'VERIFIED_OWNER',
    verificationMethod: 'META_TAG',
    totalPitchesReceived: 98,
    publishedArticlesCount: 42,
    ratingScore: 4.8,
    createdAt: '2026-08-15'
  },
  {
    id: 'pub-seo-mastery',
    slug: 'seo-growth-digest',
    websiteName: 'SEO Growth Digest',
    websiteUrl: 'https://seogrowthdigest.example.net',
    logoUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200',
    niche: 'Marketing & SEO',
    secondaryNiches: ['Content Strategy', 'Analytics', 'E-commerce'],
    targetAudience: 'Inbound Marketers, Content Managers, SEO Consultants',
    country: 'Canada',
    language: 'English',
    monthlyTrafficRange: '80,000 - 150,000 monthly visits',
    domainRatingDR: 72,
    domainAuthorityDA: 70,
    spamScorePercentage: 2,
    publishingTurnaroundDays: 7,
    responseRatePercentage: 92,
    acceptedTopics: ['Technical SEO Audits', 'Content Clustering', 'E-E-A-T Case Studies', 'Core Web Vitals'],
    rejectedTopics: ['Automated Link Farms', 'Spin Content', 'Paid Review Schemes'],
    minimumWordCount: 1500,
    maximumExternalLinks: 3,
    supportedLinkAttributes: ['DOFOLLOW', 'NOFOLLOW', 'SPONSORED'],
    pricingModel: 'FREE_EDITORIAL',
    editorialGuidelines: 'In-depth analytical guides with screenshots, code examples, or live data analysis. Strict anti-spam editorial review.',
    verificationStatus: 'VERIFIED_OWNER',
    verificationMethod: 'HTML_FILE',
    totalPitchesReceived: 215,
    publishedArticlesCount: 89,
    ratingScore: 4.95,
    createdAt: '2026-07-10'
  }
];

export const INITIAL_PITCHES: GuestPostPitch[] = [
  {
    id: 'pitch-1',
    publisherId: 'pub-tech-journal',
    publisherName: 'TechVision Journal',
    applicantName: 'Alex Rivera',
    applicantEmail: 'alex@nexusai.example.com',
    applicantCompany: 'Nexus AI Copywriter',
    proposedTitle: 'How to Build an Autonomous AI Content Pipeline with Next.js & Worker Queues',
    alternativeTitles: [
      'Scaling AI LLM API Calls without Rate Limit Deadlocks',
      'The Modern Architecture of Real-time Web Verified AI Generators'
    ],
    articleOutline: '1. Introduction to AI rate limit bottlenecks\n2. Queue architecture using Redis & Celery\n3. Client-side SSE hydration\n4. Benchmark results and lessons learned',
    pitchMessage: 'Hi Team, I would love to share our technical post-mortem on handling 1M+ monthly LLM calls reliably.',
    targetUrl: 'https://nexusai.example.com',
    desiredAnchorText: 'Nexus AI platform architecture',
    authorBio: 'Alex Rivera is the CTO of Nexus AI, building LLM automation systems for growth teams.',
    sampleWritingUrls: ['https://nexusai.example.com/blog/architecture-case-study'],
    status: 'ACCEPTED',
    publishedUrl: 'https://techvisionjournal.example.com/articles/ai-content-pipeline-architecture',
    publishedAt: '2026-09-28',
    linkAttributeAssigned: 'DOFOLLOW',
    createdAt: '2026-09-20',
    updatedAt: '2026-09-28'
  }
];

export function getAllPublishers(filter?: PublisherFilter): PublisherWebsite[] {
  let list = [...SAMPLE_PUBLISHERS];

  if (!filter) return list;

  if (filter.niche) {
    list = list.filter(p => p.niche.toLowerCase().includes(filter.niche!.toLowerCase()) || p.secondaryNiches.some(s => s.toLowerCase().includes(filter.niche!.toLowerCase())));
  }

  if (filter.country) {
    list = list.filter(p => p.country.toLowerCase().includes(filter.country!.toLowerCase()));
  }

  if (filter.pricingModel) {
    list = list.filter(p => p.pricingModel === filter.pricingModel);
  }

  if (filter.minDR) {
    list = list.filter(p => p.domainRatingDR >= filter.minDR!);
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
