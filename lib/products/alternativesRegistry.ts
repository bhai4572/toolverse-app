import { AlternativePage } from './types';

export const ALTERNATIVE_PAGES: AlternativePage[] = [
  {
    slug: 'canva',
    targetProductName: 'Canva',
    targetProductCategory: 'Design & Graphics',
    targetProductDescription: 'Canva is a drag-and-drop online graphic design platform popular for social media graphics, presentations, and posters.',
    targetProductPricing: 'Free plan available; Canva Pro starts at $14.99/month.',
    targetProductWebsite: 'https://www.canva.com',
    targetProductLogo: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=128&h=128&fit=crop',
    metaTitle: 'Best Canva Alternatives in 2026 (Free & Paid Tools)',
    metaDescription: 'Discover the top free and paid Canva alternatives for graphic design, social media posts, vector editing, and presentations.',
    summary: 'Looking for the best Canva alternatives? Whether you need open-source graphic design software, advanced AI image generation, or professional vector editing, here are top-rated alternatives evaluated by real users.',
    bestFor: 'Users looking for specialized vector controls, open-source options, or cheaper team collaboration tools.',
    keySelectionCriteria: [
      'Ease of use and availability of pre-built templates',
      'Export file format support (SVG, PNG, PDF, WebP)',
      'Pricing model and free tier features',
      'AI graphic design capabilities and background removal'
    ],
    topAlternativeSlugs: ['figma', 'midjourney'],
    relatedToolverseToolSlugs: ['social-media-image-resizer', 'image-compressor', 'jpg-to-png', 'passport-photo-maker'],
    faqs: [
      {
        question: 'What is the best free alternative to Canva?',
        answer: 'Figma offers a powerful browser-based vector editor with a generous free tier. For quick image resizing and format conversion, free privacy-first online tools like ToolVerse provide instant processing.'
      },
      {
        question: 'Is Figma better than Canva for web design?',
        answer: 'Yes, Figma is specifically engineered for digital UI/UX design, interactive prototyping, and developer handoff, whereas Canva is optimized for marketing materials and social graphics.'
      }
    ],
    lastUpdated: '2026-10-05'
  },
  {
    slug: 'chatgpt',
    targetProductName: 'ChatGPT',
    targetProductCategory: 'AI & Machine Learning',
    targetProductDescription: 'ChatGPT is OpenAI’s conversational AI assistant used for writing, coding, math, and automated reasoning.',
    targetProductPricing: 'Free tier with GPT-4o mini; Plus subscription $20/month.',
    targetProductWebsite: 'https://chatgpt.com',
    targetProductLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop',
    metaTitle: 'Best ChatGPT Alternatives in 2026 (AI Assistants & LLMs)',
    metaDescription: 'Explore top ChatGPT alternatives for coding, writing, research, and data analysis. Compare Claude, Gemini, and open-source models.',
    summary: 'Explore the top ChatGPT alternatives for coding, complex document analysis, and conversational AI. Compare features, pricing, and context windows.',
    bestFor: 'Developers seeking higher coding accuracy, larger document context windows, or open-source privacy-first AI models.',
    keySelectionCriteria: [
      'Code generation accuracy and logic reasoning',
      'Context window size for processing long documents',
      'Multimodal capabilities (image, voice, document processing)',
      'Privacy controls and data retention policies'
    ],
    topAlternativeSlugs: ['claude-ai', 'supabase'],
    relatedToolverseToolSlugs: ['word-counter', 'lorem-ipsum-generator', 'json-formatter', 'meta-tag-generator'],
    faqs: [
      {
        question: 'Which AI tool is better than ChatGPT for writing code?',
        answer: 'Claude 3.5 Sonnet by Anthropic is widely recognized by developers as superior for code accuracy, refactoring complex codebases, and rendering live interactive code artifacts.'
      },
      {
        question: 'Are there privacy-first ChatGPT alternatives?',
        answer: 'Local LLMs (via Ollama or LM Studio) and privacy-focused AI wrappers allow you to run models entirely on your device without sending prompt data to third-party servers.'
      }
    ],
    lastUpdated: '2026-10-06'
  },
  {
    slug: 'notion',
    targetProductName: 'Notion',
    targetProductCategory: 'Productivity & Workspaces',
    targetProductDescription: 'Notion is a connected workspace combining docs, task databases, wikis, and project management.',
    targetProductPricing: 'Free individual plan; Plus plan starts at $10/month.',
    targetProductWebsite: 'https://www.notion.so',
    targetProductLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop',
    metaTitle: 'Best Notion Alternatives in 2026 (PKM & Team Workspaces)',
    metaDescription: 'Discover the top free and paid alternatives to Notion for notes, wikis, project management, and local Markdown documentation.',
    summary: 'Looking for a faster, offline-first, or simpler alternative to Notion? Here are top-rated note-taking apps, knowledge bases, and task managers.',
    bestFor: 'Users wanting offline Markdown support, faster page load speeds, or dedicated developer issue tracking.',
    keySelectionCriteria: [
      'Offline file storage and data ownership',
      'Relational database and task board flexibility',
      'Speed and page rendering performance',
      'Team permission controls and wiki publishing'
    ],
    topAlternativeSlugs: ['chatgpt', 'claude-ai'],
    relatedToolverseToolSlugs: ['word-counter', 'character-counter', 'text-case-converter', 'json-to-csv'],
    faqs: [
      {
        question: 'What is an open-source alternative to Notion?',
        answer: 'AppFlowy and Obsidian (for local Markdown storage) are popular choices for users who want privacy, offline availability, and zero vendor lock-in.'
      }
    ],
    lastUpdated: '2026-10-04'
  }
];

export function getAlternativeBySlug(slug: string): AlternativePage | undefined {
  return ALTERNATIVE_PAGES.find((a) => a.slug === slug);
}
