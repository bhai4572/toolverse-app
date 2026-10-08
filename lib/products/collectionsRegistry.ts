import { Collection } from './types';

export const COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    slug: 'best-free-ai-tools-2026',
    title: 'Top Free AI Tools & Assistants for Daily Productivity',
    description: 'A hand-curated list of the most powerful free AI generators, LLM assistants, writing tools, and vector databases.',
    authorName: 'ToolVerse Editorial',
    authorSlug: 'toolverse-editorial',
    categorySlug: 'ai-tools',
    items: [
      { type: 'product', slug: 'chatgpt', note: 'Essential conversational assistant for text, web search, and data analysis.' },
      { type: 'product', slug: 'claude-ai', note: 'Superior AI model for TypeScript coding, long documents, and artifacts.' },
      { type: 'toolverse_tool', slug: 'word-counter', note: 'Count words and check reading time before pasting into LLM prompts.' },
      { type: 'toolverse_tool', slug: 'meta-tag-generator', note: 'Generate SEO titles and SERP previews with AI assistance.' }
    ],
    upvotes: 185,
    saves: 340,
    isFeatured: true,
    lastUpdated: '2026-10-06'
  },
  {
    id: 'col-2',
    slug: 'essential-web-developer-suite',
    title: 'Essential Web Developer Tools & Cloud Infrastructure',
    description: 'Everything frontend, backend, and full-stack developers need to build, test, host, and monitor web apps.',
    authorName: 'David Chen',
    authorSlug: 'david-chen',
    categorySlug: 'developer-tools',
    items: [
      { type: 'product', slug: 'supabase', note: 'Postgres database with instant APIs, Auth, and pgvector.' },
      { type: 'product', slug: 'figma', note: 'UI design and Dev Mode code inspection.' },
      { type: 'toolverse_tool', slug: 'json-formatter', note: 'Format, beautify, and validate complex JSON payloads.' },
      { type: 'toolverse_tool', slug: 'uuid-generator', note: 'Bulk generate UUID v4 tokens for database primary keys.' },
      { type: 'toolverse_tool', slug: 'hash-generator', note: 'Compute SHA-256 and SHA-512 hashes inline.' }
    ],
    upvotes: 210,
    saves: 490,
    isFeatured: true,
    lastUpdated: '2026-10-05'
  },
  {
    id: 'col-3',
    slug: 'best-privacy-first-image-tools',
    title: 'Best Privacy-First Image & Graphics Utilities',
    description: 'Tools for compressing, resizing, converting, and editing images locally in your browser memory with 0 server uploads.',
    authorName: 'ToolVerse Editorial',
    authorSlug: 'toolverse-editorial',
    categorySlug: 'design-graphics',
    items: [
      { type: 'toolverse_tool', slug: 'image-compressor', note: 'Compress JPG/PNG files with live quality slider.' },
      { type: 'toolverse_tool', slug: 'social-media-image-resizer', note: 'Resize images for Instagram, YouTube, TikTok, and LinkedIn.' },
      { type: 'toolverse_tool', slug: 'jpg-to-png', note: 'Convert JPG to transparent PNG locally.' },
      { type: 'product', slug: 'canva', note: 'Full visual design suite for banners and presentations.' }
    ],
    upvotes: 140,
    saves: 280,
    isFeatured: true,
    lastUpdated: '2026-10-04'
  }
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
