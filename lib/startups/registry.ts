import { Startup, StartupCategory, StartupFilter, StartupSubmissionInput } from './types';

export const STARTUP_CATEGORIES: StartupCategory[] = [
  { id: 'cat-ai', name: 'AI & Machine Learning', slug: 'ai-tools', description: 'Artificial intelligence assistants, LLM tools, generators, and neural automation.', icon: '🤖', startupCount: 0 },
  { id: 'cat-saas', name: 'SaaS & B2B Software', slug: 'saas', description: 'Cloud software applications, workflows, CRM, and enterprise platforms.', icon: '⚡', startupCount: 0 },
  { id: 'cat-devtools', name: 'Developer Tools', slug: 'developer-tools', description: 'APIs, SDKs, database managers, backend infrastructure, and code utilities.', icon: '🛠️', startupCount: 0 },
  { id: 'cat-productivity', name: 'Productivity & Work', slug: 'productivity', description: 'Task managers, note taking apps, team collaboration, and time tracking.', icon: '📈', startupCount: 0 },
  { id: 'cat-marketing', name: 'Marketing & SEO', slug: 'marketing-seo', description: 'SEO analyzers, social media automation, content creation, and analytics.', icon: '🚀', startupCount: 0 },
  { id: 'cat-nocode', name: 'No-Code & Website Builders', slug: 'no-code', description: 'Visual web builders, automation connectors, and app builders without code.', icon: '🎨', startupCount: 0 },
  { id: 'cat-fintech', name: 'FinTech & Payments', slug: 'fintech', description: 'Invoicing, billing engines, crypto tools, and financial calculators.', icon: '💳', startupCount: 0 },
  { id: 'cat-ecommerce', name: 'E-Commerce & Retail', slug: 'ecommerce', description: 'Online store platforms, inventory sync, and checkout optimizations.', icon: '🛒', startupCount: 0 }
];

/**
 * Only genuine, verified founder submissions belong in this registry.
 * Demo/sample startups using .example.* domains have been removed.
 */
export const INITIAL_STARTUPS: Startup[] = [];

export function getAllStartups(filter: StartupFilter = {}): Startup[] {
  let list = [...INITIAL_STARTUPS];

  if (filter.category) {
    list = list.filter(s =>
      s.category.toLowerCase() === filter.category?.toLowerCase() ||
      s.category.toLowerCase().includes(filter.category?.toLowerCase() || '')
    );
  }

  if (filter.pricingModel) {
    list = list.filter(s => s.pricingModel === filter.pricingModel);
  }

  if (filter.fundingStage) {
    list = list.filter(s => s.fundingStage === filter.fundingStage);
  }

  if (filter.searchQuery) {
    const q = filter.searchQuery.toLowerCase();
    list = list.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.tagline.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (filter.sortBy === 'newest') {
    list.sort((a, b) => new Date(b.launchedAt).getTime() - new Date(a.launchedAt).getTime());
  } else if (filter.sortBy === 'votes') {
    list.sort((a, b) => b.upvotesCount - a.upvotesCount);
  } else if (filter.sortBy === 'alphabetical') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    list.sort((a, b) => (b.upvotesCount * 3 + b.viewsCount) - (a.upvotesCount * 3 + a.viewsCount));
  }

  return list;
}

export function getStartupBySlug(slug: string): Startup | undefined {
  if (!slug) return undefined;
  const q = slug.trim().toLowerCase();
  return INITIAL_STARTUPS.find(s => s.slug.toLowerCase() === q || s.id.toLowerCase() === q);
}

export function submitStartup(input: StartupSubmissionInput): Startup {
  const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newStartup: Startup = {
    id: `stp-${Date.now()}`,
    slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
    name: input.name,
    tagline: input.tagline,
    description: input.shortDescription,
    longDescription: input.longDescription,
    category: input.category,
    tags: [input.category, input.pricingModel],
    websiteUrl: input.websiteUrl,
    logoUrl: input.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
    screenshots: [],
    pricingModel: input.pricingModel,
    fundingStage: input.fundingStage,
    teamSize: input.teamSize,
    country: input.country,
    city: input.city,
    platforms: input.platforms.length ? input.platforms : ['WEB'],
    keyFeatures: input.keyFeatures,
    targetAudience: input.targetAudience,
    problemSolved: input.problemSolved,
    founderName: input.founderName,
    founderEmail: input.founderEmail,
    upvotesCount: 1,
    bookmarksCount: 0,
    viewsCount: 10,
    outboundClicksCount: 0,
    isVerified: false,
    isFeatured: false,
    isClaimed: true,
    status: 'PUBLISHED',
    launchedAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };

  INITIAL_STARTUPS.unshift(newStartup);
  return newStartup;
}

export function upvoteStartup(startupId: string): number {
  const startup = INITIAL_STARTUPS.find(s => s.id === startupId || s.slug === startupId);
  if (startup) {
    startup.upvotesCount += 1;
    return startup.upvotesCount;
  }
  return 0;
}
