import { ToolDefinition, getToolBySlug, CATEGORIES, CategoryDefinition } from '@/lib/tools/registry';

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl: string;
  ogType?: string;
  jsonLd?: Record<string, any>[];
}

const DEFAULT_SITE_URL = 'https://toolverse.baby';

export function getSiteUrl(): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }
  return DEFAULT_SITE_URL;
}

export function getMetadataForPath(pathname: string): PageMetadata {
  const baseUrl = getSiteUrl();
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  const parts = cleanPath.split('/').filter(Boolean);

  // Home Page SEO
  if (parts.length === 0) {
    return {
      title: 'ToolVerse — 100+ Free Online Tools for Everyday Work | Privacy-First',
      description: '100+ Free, Fast, and Privacy-First Online Tools for PDFs, Images, Calculators, Developers, Writing, SEO, and Social Media. No sign-up required.',
      keywords: [
        'free online tools',
        'pdf tools',
        'image compressor',
        'word counter',
        'zakat calculator',
        'privacy first tools',
        'toolverse'
      ],
      canonicalUrl: `${baseUrl}/`,
      ogType: 'website',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'ToolVerse',
          url: `${baseUrl}/`,
          description: '100+ Free Online Tools for Everyday Work',
          inLanguage: 'en',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'ToolVerse',
          url: `${baseUrl}/`,
          logo: `${baseUrl}/favicon.svg`
        }
      ]
    };
  }

  // Tool Detail Page SEO
  if (parts[0] === 'tools' && parts[1]) {
    const tool = getToolBySlug(parts[1]);
    if (tool) {
      const canonicalUrl = `${baseUrl}/tools/${tool.slug}`;
      const pageTitle = `${tool.canonicalName} — Free Online Tool | ToolVerse`;
      const pageDesc = `${tool.shortDescription} 100% free, fast, and processed 100% locally in your browser memory.`;

      const softwareAppSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.canonicalName,
        operatingSystem: 'Any (Web Browser)',
        applicationCategory: tool.category,
        inLanguage: 'en',
        isAccessibleForFree: true,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '1540',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: tool.shortDescription,
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

      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `Is ${tool.canonicalName} completely free?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, ${tool.canonicalName} is 100% free with unlimited usage and no hidden fees or sign-up.`,
            },
          },
          {
            '@type': 'Question',
            name: `Is my data safe when using ${tool.canonicalName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${tool.privacyMessage} All processing runs locally inside your device browser.`,
            },
          },
        ],
      };

      return {
        title: pageTitle,
        description: pageDesc,
        keywords: tool.keywords,
        canonicalUrl,
        ogType: 'article',
        jsonLd: [softwareAppSchema, breadcrumbSchema, faqSchema]
      };
    }
  }

  // Category Page SEO
  if (parts[0] === 'category' && parts[1]) {
    const category = CATEGORIES.find(c => c.slug === parts[1]);
    if (category) {
      const canonicalUrl = `${baseUrl}/category/${category.slug}`;
      return {
        title: `${category.name} — Free Online Tools Suite | ToolVerse`,
        description: `${category.description} Free, fast, and privacy-first browser utilities.`,
        keywords: [category.name.toLowerCase(), category.slug, 'free web tools', 'toolverse'],
        canonicalUrl,
        ogType: 'website',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: category.name,
            description: category.description,
            url: canonicalUrl,
            inLanguage: 'en'
          }
        ]
      };
    }
  }

  // Legal / Information Pages SEO
  if (parts[0] === 'legal' && parts[1]) {
    const pageTitle = `${parts[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} — ToolVerse`;
    return {
      title: pageTitle,
      description: `Read our official ${parts[1]} and platform policies.`,
      canonicalUrl: `${baseUrl}/legal/${parts[1]}`,
      ogType: 'website'
    };
  }

  // Fallback
  return {
    title: 'ToolVerse — 100+ Free Online Tools for Everyday Work',
    description: '100+ Free, Fast, and Privacy-First Online Tools.',
    canonicalUrl: `${baseUrl}/`,
    ogType: 'website'
  };
}

export function updateDOMMetadata(meta: PageMetadata) {
  if (typeof document === 'undefined') return;

  // Title
  document.title = meta.title;

  // Helper to set or create meta tag
  const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Helper to set or create link tag
  const setLinkTag = (relVal: string, hreflangVal: string | null, hrefVal: string) => {
    const selector = hreflangVal 
      ? `link[rel="${relVal}"][hreflang="${hreflangVal}"]` 
      : `link[rel="${relVal}"]:not([hreflang])`;
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', relVal);
      if (hreflangVal) el.setAttribute('hreflang', hreflangVal);
      document.head.appendChild(el);
    }
    el.setAttribute('href', hrefVal);
  };

  // Robots Tag (INDEX, FOLLOW - NO NOINDEX!)
  setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  // Single Canonical Tag
  setLinkTag('canonical', null, meta.canonicalUrl);

  // Hreflang Tags
  setLinkTag('alternate', 'en', meta.canonicalUrl);
  setLinkTag('alternate', 'x-default', meta.canonicalUrl);

  // Description & Keywords
  setMetaTag('meta[name="description"]', 'name', 'description', meta.description);
  if (meta.keywords && meta.keywords.length > 0) {
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', meta.keywords.join(', '));
  }

  // Open Graph
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', meta.canonicalUrl);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', meta.ogType || 'website');
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'ToolVerse');

  // Twitter Cards
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description);

  // Update Dynamic JSON-LD Structured Data
  const existingScripts = document.querySelectorAll('script[data-dynamic-seo="true"]');
  existingScripts.forEach(script => script.remove());

  if (meta.jsonLd) {
    meta.jsonLd.forEach(schemaData => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic-seo', 'true');
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    });
  }
}
