import { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 'q-1',
    slug: 'best-free-alternative-to-photoshop-online',
    title: 'What is the best free alternative to Photoshop for quick photo editing online?',
    content: 'I need to edit images, crop, adjust color filters, convert formats, and compress photo file sizes without paying for an expensive Adobe Creative Cloud subscription. What free online tools or software do you recommend?',
    authorId: 'u-alex',
    authorName: 'Alex Morgan',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop',
    categorySlug: 'design-graphics',
    categoryName: 'Design & Graphics',
    date: '2026-09-28',
    upvotes: 42,
    views: 1250,
    answersCount: 2,
    tags: ['photoshop', 'image-editing', 'free-tools', 'canva', 'design'],
    relatedProductSlugs: ['canva', 'figma'],
    relatedToolverseToolSlugs: ['image-compressor', 'social-media-image-resizer', 'jpg-to-png', 'passport-photo-maker'],
    answers: [
      {
        id: 'ans-101',
        questionId: 'q-1',
        authorId: 'u-dev-david',
        authorName: 'David Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop',
        authorTitle: 'Senior UI/UX Engineer',
        content: 'For complete in-browser photo compression, format conversion (JPG to PNG/WebP), and passport photo creation without uploading your images to remote servers, ToolVerse provides free privacy-first client-side image tools. If you need template design and social media graphics, Canva is a great free web choice. For layer-based vector editing, photopea or Figma work excellent.',
        date: '2026-09-29',
        upvotes: 28,
        isAccepted: true,
        relatedProductSlugs: ['canva', 'figma'],
        relatedToolverseToolSlugs: ['image-compressor', 'jpg-to-png']
      },
      {
        id: 'ans-102',
        questionId: 'q-1',
        authorId: 'u-sarah-m',
        authorName: 'Sarah Miller',
        authorTitle: 'Digital Content Creator',
        content: 'Canva free tier is unmatched for banners and thumbnails. If you just need to reduce image file size for web upload, use ToolVerse Image Compressor—it runs 100% in your browser memory so your photos remain 100% private.',
        date: '2026-09-30',
        upvotes: 14,
        isAccepted: false,
        relatedProductSlugs: ['canva'],
        relatedToolverseToolSlugs: ['image-compressor']
      }
    ]
  },
  {
    id: 'q-2',
    slug: 'which-ai-tool-is-best-for-writing-code',
    title: 'Which AI tool is best for writing clean React and TypeScript code in 2026?',
    content: 'I am building a web app and want to choose between ChatGPT Plus, Claude 3.5 Sonnet, and GitHub Copilot. Which LLM generates the most accurate TypeScript code with modern hooks and fewest hallucinations?',
    authorId: 'u-marcus',
    authorName: 'Marcus Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop',
    categorySlug: 'ai-tools',
    categoryName: 'AI & Machine Learning',
    date: '2026-10-02',
    upvotes: 67,
    views: 2400,
    answersCount: 1,
    tags: ['ai', 'coding', 'typescript', 'react', 'claude', 'chatgpt'],
    relatedProductSlugs: ['claude-ai', 'chatgpt', 'supabase'],
    relatedToolverseToolSlugs: ['json-formatter', 'meta-tag-generator', 'uuid-generator'],
    answers: [
      {
        id: 'ans-201',
        questionId: 'q-2',
        authorId: 'u-elena',
        authorName: 'Elena Rostova',
        authorTitle: 'Staff Frontend Architect',
        content: 'Claude 3.5 Sonnet currently leads in React and TypeScript generation. Its Artifacts UI renders live previews of components immediately, and it avoids importing outdated library methods. ChatGPT with GPT-4o is also strong, especially for backend architecture and SQL queries with Supabase.',
        date: '2026-10-03',
        upvotes: 39,
        isAccepted: true,
        relatedProductSlugs: ['claude-ai', 'chatgpt', 'supabase'],
        relatedToolverseToolSlugs: ['json-formatter']
      }
    ]
  },
  {
    id: 'q-3',
    slug: 'how-to-compress-pdf-files-without-losing-quality',
    title: 'How can I compress large PDF documents without losing text clarity?',
    content: 'I have a 45MB PDF report with scan pages and high-res vector graphics that needs to be submitted via email (max 10MB limit). What is the safest way to compress it without uploading confidential files online?',
    authorId: 'u-samuel',
    authorName: 'Samuel Oak',
    categorySlug: 'productivity',
    categoryName: 'Productivity & Workspaces',
    date: '2026-10-04',
    upvotes: 31,
    views: 980,
    answersCount: 1,
    tags: ['pdf', 'compression', 'privacy', 'document-tools'],
    relatedProductSlugs: [],
    relatedToolverseToolSlugs: ['pdf-merge', 'pdf-split', 'jpg-to-pdf'],
    answers: [
      {
        id: 'ans-301',
        questionId: 'q-3',
        authorId: 'u-dev-david',
        authorName: 'David Chen',
        authorTitle: 'Senior UI/UX Engineer',
        content: 'Use client-side PDF processors like ToolVerse PDF tools. You can split unnecessary pages or convert heavy inline scan pages to compressed images locally in your browser memory before re-exporting to PDF.',
        date: '2026-10-04',
        upvotes: 19,
        isAccepted: true,
        relatedProductSlugs: [],
        relatedToolverseToolSlugs: ['pdf-split', 'pdf-merge']
      }
    ]
  }
];

export function getQuestionBySlug(slug: string): Question | undefined {
  return QUESTIONS.find((q) => q.slug === slug);
}
