import { Startup, StartupCategory, StartupFilter, StartupSubmissionInput } from './types';

export const STARTUP_CATEGORIES: StartupCategory[] = [
  { id: 'cat-ai', name: 'AI & Machine Learning', slug: 'ai-tools', description: 'Artificial intelligence assistants, LLM tools, generators, and neural automation.', icon: '🤖', startupCount: 42 },
  { id: 'cat-saas', name: 'SaaS & B2B Software', slug: 'saas', description: 'Cloud software applications, workflows, CRM, and enterprise platforms.', icon: '⚡', startupCount: 38 },
  { id: 'cat-devtools', name: 'Developer Tools', slug: 'developer-tools', description: 'APIs, SDKs, database managers, backend infrastructure, and code utilities.', icon: '🛠️', startupCount: 29 },
  { id: 'cat-productivity', name: 'Productivity & Work', slug: 'productivity', description: 'Task managers, note taking apps, team collaboration, and time tracking.', icon: '📈', startupCount: 35 },
  { id: 'cat-marketing', name: 'Marketing & SEO', slug: 'marketing-seo', description: 'SEO analyzers, social media automation, content creation, and analytics.', icon: '🚀', startupCount: 27 },
  { id: 'cat-nocode', name: 'No-Code & Website Builders', slug: 'no-code', description: 'Visual web builders, automation connectors, and app builders without code.', icon: '🎨', startupCount: 21 },
  { id: 'cat-fintech', name: 'FinTech & Payments', slug: 'fintech', description: 'Invoicing, billing engines, crypto tools, and financial calculators.', icon: '💳', startupCount: 19 },
  { id: 'cat-ecommerce', name: 'E-Commerce & Retail', slug: 'ecommerce', description: 'Online store platforms, inventory sync, and checkout optimizations.', icon: '🛒', startupCount: 16 }
];

