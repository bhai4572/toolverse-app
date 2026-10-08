import { Product } from './types';

export const PRODUCT_CATEGORIES = [
  { slug: 'ai-tools', name: 'AI & Machine Learning', icon: 'Sparkles', description: 'Artificial intelligence assistants, image generators, LLMs, and automation engines.' },
  { slug: 'developer-tools', name: 'Developer Tools', icon: 'Code', description: 'APIs, cloud databases, IDEs, CI/CD pipelines, and backend infrastructure.' },
  { slug: 'design-graphics', name: 'Design & Graphics', icon: 'Palette', description: 'UI/UX tools, graphic creation, vector editors, and photo manipulation software.' },
  { slug: 'productivity', name: 'Productivity & Workspaces', icon: 'CheckSquare', description: 'Task managers, notes, team workspaces, document editing, and time tracking.' },
  { slug: 'marketing-seo', name: 'Marketing & SEO', icon: 'TrendingUp', description: 'Keyword research, email marketing, analytics, social media management, and advertising.' },
  { slug: 'business-saas', name: 'Business & Finance', icon: 'Briefcase', description: 'Invoicing, CRM, payroll, accounting, e-commerce platforms, and customer support.' },
  { slug: 'communication', name: 'Communication & Collaboration', icon: 'MessageSquare', description: 'Team messaging, video conferencing, community forums, and asynchronous video.' },
  { slug: 'no-code-automation', name: 'No-Code & Automation', icon: 'Zap', description: 'App builders, workflow automation, website builders, and data sync integrators.' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-canva',
    slug: 'canva',
    name: 'Canva',
    tagline: 'Visual suite for design, presentations, documents, and video editing',
    description: 'Canva makes graphic design amazingly simple for everyone. Create stunning social media posts, presentations, logos, posters, and documents with drag-and-drop ease.',
    longDescription: 'Canva is an online graphic design and visual collaboration platform used by over 170 million people worldwide. It offers tens of thousands of customizable templates, stock photos, fonts, illustrations, and AI-powered design tools like Magic Studio, Background Remover, and Magic Write.',
    websiteUrl: 'https://www.canva.com',
    logoUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=128&h=128&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=1200&h=630&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=800&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&fit=crop'
    ],
    categorySlug: 'design-graphics',
    categoryName: 'Design & Graphics',
    subcategory: 'Graphic Design & Presentation',
    features: [
      { title: 'Drag-and-Drop Editor', description: 'Intuitive canvas editor with thousands of ready-made design components.' },
      { title: 'Magic Studio AI', description: 'Transform text to images, erase unwanted objects, and resize graphics instantly.' },
      { title: 'Brand Kit Collaboration', description: 'Store team color palettes, logos, and custom typography fonts.' },
      { title: 'Social Media Scheduler', description: 'Design and schedule posts directly across Instagram, LinkedIn, and Facebook.' }
    ],
    pricingModel: 'Freemium',
    pricingPlans: [
      { name: 'Canva Free', price: '$0', period: 'free', features: ['250,000+ templates', '5GB cloud storage', 'AI design generators'] },
      { name: 'Canva Pro', price: '$14.99', period: 'month', features: ['100M+ premium assets', 'Background remover', 'Magic Switch AI', '1TB storage'], isPopular: true },
      { name: 'Canva Teams', price: '$10.00', period: 'month', features: ['Brand controls', 'Team workflows', 'Admin approval controls'] }
    ],
    platforms: ['Web', 'Mac', 'Windows', 'iOS', 'Android'],
    country: 'Australia',
    companyName: 'Canva Pty Ltd',
    companySlug: 'canva-inc',
    founderName: 'Melanie Perkins, Cliff Obrecht, Cameron Adams',
    founderTwitter: 'melaniecanva',
    launchDate: '2013-01-01',
    socialLinks: {
      twitter: 'https://twitter.com/canva',
      linkedin: 'https://linkedin.com/company/canva'
    },
    documentationUrl: 'https://www.canva.com/help',
    demoUrl: 'https://www.canva.com',
    supportUrl: 'https://www.canva.com/help',
    isVerified: true,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    upvotesCount: 1420,
    viewsCount: 45200,
    ratingAverage: 4.8,
    ratingCount: 312,
    pros: [
      'Extremely user friendly with zero learning curve for beginners',
      'Massive library of high quality templates and stock media',
      'Seamless multi-platform sync across web and mobile apps'
    ],
    cons: [
      'Export options for vector EPS/SVG can be restrictive on free tier',
      'Advanced photo retouching is limited compared to Photoshop'
    ],
    relatedToolverseToolSlugs: ['image-compressor', 'social-media-image-resizer', 'jpg-to-png', 'passport-photo-maker'],
    relatedProductSlugs: ['figma', 'midjourney'],
    lastUpdated: '2026-10-01',
    status: 'approved'
  },
  {
    id: 'prod-chatgpt',
    slug: 'chatgpt',
    name: 'ChatGPT',
    tagline: 'Conversational AI assistant powered by OpenAI GPT-4o and reasoning models',
    description: 'ChatGPT is an advanced AI assistant created by OpenAI that can answer questions, generate text, write code, analyze data, process images, and converse naturally.',
    longDescription: 'ChatGPT revolutionized generative AI by providing a natural language interface for writing, coding, brainstorming, data analysis, and visual understanding. With GPT-4o, canvas code editor, custom GPTs, and web search, it serves millions of professionals and developers worldwide.',
    websiteUrl: 'https://chatgpt.com',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&fit=crop'
    ],
    categorySlug: 'ai-tools',
    categoryName: 'AI & Machine Learning',
    subcategory: 'AI Assistant & LLM',
    features: [
      { title: 'GPT-4o Multimodal Intelligence', description: 'Process text, voice, images, and code natively with high speed.' },
      { title: 'Code Interpreter & Data Analysis', description: 'Run Python scripts inline, visualize datasets, and extract Insights.' },
      { title: 'Custom GPTs Marketplace', description: 'Build and deploy specialized AI assistants tailored to specific workflows.' },
      { title: 'Web Browsing & Search', description: 'Fetch real-time information with accurate citation links.' }
    ],
    pricingModel: 'Freemium',
    pricingPlans: [
      { name: 'Free Plan', price: '$0', period: 'free', features: ['Access to GPT-4o mini', 'Standard response speed', 'Web access'] },
      { name: 'ChatGPT Plus', price: '$20', period: 'month', features: ['Full GPT-4o & o1 reasoning', '5x higher message limits', 'Custom GPT builder', 'DALL-E 3 image generation'], isPopular: true },
      { name: 'ChatGPT Team', price: '$25', period: 'month', features: ['Admin workspace controls', 'No data training on business inputs', 'Higher rate limits'] }
    ],
    platforms: ['Web', 'Mac', 'Windows', 'iOS', 'Android'],
    country: 'United States',
    companyName: 'OpenAI Inc',
    companySlug: 'openai',
    founderName: 'Sam Altman, Greg Brockman, Ilya Sutskever',
    founderTwitter: 'sama',
    launchDate: '2022-11-30',
    socialLinks: {
      twitter: 'https://twitter.com/openai',
      github: 'https://github.com/openai'
    },
    documentationUrl: 'https://platform.openai.com/docs',
    demoUrl: 'https://chatgpt.com',
    supportUrl: 'https://help.openai.com',
    isVerified: true,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    upvotesCount: 2850,
    viewsCount: 98000,
    ratingAverage: 4.9,
    ratingCount: 580,
    pros: [
      'Industry-leading natural language understanding and reasoning',
      'Versatile execution across programming, copywriting, and mathematics',
      'Constant model updates and web browsing capabilities'
    ],
    cons: [
      'Rate limits during peak capacity hours on free tiers',
      'Can occasionally hallucinate technical edge-case details'
    ],
    relatedToolverseToolSlugs: ['word-counter', 'lorem-ipsum-generator', 'json-formatter', 'meta-tag-generator'],
    relatedProductSlugs: ['claude-ai', 'notion'],
    lastUpdated: '2026-10-05',
    status: 'approved'
  },
  {
    id: 'prod-notion',
    slug: 'notion',
    name: 'Notion',
    tagline: 'Connected workspace for wiki, docs, notes, projects, and AI automation',
    description: 'Notion combines notes, docs, task databases, and wikis into a customizable workspace powered by integrated AI search and writing tools.',
    longDescription: 'Notion is the modern workplace operating system used by companies like Figma, Nike, and Uber. Its block-based editor allows teams to build customized CRM databases, product roadmaps, project trackers, team wikis, and AI document summary workflows in one single app.',
    websiteUrl: 'https://www.notion.so',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=630&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&fit=crop'
    ],
    categorySlug: 'productivity',
    categoryName: 'Productivity & Workspaces',
    subcategory: 'Knowledge Base & Notes',
    features: [
      { title: 'Block-Based Editor', description: 'Nest text, databases, code snippets, toggles, and media blocks seamlessly.' },
      { title: 'Relational Databases', description: 'Connect tasks, projects, customers, and team docs with rollups and formulas.' },
      { title: 'Notion AI Q&A', description: 'Search across your entire team workspace and get instant answers with source links.' },
      { title: 'Public Web Publishing', description: 'Turn any page into a fast, live website with custom domain support.' }
    ],
    pricingModel: 'Freemium',
    pricingPlans: [
      { name: 'Free', price: '$0', period: 'free', features: ['Unlimited blocks for individuals', '7-day version history', 'Sync across devices'] },
      { name: 'Plus', price: '$10', period: 'month', features: ['Unlimited file uploads', '30-day version history', '100 guest invites'], isPopular: true },
      { name: 'Business', price: '$18', period: 'month', features: ['SAML SSO', 'Private team spaces', '90-day version history', 'Advanced analytics'] }
    ],
    platforms: ['Web', 'Mac', 'Windows', 'iOS', 'Android'],
    country: 'United States',
    companyName: 'Notion Labs Inc',
    companySlug: 'notion-labs',
    founderName: 'Ivan Zhao, Simon Last',
    founderTwitter: 'ivanzhao',
    launchDate: '2016-03-01',
    socialLinks: {
      twitter: 'https://twitter.com/notionhq',
      linkedin: 'https://linkedin.com/company/notionhq'
    },
    documentationUrl: 'https://www.notion.so/help',
    demoUrl: 'https://www.notion.so',
    supportUrl: 'https://www.notion.so/help',
    isVerified: true,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    upvotesCount: 1980,
    viewsCount: 62000,
    ratingAverage: 4.7,
    ratingCount: 420,
    pros: [
      'Unrivaled customization with flexible relational databases',
      'Clean aesthetic interface that unifies docs, tasks, and wikis',
      'Vast template ecosystem created by global power users'
    ],
    cons: [
      'Offline functionality is limited compared to native local text editors',
      'Learning curve for complex relational formulas and rollups'
    ],
    relatedToolverseToolSlugs: ['word-counter', 'character-counter', 'text-case-converter', 'json-to-csv'],
    relatedProductSlugs: ['chatgpt', 'linear'],
    lastUpdated: '2026-09-28',
    status: 'approved'
  },
  {
    id: 'prod-figma',
    slug: 'figma',
    name: 'Figma',
    tagline: 'Collaborative interface design, prototyping, and FigJam whiteboard tool',
    description: 'Figma connects everyone in the design process so teams can deliver better products faster. Create vector designs, responsive UI prototypes, and FigJam ideation boards.',
    longDescription: 'Figma is the leading browser-based collaborative UI/UX design tool. Used by software engineers, product managers, and UI designers alike, Figma features real-time co-editing, vector networks, auto-layout 5.0, design system component variables, Dev Mode code inspection, and interactive prototyping.',
    websiteUrl: 'https://www.figma.com',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1200&h=630&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&fit=crop'
    ],
    categorySlug: 'design-graphics',
    categoryName: 'Design & Graphics',
    subcategory: 'UI/UX & Prototyping',
    features: [
      { title: 'Real-Time Co-Editing', description: 'Work simultaneously with multi-cursor collaboration in browser.' },
      { title: 'Dev Mode Code Inspector', description: 'Translate design tokens to CSS, React, iOS Swift, and Android XML code.' },
      { title: 'Auto Layout & Variables', description: 'Create responsive UI components with dynamic paddings and theme tokens.' },
      { title: 'Interactive Prototypes', description: 'Simulate realistic app flows with micro-animations and smart animate.' }
    ],
    pricingModel: 'Freemium',
    pricingPlans: [
      { name: 'Starter', price: '$0', period: 'free', features: ['3 Figma files', 'Unlimited collaborators', 'FigJam basic access'] },
      { name: 'Professional', price: '$12', period: 'month', features: ['Unlimited Figma files', 'Design system libraries', 'Dev Mode access', 'Shared styles'], isPopular: true },
      { name: 'Organization', price: '$45', period: 'month', features: ['Org-wide design systems', 'SSO security', 'Design analytics'] }
    ],
    platforms: ['Web', 'Mac', 'Windows'],
    country: 'United States',
    companyName: 'Figma Inc',
    companySlug: 'figma-inc',
    founderName: 'Dylan Field, Evan Wallace',
    founderTwitter: 'zoink',
    launchDate: '2016-09-27',
    socialLinks: {
      twitter: 'https://twitter.com/figma',
      github: 'https://github.com/figma'
    },
    documentationUrl: 'https://help.figma.com',
    demoUrl: 'https://www.figma.com',
    supportUrl: 'https://help.figma.com',
    isVerified: true,
    isFeatured: true,
    isTrending: false,
    isNew: false,
    upvotesCount: 2210,
    viewsCount: 74000,
    ratingAverage: 4.9,
    ratingCount: 510,
    pros: [
      'Runs smoothly in web browser on Mac, Windows, and Chromebooks',
      'Best-in-class real-time team collaboration',
      'Robust Dev Mode bridging designers and developers'
    ],
    cons: [
      'Requires active internet connection for collaborative cloud saves',
      'Dev Mode requires paid seat allocation'
    ],
    relatedToolverseToolSlugs: ['image-resizer', 'jpg-to-png', 'social-media-image-resizer'],
    relatedProductSlugs: ['canva', 'linear'],
    lastUpdated: '2026-09-30',
    status: 'approved'
  },
  {
    id: 'prod-supabase',
    slug: 'supabase',
    name: 'Supabase',
    tagline: 'The open source Firebase alternative with Postgres database and vector search',
    description: 'Supabase provides developers with a dedicated PostgreSQL database, instant REST & GraphQL APIs, authentication, storage, edge functions, and vector embeddings.',
    longDescription: 'Supabase is an open-source Firebase alternative powering over 100,000 developer projects. Every Supabase project comes with a full-featured Postgres database, row-level security (RLS), real-time subscriptions, auth with social logins, S3-compatible file storage, edge functions, and pgvector for AI applications.',
    websiteUrl: 'https://supabase.com',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&fit=crop'
    ],
    categorySlug: 'developer-tools',
    categoryName: 'Developer Tools',
    subcategory: 'Database & Backend as a Service',
    features: [
      { title: 'Postgres & Row Level Security', description: 'Full ACID-compliant PostgreSQL with declarative security policies.' },
      { title: 'Instant REST & Realtime APIs', description: 'Auto-generated TypeScript APIs with instant pub/sub web sockets.' },
      { title: 'Auth & Social Providers', description: 'Built-in email, magic link, GitHub, Google, and Apple user authentication.' },
      { title: 'Vector Embeddings pgvector', description: 'Store and search vector embeddings natively for AI semantic search.' }
    ],
    pricingModel: 'Freemium',
    pricingPlans: [
      { name: 'Free Tier', price: '$0', period: 'free', features: ['500MB Postgres database', '50,000 monthly active users', '1GB file storage'] },
      { name: 'Pro Plan', price: '$25', period: 'month', features: ['8GB database storage', '100,000 monthly active users', 'Daily backups', 'No project pausing'], isPopular: true },
      { name: 'Team Plan', price: '$599', period: 'month', features: ['SOC2 compliance', 'Custom domain', 'Dedicated support SLA'] }
    ],
    platforms: ['Web', 'Mac', 'Windows', 'Linux', 'API'],
    country: 'Singapore',
    companyName: 'Supabase Inc',
    companySlug: 'supabase-inc',
    founderName: 'Paul Copplestone, Ant Wilson',
    founderTwitter: 'kiwicopple',
    launchDate: '2020-01-01',
    socialLinks: {
      twitter: 'https://twitter.com/supabase',
      github: 'https://github.com/supabase/supabase'
    },
    documentationUrl: 'https://supabase.com/docs',
    demoUrl: 'https://supabase.com',
    supportUrl: 'https://supabase.com/support',
    isVerified: true,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    upvotesCount: 1750,
    viewsCount: 53000,
    ratingAverage: 4.8,
    ratingCount: 290,
    pros: [
      'Genuine open-source software without vendor lock-in',
      'Full power of SQL and PostgreSQL row-level security',
      'Fast, modern dashboard with schema visualizer'
    ],
    cons: [
      'Free tier databases pause after 1 week of inactivity',
      'Complex custom Postgres triggers require SQL expertise'
    ],
    relatedToolverseToolSlugs: ['json-formatter', 'uuid-generator', 'base64-encoder-decoder', 'hash-generator'],
    relatedProductSlugs: ['postman', 'chatgpt'],
    lastUpdated: '2026-10-02',
    status: 'approved'
  },
  {
    id: 'prod-claude-ai',
    slug: 'claude-ai',
    name: 'Claude AI',
    tagline: 'Next-generation AI assistant developed by Anthropic for reasoning and coding',
    description: 'Claude is a high-precision AI assistant created by Anthropic. Claude 3.5 Sonnet excels in complex reasoning, coding, writing long documents, and computer use.',
    longDescription: 'Claude is Anthropic’s flagship AI assistant, widely praised by software engineers and researchers for its remarkable coding proficiency, 200k token context window, artifacts UI preview, and safety-focused design architecture.',
    websiteUrl: 'https://claude.ai',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=630&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&fit=crop'
    ],
    categorySlug: 'ai-tools',
    categoryName: 'AI & Machine Learning',
    subcategory: 'AI Assistant & LLM',
    features: [
      { title: 'Claude 3.5 Sonnet Model', description: 'Superior code generation, logic reasoning, and nuanced prose writing.' },
      { title: 'Interactive Artifacts Window', description: 'View code, SVG graphics, web apps, and diagrams rendered live side-by-side.' },
      { title: '200,000 Token Context Window', description: 'Upload entire codebases, research papers, and technical books.' },
      { title: 'Projects Workspace', description: 'Group documents and custom system instructions for team knowledge.' }
    ],
    pricingModel: 'Freemium',
    pricingPlans: [
      { name: 'Free', price: '$0', period: 'free', features: ['Access to Claude 3.5 Sonnet', 'Standard rate limits', 'Artifacts interactive preview'] },
      { name: 'Claude Pro', price: '$20', period: 'month', features: ['5x usage limits', 'Priority access', 'Projects feature', 'Early access to new models'], isPopular: true },
      { name: 'Claude Team', price: '$25', period: 'month', features: ['Shared team projects', 'Centralized billing', 'Higher usage capacity'] }
    ],
    platforms: ['Web', 'Mac', 'Windows', 'iOS', 'Android'],
    country: 'United States',
    companyName: 'Anthropic PBC',
    companySlug: 'anthropic',
    founderName: 'Dario Amodei, Daniela Amodei',
    founderTwitter: 'darioamodei',
    launchDate: '2023-03-14',
    socialLinks: {
      twitter: 'https://twitter.com/anthropicai',
      github: 'https://github.com/anthropic'
    },
    documentationUrl: 'https://docs.anthropic.com',
    demoUrl: 'https://claude.ai',
    supportUrl: 'https://support.anthropic.com',
    isVerified: true,
    isFeatured: true,
    isTrending: true,
    isNew: false,
    upvotesCount: 2410,
    viewsCount: 89000,
    ratingAverage: 4.9,
    ratingCount: 490,
    pros: [
      'Unmatched code accuracy and clean implementation details',
      'Artifacts interface makes web prototype debugging instant',
      'Large 200k context window accepts massive documentation files'
    ],
    cons: [
      'Usage limits trigger faster during intensive code generation sessions',
      'No native real-time web browsing in standard interface'
    ],
    relatedToolverseToolSlugs: ['word-counter', 'json-formatter', 'meta-tag-generator', 'character-counter'],
    relatedProductSlugs: ['chatgpt', 'supabase'],
    lastUpdated: '2026-10-06',
    status: 'approved'
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === categorySlug && p.status === 'approved');
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isFeatured && p.status === 'approved');
}

export function getTrendingProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isTrending && p.status === 'approved');
}

export function getNewProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isNew || p.status === 'approved').slice(0, 10);
}
