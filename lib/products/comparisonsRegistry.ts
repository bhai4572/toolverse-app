import { ComparisonPage } from './types';

export const COMPARISON_PAGES: ComparisonPage[] = [
  {
    slug: 'canva-vs-figma',
    productASlug: 'canva',
    productBSlug: 'figma',
    title: 'Canva vs Figma: Which Design Tool Should You Choose in 2026?',
    metaDescription: 'In-depth comparison of Canva vs Figma. Compare features, pricing, UI prototyping, template selection, and best use cases.',
    verdict: 'Choose Canva if you need quick marketing graphics, social media posts, and simple presentation templates. Choose Figma if you are building web/mobile apps, UI design systems, interactive prototypes, or collaborating with software developers.',
    comparisonMatrix: [
      { feature: 'Primary Target Audience', productAValue: 'Marketers, Small Businesses, Social Creators', productBValue: 'UI/UX Designers, Product Managers, Software Engineers', winner: 'Tie' },
      { feature: 'Ease of Use for Beginners', productAValue: 'Instant (Drag-and-Drop Templates)', productBValue: 'Moderate Learning Curve', winner: 'A' },
      { feature: 'Vector UI & Prototyping', productAValue: 'Basic Shapes & Animations', productBValue: 'Advanced Vector Networks & Interactive Micro-Animations', winner: 'B' },
      { feature: 'Developer Code Inspection', productAValue: 'None', productBValue: 'Dedicated Dev Mode (CSS, React, Swift, Android)', winner: 'B' },
      { feature: 'Free Tier Value', productAValue: 'Generous Template Access', productBValue: 'Unlimited Collaborators & 3 Projects', winner: 'Tie' }
    ],
    bestForProductA: 'Quick social media banners, posters, YouTube thumbnails, and PDF presentation slides.',
    bestForProductB: 'Professional website design, mobile app interface design systems, and responsive web component prototypes.',
    lastUpdated: '2026-10-05'
  },
  {
    slug: 'chatgpt-vs-claude',
    productASlug: 'chatgpt',
    productBSlug: 'claude-ai',
    title: 'ChatGPT vs Claude: Complete AI Assistant Benchmark 2026',
    metaDescription: 'Compare ChatGPT vs Claude 3.5 Sonnet across coding accuracy, writing quality, context window, pricing, and custom tools.',
    verdict: 'ChatGPT is ideal for web-connected search, custom GPT marketplaces, and versatile daily queries. Claude 3.5 Sonnet leads in technical software engineering, precise document analysis, and live interactive coding artifacts.',
    comparisonMatrix: [
      { feature: 'Coding & Refactoring Accuracy', productAValue: 'High (GPT-4o & o1)', productBValue: 'Exceptional (Claude 3.5 Sonnet)', winner: 'B' },
      { feature: 'Interactive Code Preview', productAValue: 'Canvas Editor', productBValue: 'Live Artifacts Window (React/HTML/SVG)', winner: 'B' },
      { feature: 'Real-Time Web Search', productAValue: 'Native Bing Integration & Live Citations', productBValue: 'Limited / Third-party extensions', winner: 'A' },
      { feature: 'Document Context Limit', productAValue: '128,000 Tokens', productBValue: '200,000 Tokens', winner: 'B' },
      { feature: 'Subscription Pricing', productAValue: '$20/month', productBValue: '$20/month', winner: 'Tie' }
    ],
    bestForProductA: 'General web search, voice conversations, custom GPT creation, and daily productivity tasks.',
    bestForProductB: 'Full-stack web application development, deep refactoring, and analyzing multi-page PDF documents.',
    lastUpdated: '2026-10-06'
  }
];

export function getComparisonBySlug(slug: string): ComparisonPage | undefined {
  return COMPARISON_PAGES.find((c) => c.slug === slug);
}
