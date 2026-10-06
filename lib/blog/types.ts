export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category:
    | 'Career & Jobs'
    | 'Image & PDF Tools'
    | 'Developers & SEO'
    | 'Finance & Calculators'
    | 'Writing & Students'
    | 'Creator & Social';
  author: string;
  publishDate: string;
  readTimeMinutes: number;
  featuredImage: string;
  keywords: string[];
  relatedToolSlug?: string;
  /** True for generated per-tool how-to guides (not hand-written pillar posts). */
  isToolGuide?: boolean;
  contentMarkdown: string;
  faqs: { question: string; answer: string }[];
}

export const BLOG_HUB_CATEGORIES = [
  'All',
  'Career & Jobs',
  'Image & PDF Tools',
  'Developers & SEO',
  'Finance & Calculators',
  'Writing & Students',
  'Creator & Social',
] as const;
