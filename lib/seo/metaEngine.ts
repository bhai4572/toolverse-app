import { getToolBySlug, CATEGORIES } from '@/lib/tools/registry';
import { getBlogPostBySlug } from '@/lib/blog/posts';
import { getToolPageContent } from '@/lib/seo/toolPageContent';
import { getCategoryPageContent } from '@/lib/seo/categoryPageContent';

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>[];
}

/** Always use the live production domain for canonicals/schema (not preview hosts). */
export const SITE_URL = 'https://toolverse.baby';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export function getSiteUrl(): string {
  return SITE_URL;
}

export function getMetadataForPath(pathname: string): PageMetadata {
  const baseUrl = SITE_URL;
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  const parts = cleanPath.split('/').filter(Boolean);

  if (parts.length === 0) {
    return {
      title: 'ToolVerse — 100+ Free Online Tools for Everyday Work | Privacy-First',
      description:
        'Free privacy-first online tools for PDFs, images, calculators, writing, developers, and job search. Most tools run locally in your browser — no sign-up required.',
      keywords: [
        'free online tools',
        'pdf tools',
        'image compressor',
        'word counter',
        'zakat calculator',
        'privacy first tools',
        'toolverse',
      ],
      canonicalUrl: `${baseUrl}/`,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'ToolVerse',
          url: `${baseUrl}/`,
          description: 'Free privacy-first online tools for everyday work',
          inLanguage: 'en',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'ToolVerse',
          url: `${baseUrl}/`,
          logo: `${baseUrl}/favicon.svg`,
          description:
            'Privacy-first free online tools for PDFs, images, calculators, writing, developers, and job search.',
          email: 'support@toolverse.baby',
          foundingDate: '2025',
        },
      ],
    };
  }

  if (parts[0] === 'tools' && parts[1]) {
    const tool = getToolBySlug(parts[1]);
    if (tool) {
      const canonicalUrl = `${baseUrl}/tools/${tool.slug}`;
      const pageSeo = getToolPageContent(tool.slug);
      const pageTitle =
        pageSeo?.seoTitle ?? `${tool.canonicalName} — Free Online Tool | ToolVerse`;
      const pageDesc =
        pageSeo?.seoDescription ??
        `${tool.shortDescription} Free, fast, and private — processed locally in your browser.`;

      const softwareAppSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.canonicalName,
        operatingSystem: 'Any (Web Browser)',
        applicationCategory: 'UtilitiesApplication',
        inLanguage: 'en',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: pageSeo?.answerFirst || tool.shortDescription,
        url: canonicalUrl,
      };

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${baseUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: tool.category,
            item: `${baseUrl}/category/${tool.categorySlug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: tool.canonicalName,
            item: canonicalUrl,
          },
        ],
      };

      // FAQ schema mirrors visible FAQ block on the tool page
      const pageFaqs =
        pageSeo?.faqs ??
        ([
          {
            question: `Is ${tool.canonicalName} completely free to use?`,
            answer: `Yes, ${tool.canonicalName} is free with unlimited usage. No hidden fees or sign-up required.`,
          },
          {
            question: `Is my data safe and private when using ${tool.canonicalName}?`,
            answer: `${tool.privacyMessage} Client-side tools process data in your browser where possible.`,
          },
          {
            question: `Does ${tool.canonicalName} work on mobile phones and tablets?`,
            answer: `Yes. ${tool.canonicalName} is responsive and works on phones, tablets, and desktops.`,
          },
        ] as const);

      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: pageFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      };

      return {
        title: pageTitle,
        description: pageDesc,
        keywords: tool.keywords,
        canonicalUrl,
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: [softwareAppSchema, breadcrumbSchema, faqSchema],
      };
    }
  }

  if (parts[0] === 'category' && parts[1]) {
    const category = CATEGORIES.find((c) => c.slug === parts[1]);
    if (category) {
      const canonicalUrl = `${baseUrl}/category/${category.slug}`;
      const catSeo = getCategoryPageContent(category.slug);
      return {
        title: catSeo?.seoTitle ?? `${category.name} — Free Online Tools | ToolVerse`,
        description:
          catSeo?.seoDescription ??
          `${category.description} Free, fast, privacy-first browser utilities.`,
        keywords: [category.name.toLowerCase(), 'free online tools', 'toolverse'],
        canonicalUrl,
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: category.name,
            description: catSeo?.intro || category.description,
            url: canonicalUrl,
            inLanguage: 'en',
            isPartOf: {
              '@type': 'WebSite',
              name: 'ToolVerse',
              url: `${baseUrl}/`,
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: `${baseUrl}/`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: category.name,
                item: canonicalUrl,
              },
            ],
          },
        ],
      };
    }
  }

  if (parts[0] === 'blog') {
    if (parts[1]) {
      const post = getBlogPostBySlug(parts[1]);
      if (post) {
        const canonicalUrl = `${baseUrl}/blog/${post.slug}`;
        const ogImage = post.featuredImage || DEFAULT_OG_IMAGE;
        const blogSchema = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          image: [ogImage],
          datePublished: post.publishDate,
          dateModified: post.publishDate,
          author: {
            '@type': 'Person',
            name: post.author,
          },
          publisher: {
            '@type': 'Organization',
            name: 'ToolVerse',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/favicon.svg`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl,
          },
        };

        const breadcrumbSchema = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${baseUrl}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Blog',
              item: `${baseUrl}/blog`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: post.title,
              item: canonicalUrl,
            },
          ],
        };

        return {
          title: `${post.title} — ToolVerse`,
          description: post.description,
          keywords: post.keywords,
          canonicalUrl,
          ogType: 'article',
          ogImage,
          jsonLd: [blogSchema, breadcrumbSchema],
        };
      }
    }

    return {
      title: 'ToolVerse Blog — Guides for Tools, Careers & Privacy',
      description:
        'Practical guides on image compression, PDF privacy, barcodes, remote jobs, and Pakistan salary tax — with links to free ToolVerse utilities.',
      keywords: ['toolverse blog', 'career guides', 'remote jobs guide', 'pdf tutorial'],
      canonicalUrl: `${baseUrl}/blog`,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
    };
  }

  if (parts[0] === 'jobs' && parts[1]) {
    const canonicalUrl = `${baseUrl}/jobs/${parts[1]}`;
    const formattedTitle = parts[1]
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      title: `${formattedTitle} (2026) — ToolVerse Job Finder`,
      description: `Browse ${formattedTitle.toLowerCase()} listings. Filter remote, government, and tech roles and apply on the original posting sites.`,
      keywords: [parts[1].replace(/-/g, ' '), 'toolverse jobs', 'remote jobs'],
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
    };
  }

  if (parts[0] === 'legal' && parts[1]) {
    const pageTitle = `${parts[1]
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')} — ToolVerse`;
    return {
      title: pageTitle,
      description: `Official ToolVerse ${parts[1].replace(/-/g, ' ')}.`,
      canonicalUrl: `${baseUrl}/legal/${parts[1]}`,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
    };
  }

  return {
    title: 'ToolVerse — Free Online Tools',
    description: 'Free, fast, privacy-first online tools for everyday work.',
    canonicalUrl: `${baseUrl}/`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  };
}

export function updateDOMMetadata(meta: PageMetadata) {
  if (typeof document === 'undefined') return;

  document.title = meta.title;

  const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(selector) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  const setLinkTag = (relVal: string, hrefVal: string) => {
    let el = document.querySelector(`link[rel="${relVal}"]:not([hreflang])`) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', relVal);
      document.head.appendChild(el);
    }
    el.setAttribute('href', hrefVal);
  };

  setMetaTag(
    'meta[name="robots"]',
    'name',
    'robots',
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  );

  setLinkTag('canonical', meta.canonicalUrl);

  // Remove stale hreflang (single-language site — avoid Bing conflicts)
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());

  setMetaTag('meta[name="description"]', 'name', 'description', meta.description);
  if (meta.keywords?.length) {
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', meta.keywords.join(', '));
  }

  const ogImage = meta.ogImage || DEFAULT_OG_IMAGE;

  setMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', meta.canonicalUrl);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', meta.ogType || 'website');
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'ToolVerse');
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
  setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_US');

  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

  // Replace all JSON-LD so static index.html schema does not duplicate after SPA navigation
  document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => script.remove());

  if (meta.jsonLd) {
    meta.jsonLd.forEach((schemaData) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic-seo', 'true');
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    });
  }
}