export const INITIAL_STARTUPS: Startup[] = [
  {
    id: 'stp-nexus-ai',
    slug: 'nexus-ai-writer',
    name: 'Nexus AI Copywriter',
    tagline: 'Autonomous AI Content & SEO Suite for Startups',
    description: 'Generates SEO-optimized articles, social copy, and product documentation with real-time web verification.',
    longDescription: 'Nexus AI Copywriter helps startup founders and growth teams publish high-ranking longform content 10x faster. Built-in SEO keyword clustering, readability auditing, and automatic JSON-LD schema generation.',
    category: 'AI & Machine Learning',
    subcategory: 'Content Generation',
    tags: ['AI', 'SEO', 'Content', 'Copywriting', 'SaaS'],
    websiteUrl: 'https://nexusai.example.com',
    demoUrl: 'https://nexusai.example.com/demo',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
    ],
    pricingModel: 'FREEMIUM',
    pricingDetails: 'Free plan includes 5,000 words/mo. Paid plans start at $19/mo.',
    fundingStage: 'SEED',
    teamSize: '5-10',
    country: 'United States',
    city: 'San Francisco',
    platforms: ['WEB', 'CHROME_EXTENSION'],
    keyFeatures: [
      'Real-time web source verification',
      'Automated SEO meta title & description generator',
      'Multi-language translation support (30+ languages)',
      'Direct WordPress and Webflow export integrations'
    ],
    targetAudience: ['Startup Founders', 'Content Marketers', 'SEO Specialists', 'Copywriters'],
    problemSolved: 'Eliminates hours spent manually writing, formatting, and optimizing blog posts for search engines.',
    founderName: 'Alex Rivera',
    founderEmail: 'alex@nexusai.example.com',
    founderTwitter: 'https://twitter.com/alexrivera_tech',
    founderLinkedIn: 'https://linkedin.com/in/alexriveratech',
    upvotesCount: 248,
    bookmarksCount: 94,
    viewsCount: 1420,
    outboundClicksCount: 380,
    isVerified: true,
    isFeatured: true,
    isClaimed: true,
    status: 'PUBLISHED',
    launchedAt: '2026-09-15',
    updatedAt: '2026-10-01'
  },
  {
    id: 'stp-devflow-db',
    slug: 'devflow-database-studio',
    name: 'DevFlow DB Studio',
    tagline: 'Visual PostgreSQL & MySQL Schema Designer and Query Profiler',
    description: 'Lightweight, browser-native database UI for developers with automated migration generation.',
    longDescription: 'DevFlow DB Studio provides modern engineering teams with an end-to-end visual ERD diagram builder, SQL query performance analyzer, and zero-downtime database migration tool.',
    category: 'Developer Tools',
    subcategory: 'Database Management',
    tags: ['Developer Tools', 'PostgreSQL', 'Database', 'SQL', 'Open Source'],
    websiteUrl: 'https://devflow.example.io',
    logoUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200',
    screenshots: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'
    ],
    pricingModel: 'OPEN_SOURCE',
    pricingDetails: '100% Free & Open Source under MIT License. Enterprise cloud starting at $29/mo.',
    fundingStage: 'BOOTSTRAPPED',
    teamSize: '1-5',
    country: 'Germany',
    city: 'Berlin',
    platforms: ['WEB', 'MAC', 'WINDOWS'],
    keyFeatures: [
      'Visual Schema & Entity Relationship Diagramming',
      'Auto-generation of SQL and Prisma migration files',
      'Real-time query EXPLAIN ANALYZE visualizer',
      'Local encrypted connection credentials storage'
    ],
    targetAudience: ['Backend Developers', 'Database Architects', 'Full-Stack Engineers'],
    problemSolved: 'Replaces bulky database GUIs with a fast, modern visual studio that runs directly in the browser.',
    founderName: 'Elena Rostova',
    founderEmail: 'elena@devflow.example.io',
    upvotesCount: 189,
    bookmarksCount: 67,
    viewsCount: 980,
    outboundClicksCount: 290,
    isVerified: true,
    isFeatured: true,
    isClaimed: true,
    status: 'PUBLISHED',
    launchedAt: '2026-09-20',
    updatedAt: '2026-10-02'
  },
  {
    id: 'stp-taskpulse-pm',
    slug: 'taskpulse-workspace',
    name: 'TaskPulse Remote Workspace',
    tagline: 'Async Team Alignment & Daily Progress Tracking for Distributed Teams',
    description: 'Replaces daily standup meetings with async check-ins, automated blocker alerts, and smart sprint summary summaries.',
    longDescription: 'TaskPulse is built for remote-first teams that want to minimize unnecessary Zoom meetings while keeping everyone aligned across time zones.',
    category: 'Productivity & Work',
    subcategory: 'Team Collaboration',
    tags: ['Productivity', 'Remote Work', 'Agile', 'Async', 'SaaS'],
    websiteUrl: 'https://taskpulse.example.app',
    logoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200',
    screenshots: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800'
    ],
    pricingModel: 'FREEMIUM',
    pricingDetails: 'Free for up to 5 team members. Pro plan $6/user/mo.',
    fundingStage: 'PRE_SEED',
    teamSize: '5-10',
    country: 'Pakistan',
    city: 'Lahore',
    platforms: ['WEB', 'IOS', 'ANDROID'],
    keyFeatures: [
      'Automated async daily check-in prompts via Slack/Teams',
      'AI-generated weekly sprint progress summaries',
      'Time zone aware availability indicators',
      'Integrated blocker escalation dashboard'
    ],
    targetAudience: ['Remote Teams', 'Engineering Managers', 'Agile Scrum Masters', 'Startup Founders'],
    problemSolved: 'Eliminates calendar fatigue caused by daily status update meetings.',
    founderName: 'Tariq Mehmood',
    founderEmail: 'tariq@taskpulse.example.app',
    upvotesCount: 156,
    bookmarksCount: 52,
    viewsCount: 840,
    outboundClicksCount: 210,
    isVerified: true,
    isFeatured: false,
    isClaimed: true,
    status: 'PUBLISHED',
    launchedAt: '2026-09-25',
    updatedAt: '2026-10-04'
  },
  {
    id: 'stp-rankpulse-seo',
    slug: 'rankpulse-backlink-monitor',
    name: 'RankPulse Ethical SEO & Backlink Monitor',
    tagline: 'Track Organic Visibility, Editorial Brand Mentions, and Backlink Indexing',
    description: 'Provides clean organic keyword position tracking, live link status monitoring (dofollow/nofollow/removed), and content audit reports.',
    longDescription: 'RankPulse gives growth marketers real-time visibility into their editorial mentions, brand backlinks, and technical SEO health without expensive enterprise subscriptions.',
    category: 'Marketing & SEO',
    subcategory: 'SEO Tracking',
    tags: ['SEO', 'Backlink Monitoring', 'Marketing', 'Analytics'],
    websiteUrl: 'https://rankpulse.example.com',
    logoUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
    ],
    pricingModel: 'FREE_TRIAL',
    pricingDetails: '14-day full feature trial. Standard plan $29/mo.',
    fundingStage: 'BOOTSTRAPPED',
    teamSize: '1-5',
    country: 'United Kingdom',
    city: 'London',
    platforms: ['WEB', 'API'],
    keyFeatures: [
      'Automated 24/7 backlink index & status monitoring',
      'Anchor text distribution and link attribute analyzer',
      'Weekly SERP position tracking report emails',
      'Exportable CSV and PDF client reports'
    ],
    targetAudience: ['SEO Agencies', 'Inbound Marketers', 'Founders', 'Digital Publishers'],
    problemSolved: 'Prevents silent loss of valuable editorial backlinks and monitors search performance transparently.',
    founderName: 'Oliver Vance',
    founderEmail: 'oliver@rankpulse.example.com',
    upvotesCount: 210,
    bookmarksCount: 88,
    viewsCount: 1150,
    outboundClicksCount: 310,
    isVerified: true,
    isFeatured: true,
    isClaimed: true,
    status: 'PUBLISHED',
    launchedAt: '2026-09-18',
    updatedAt: '2026-10-05'
  }
];

export function getAllStartups(filter?: StartupFilter): Startup[] {
  let list = [...INITIAL_STARTUPS];

  if (!filter) return list;

  if (filter.category) {
    list = list.filter(s => 
      s.category.toLowerCase().includes(filter.category!.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase() === filter.category!.toLowerCase())
    );
  }

  if (filter.country) {
    list = list.filter(s => s.country.toLowerCase().includes(filter.country!.toLowerCase()));
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
    // Default trending sort (votes + views)
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
