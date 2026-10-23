import { getToolBySlug, getToolsByCategory, CATEGORIES } from '@/lib/tools/registry';
import { getBlogPostBySlug } from '@/lib/blog/posts';
import { getToolPageContent } from '@/lib/seo/toolPageContent';
import { getCategoryPageContent } from '@/lib/seo/categoryPageContent';
import { getJobPageContent, buildJobPostingJsonLd } from '@/lib/seo/jobPageContent';
import { getProductBySlug, PRODUCTS } from '@/lib/products/registry';
import { getAlternativeBySlug } from '@/lib/products/alternativesRegistry';
import { getComparisonBySlug } from '@/lib/products/comparisonsRegistry';
import { getQuestionBySlug, QUESTIONS } from '@/lib/products/questionsRegistry';
import { getCollectionBySlug, COLLECTIONS } from '@/lib/products/collectionsRegistry';
import { evaluateProductPageQuality, getRobotsDirective } from '@/lib/products/seoQualityEngine';
import { getStudyDestination } from '@/lib/study/destinations';
import { CARS_DISCLAIMER, CARS_FAQS } from '@/lib/cars/data';
import {
  ROBOTS_INDEX,
  ROBOTS_NOINDEX,
  howToSlugShouldNoindex,
  pathShouldNoindex,
} from '@/lib/seo/indexability';

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>[];
  /** Defaults to index,follow when omitted */
  robots?: string;
}

/** Always use the live production domain for canonicals/schema (not preview hosts). */
export const SITE_URL = 'https://toolverse.baby';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${SITE_URL}/#logo`;

export function getSiteUrl(): string {
  return SITE_URL;
}

/** Standard brand/entity node for ToolVerse */
export function buildOrganizationNode(): Record<string, unknown> {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'ToolVerse',
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      '@id': LOGO_ID,
      url: `${SITE_URL}/favicon.svg`,
      contentUrl: `${SITE_URL}/favicon.svg`,
      caption: 'ToolVerse Logo',
      inLanguage: 'en-US',
    },
    image: { '@id': LOGO_ID },
    description:
      'Privacy-first free online tools for PDFs, images, calculators, writing, developers, and job search. Most tools process data locally in your browser memory.',
    email: 'support@toolverse.baby',
    foundingDate: '2025',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'support@toolverse.baby',
        url: `${SITE_URL}/legal/contact`,
        availableLanguage: ['English'],
      },
    ],
  };
}

/** Root WebSite node with official search action pointing to real search query parameter */
export function buildWebSiteNode(): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: 'ToolVerse',
    description:
      'Free privacy-first online tools for PDFs, images, calculators, writing, developers, and job search.',
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          // Real search UI lives on /tools (also mirrored on homepage ?q=)
          urlTemplate: `${SITE_URL}/tools?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    ],
  };
}

/** BreadcrumbList node matching visible breadcrumb navigation */
export function buildBreadcrumbNode(
  canonicalUrl: string,
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** WebPage / ItemPage / CollectionPage / AboutPage / ContactPage node */
export function buildWebPageNode(params: {
  canonicalUrl: string;
  name: string;
  description: string;
  type?: string;
  hasBreadcrumbs?: boolean;
  mainEntityId?: string;
}): Record<string, unknown> {
  const node: Record<string, unknown> = {
    '@type': params.type || 'WebPage',
    '@id': `${params.canonicalUrl}#webpage`,
    url: params.canonicalUrl,
    name: params.name,
    description: params.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
  };

  if (params.hasBreadcrumbs) {
    node.breadcrumb = { '@id': `${params.canonicalUrl}#breadcrumb` };
  }

  if (params.mainEntityId) {
    node.mainEntity = { '@id': params.mainEntityId };
  }

  return node;
}

/** Maps ToolVerse internal category slug to Schema.org standard applicationCategory */
export function mapCategoryToApplicationCategory(categorySlug: string): string {
  switch (categorySlug) {
    case 'pdf-document-tools':
    case 'file-archive-utilities':
      return 'UtilitiesApplication';
    case 'image-design-tools':
    case 'social-image-presets':
      return 'DesignApplication';
    case 'developer-cybersecurity-tools':
      return 'DeveloperApplication';
    case 'seo-url-tools':
      return 'UtilitiesApplication';
    case 'calculators-converters':
      return 'UtilitiesApplication';
    case 'business-finance-tools':
    case 'country-regional-tools':
    case 'career-jobs-employment-engine':
      return 'BusinessApplication';
    case 'text-writing-student-tools':
    case 'writing-grammar-academic-integrity-tools':
      return 'EducationalApplication';
    case 'creator-social-tools':
      return 'SocialNetworkingApplication';
    default:
      return 'UtilitiesApplication';
  }
}

/** Wraps a list of connected Schema.org graph nodes into a unified JSON-LD graph envelope. */
export function wrapInGraph(nodes: (Record<string, unknown> | null | undefined)[]): Record<string, unknown>[] {
  const validNodes = nodes.filter((n): n is Record<string, unknown> => Boolean(n));
  return [
    {
      '@context': 'https://schema.org',
      '@graph': validNodes,
    },
  ];
}

export function getMetadataForPath(pathname: string): PageMetadata {
  const meta = buildMetadataForPath(pathname);
  if (pathShouldNoindex(pathname)) return { ...meta, robots: ROBOTS_NOINDEX };
  if (meta.robots) return meta;
  return { ...meta, robots: ROBOTS_INDEX };
}

function buildMetadataForPath(pathname: string): PageMetadata {
  const baseUrl = SITE_URL;
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  const parts = cleanPath.split('/').filter(Boolean);

  // Dedicated 404 shell (also used by App when route is unknown)
  if (cleanPath === '/404') {
    return {
      title: 'Page Not Found — ToolVerse',
      description:
        'That page is missing. Browse popular free ToolVerse tools, categories, or search from the homepage.',
      canonicalUrl: `${baseUrl}/404`,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      robots: ROBOTS_INDEX,
      jsonLd: wrapInGraph([
        buildOrganizationNode(),
        buildWebSiteNode(),
        buildWebPageNode({
          canonicalUrl: `${baseUrl}/404`,
          name: 'Page Not Found — ToolVerse',
          description: 'That page is missing on ToolVerse.',
          type: 'WebPage',
        }),
      ]),
    };
  }

  // 1. Homepage (/)
  if (parts.length === 0) {
    const canonicalUrl = `${baseUrl}/`;
    const title = 'ToolVerse — 100+ Free Online Tools for Everyday Work | Privacy-First';
    const description =
      'Free privacy-first online tools for PDFs, images, calculators, writing, developers, and job search. Most tools run locally in your browser — no sign-up required.';

    const pageFaqs = [
      {
        question: 'Are ToolVerse tools free?',
        answer: 'Yes. Core utilities are free to use in your browser without creating an account for basic workflows.',
      },
      {
        question: 'Do you upload my PDFs or photos?',
        answer: 'Client-side tools process files in your browser memory. Your documents are not uploaded to ToolVerse servers for those tools.',
      },
      {
        question: 'Where should I start?',
        answer: 'Use site search, pick a category, or open popular tools like target-size image compression, PDF merge, or the guides blog.',
      },
    ];

    const graph = [
      buildOrganizationNode(),
      buildWebSiteNode(),
      buildWebPageNode({
        canonicalUrl,
        name: title,
        description,
        type: 'WebPage',
      }),
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: pageFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ];

    return {
      title,
      description,
      keywords: [
        'free online tools',
        'pdf tools',
        'image compressor',
        'word counter',
        'zakat calculator',
        'privacy first tools',
        'toolverse',
      ],
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  // --- Business Directory Hub & Business Profiles (/business, /business/[slug], /b/[businessId], /business-qr) ---
  if (parts[0] === 'b' && parts[1]) {
    const canonicalUrl = `${baseUrl}/b/${parts[1]}`;
    const title = `Toolverse Business QR Resolver — ${parts[1]}`;
    const description = `Permanent Toolverse Business Identity QR Resolver for business ID ${parts[1]}. Resolves to official verified public profile.`;

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Businesses', url: `${baseUrl}/business` },
      { name: parts[1], url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: title,
      description,
      type: 'WebPage',
      hasBreadcrumbs: true,
    });

    const graph = [buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs];

    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  if (parts[0] === 'business-qr') {
    const canonicalUrl = `${baseUrl}/business-qr`;
    const title = 'Toolverse Digital QR Identity Generator — Print Your Business QR';
    const description = 'Generate high-resolution printable Toolverse QR identities for your business. Connect offline customers directly to your verified online profile.';

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Business QR', url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: title,
      description,
      type: 'WebPage',
      hasBreadcrumbs: true,
    });

    const graph = [buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs];

    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  if (parts[0] === 'business') {
    if (parts[1] === 'register') {
      const canonicalUrl = `${baseUrl}/business/register`;
      const title = 'List & Register Your Business — Toolverse Business Identity';
      const description = 'Create a permanent Toolverse Business ID, get verified, and generate custom QR badges for physical locations.';

      const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
        { name: 'Home', url: `${baseUrl}/` },
        { name: 'Register Business', url: canonicalUrl },
      ]);

      const pageNode = buildWebPageNode({
        canonicalUrl,
        name: title,
        description,
        type: 'WebPage',
        hasBreadcrumbs: true,
      });

      const graph = [buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs];

      return {
        title,
        description,
        canonicalUrl,
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: wrapInGraph(graph),
      };
    }

    if (parts[1]) {
      const canonicalUrl = `${baseUrl}/business/${parts[1]}`;
      const nameFormatted = parts[1]
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      const title = `${nameFormatted} — Toolverse Verified Business Profile & Reviews`;
      const description = `Discover ${nameFormatted} on Toolverse. View ratings, customer reviews, verified credentials, contact details, services, and physical address.`;

      const businessSchema: Record<string, unknown> = {
        '@type': 'LocalBusiness',
        '@id': `${canonicalUrl}#business`,
        name: nameFormatted,
        url: canonicalUrl,
        description,
        image: DEFAULT_OG_IMAGE,
        publisher: { '@id': ORGANIZATION_ID },
      };

      const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
        { name: 'Home', url: `${baseUrl}/` },
        { name: 'Businesses', url: `${baseUrl}/business` },
        { name: nameFormatted, url: canonicalUrl },
      ]);

      const pageNode = buildWebPageNode({
        canonicalUrl,
        name: title,
        description,
        type: 'ItemPage',
        hasBreadcrumbs: true,
        mainEntityId: `${canonicalUrl}#business`,
      });

      const graph = [
        buildOrganizationNode(),
        buildWebSiteNode(),
        pageNode,
        breadcrumbs,
        businessSchema,
      ];

      return {
        title,
        description,
        canonicalUrl,
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: wrapInGraph(graph),
      };
    }

    // Business Directory Index (/business)
    const canonicalUrl = `${baseUrl}/business`;
    const title = 'Global Business Directory & Digital Identities — Toolverse';
    const description = 'Discover verified local businesses, SaaS companies, online services, customer reviews, and category rankings on Toolverse.';

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Businesses', url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: title,
      description,
      type: 'CollectionPage',
      hasBreadcrumbs: true,
    });

    const graph = [buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs];

    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  // --- How-To Hub & Guides (/how-to & /how-to/[slug]) ---
  if (parts[0] === 'how-to') {
    if (parts[1]) {
      const canonicalUrl = `${baseUrl}/how-to/${parts[1]}`;
      const titleFormatted = parts[1]
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      const title = `${titleFormatted} — Toolverse Guide`;
      const description = `Step-by-step guide on ${titleFormatted.toLowerCase()}. Learn best practices, verification workflows, and business growth tools on Toolverse.`;

      const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
        { name: 'Home', url: `${baseUrl}/` },
        { name: 'How-To Guides', url: `${baseUrl}/how-to` },
        { name: titleFormatted, url: canonicalUrl },
      ]);

      const pageNode = buildWebPageNode({
        canonicalUrl,
        name: title,
        description,
        type: 'ItemPage',
        hasBreadcrumbs: true,
      });

      const graph = [buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs];

      return {
        title,
        description,
        canonicalUrl,
        ogType: 'article',
        ogImage: DEFAULT_OG_IMAGE,
        robots: ROBOTS_INDEX,
        jsonLd: wrapInGraph(graph),
      };
    }

    const canonicalUrl = `${baseUrl}/how-to`;
    const title = 'Toolverse How-To Center & Business Guides';
    const description = 'Official tutorials on how to register your business, generate QR identities, print offline badges, get verified, and collect customer reviews.';

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'How-To Guides', url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: title,
      description,
      type: 'CollectionPage',
      hasBreadcrumbs: true,
    });

    const graph = [buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs];

    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  // --- Product Discovery Hub (/products & /products/[slug]) ---
  if (parts[0] === 'products') {
    if (parts[1]) {
      const product = getProductBySlug(parts[1]);
      if (product) {
        const canonicalUrl = `${baseUrl}/products/${product.slug}`;
        const pageTitle = `${product.name} — Features, Pricing, Reviews & Alternatives | ToolVerse`;
        const pageDesc = `${product.tagline}. Read genuine user reviews, pricing plans, features, and software alternatives on ToolVerse.`;

        const productId = `${canonicalUrl}#product`;
        const quality = evaluateProductPageQuality(product);

        const productSchema: Record<string, unknown> = {
          '@type': ['Product', 'SoftwareApplication'],
          '@id': productId,
          name: product.name,
          url: canonicalUrl,
          description: product.description,
          category: product.categoryName,
          image: product.logoUrl,
          applicationCategory: product.categoryName,
          operatingSystem: product.platforms.join(', '),
          offers: {
            '@type': 'Offer',
            price: product.pricingPlans[0]?.price.replace(/[^0-9.]/g, '') || '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
          publisher: { '@id': ORGANIZATION_ID },
        };

        const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
          { name: 'Home', url: `${baseUrl}/` },
          { name: 'Products', url: `${baseUrl}/products` },
          { name: product.name, url: canonicalUrl },
        ]);

        const pageNode = buildWebPageNode({
          canonicalUrl,
          name: pageTitle,
          description: pageDesc,
          type: 'ItemPage',
          hasBreadcrumbs: true,
          mainEntityId: productId,
        });

        const graph = [
          buildOrganizationNode(),
          buildWebSiteNode(),
          pageNode,
          breadcrumbs,
          productSchema,
        ];

        return {
          title: pageTitle,
          description: pageDesc,
          canonicalUrl,
          ogType: 'website',
          ogImage: product.logoUrl || DEFAULT_OG_IMAGE,
          robots: getRobotsDirective(quality.isIndexable),
          jsonLd: wrapInGraph(graph),
        };
      }
    }

    // Products Index (/products)
    const canonicalUrl = `${baseUrl}/products`;
    const title = 'Discover Software, AI Tools & SaaS Products — ToolVerse';
    const description = 'Explore verified software products, AI assistants, SaaS platforms, developer tools, user reviews, and alternatives.';

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Products', url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: title,
      description,
      type: 'CollectionPage',
      hasBreadcrumbs: true,
    });

    const graph = [buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs];

    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  // --- Alternatives Hub & Detail (/alternatives & /alternatives/[slug]) ---
  if (parts[0] === 'alternatives') {
    if (parts[1]) {
      const alt = getAlternativeBySlug(parts[1]);
      if (alt) {
        const canonicalUrl = `${baseUrl}/alternatives/${alt.slug}`;
        const title = alt.metaTitle;
        const description = alt.metaDescription;

        const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
          { name: 'Home', url: `${baseUrl}/` },
          { name: 'Alternatives', url: `${baseUrl}/alternatives` },
          { name: `Alternative to ${alt.targetProductName}`, url: canonicalUrl },
        ]);

        const pageNode = buildWebPageNode({
          canonicalUrl,
          name: title,
          description,
          type: 'CollectionPage',
          hasBreadcrumbs: true,
        });

        const graph: (Record<string, unknown> | null)[] = [
          buildOrganizationNode(),
          buildWebSiteNode(),
          pageNode,
          breadcrumbs,
        ];

        if (alt.faqs.length) {
          graph.push({
            '@type': 'FAQPage',
            '@id': `${canonicalUrl}#faq`,
            mainEntity: alt.faqs.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          });
        }

        return {
          title,
          description,
          canonicalUrl,
          ogType: 'website',
          ogImage: DEFAULT_OG_IMAGE,
          jsonLd: wrapInGraph(graph),
        };
      }
    }

    const canonicalUrl = `${baseUrl}/alternatives`;
    const title = 'Software & AI Alternatives Engine — ToolVerse';
    const description = 'Discover top free and paid alternatives to popular design suites, AI models, workspaces, and developer software.';

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Alternatives', url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: title,
      description,
      type: 'CollectionPage',
      hasBreadcrumbs: true,
    });

    const graph = [buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs];

    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  // --- Side-by-Side Comparisons (/compare/[slug]) ---
  if (parts[0] === 'compare' && parts[1]) {
    const comp = getComparisonBySlug(parts[1]);
    const canonicalUrl = `${baseUrl}/compare/${parts[1]}`;
    const title = comp ? comp.title : `Product Comparison — ToolVerse`;
    const description = comp ? comp.metaDescription : `Compare features, pricing, and pros & cons side-by-side.`;

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Compare', url: `${baseUrl}/products` },
      { name: comp?.title || parts[1], url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: title,
      description,
      type: 'ItemPage',
      hasBreadcrumbs: true,
    });

    const graph = [buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs];

    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  // --- Questions Hub & Detail (/questions & /questions/[slug]) ---
  if (parts[0] === 'questions') {
    if (parts[1]) {
      const q = getQuestionBySlug(parts[1]);
      if (q) {
        const canonicalUrl = `${baseUrl}/questions/${q.slug}`;
        const title = `${q.title} — ToolVerse Q&A`;
        const description = `${q.content.slice(0, 150)}... Read community answers, software recommendations, and developer tips.`;

        const qSchema: Record<string, unknown> = {
          '@type': 'Question',
          '@id': `${canonicalUrl}#question`,
          name: q.title,
          text: q.content,
          dateCreated: q.date,
          answerCount: q.answers.length,
          upvoteCount: q.upvotes,
          author: { '@type': 'Person', name: q.authorName },
          suggestedAnswer: q.answers.map((a) => ({
            '@type': 'Answer',
            text: a.content,
            dateCreated: a.date,
            upvoteCount: a.upvotes,
            author: { '@type': 'Person', name: a.authorName },
          })),
        };

        const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
          { name: 'Home', url: `${baseUrl}/` },
          { name: 'Questions', url: `${baseUrl}/questions` },
          { name: q.title, url: canonicalUrl },
        ]);

        const pageNode = buildWebPageNode({
          canonicalUrl,
          name: title,
          description,
          type: 'ItemPage',
          hasBreadcrumbs: true,
        });

        const graph = [buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs, qSchema];

        return {
          title,
          description,
          canonicalUrl,
          ogType: 'website',
          ogImage: DEFAULT_OG_IMAGE,
          jsonLd: wrapInGraph(graph),
        };
      }
    }

    const canonicalUrl = `${baseUrl}/questions`;
    const title = 'Ask Software & AI Questions — ToolVerse Community Q&A';
    const description = 'Ask questions about online tools, AI assistants, developer utilities, PDF workflows, and software recommendations.';

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Questions', url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: title,
      description,
      type: 'CollectionPage',
      hasBreadcrumbs: true,
    });

    const graph = [buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs];

    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  // --- Collections (/collections & /collections/[slug]) ---
  if (parts[0] === 'collections') {
    if (parts[1]) {
      const col = getCollectionBySlug(parts[1]);
      if (col) {
        const canonicalUrl = `${baseUrl}/collections/${col.slug}`;
        const title = `${col.title} — ToolVerse Collections`;
        const description = `${col.description} Curated list of software products and free online tools.`;

        const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
          { name: 'Home', url: `${baseUrl}/` },
          { name: 'Collections', url: `${baseUrl}/collections` },
          { name: col.title, url: canonicalUrl },
        ]);

        const pageNode = buildWebPageNode({
          canonicalUrl,
          name: title,
          description,
          type: 'CollectionPage',
          hasBreadcrumbs: true,
        });

        const graph = [buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs];

        return {
          title,
          description,
          canonicalUrl,
          ogType: 'website',
          ogImage: DEFAULT_OG_IMAGE,
          jsonLd: wrapInGraph(graph),
        };
      }
    }

    const canonicalUrl = `${baseUrl}/collections`;
    const title = 'Curated Tool & Software Collections — ToolVerse';
    const description = 'Explore curated lists of AI assistants, developer stacks, design suites, and free online utilities.';

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Collections', url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: title,
      description,
      type: 'CollectionPage',
      hasBreadcrumbs: true,
    });

    const graph = [buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs];

    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  // --- Product Submission Portal (/submit) ---
  if (parts[0] === 'submit') {
    const canonicalUrl = `${baseUrl}/submit`;
    const title = 'List Your Product on ToolVerse — Product Discovery & Launch';
    const description = 'Submit your SaaS, AI tool, developer application, or website to ToolVerse for free product discovery and community reviews.';

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Submit Product', url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: title,
      description,
      type: 'WebPage',
      hasBreadcrumbs: true,
    });

    const graph = [buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs];

    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      robots: ROBOTS_INDEX,
      jsonLd: wrapInGraph(graph),
    };
  }

  // --- Badges Generator (/badges) ---
  if (parts[0] === 'badges') {
    const canonicalUrl = `${baseUrl}/badges`;
    const title = 'Embeddable ToolVerse Badges — Showcase Your Product Profile';
    const description = 'Generate lightweight SVG/HTML embed badges ("Featured on ToolVerse", "Listed on ToolVerse") for your website or README.';

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Badges', url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: title,
      description,
      type: 'WebPage',
      hasBreadcrumbs: true,
    });

    const graph = [buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs];

    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      robots: ROBOTS_INDEX,
      jsonLd: wrapInGraph(graph),
    };
  }

  // --- Founder Claim (/claim) ---
  if (parts[0] === 'claim') {
    const canonicalUrl = `${baseUrl}/claim`;
    const title = 'Claim Your Product Profile — ToolVerse Founder Verification';
    const description = 'Verify company ownership of your product profile to update information, respond to reviews, and receive verified badges.';

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Claim Profile', url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: title,
      description,
      type: 'WebPage',
      hasBreadcrumbs: true,
    });

    const graph = [buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs];

    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      robots: ROBOTS_INDEX,
      jsonLd: wrapInGraph(graph),
    };
  }

  // 2. Tool Pages (/tools/[slug])
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

      const webAppId = `${canonicalUrl}#software`;

      const webAppSchema: Record<string, unknown> = {
        '@type': ['WebApplication', 'SoftwareApplication'],
        '@id': webAppId,
        name: tool.canonicalName,
        url: canonicalUrl,
        description: pageSeo?.answerFirst || tool.shortDescription,
        applicationCategory: mapCategoryToApplicationCategory(tool.categorySlug),
        operatingSystem: 'All (Web Browser)',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        publisher: { '@id': ORGANIZATION_ID },
        author: { '@id': ORGANIZATION_ID },
        inLanguage: 'en-US',
      };

      if (tool.instructions && tool.instructions.length > 0) {
        webAppSchema.featureList = tool.instructions;
      }

      const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
        { name: 'Home', url: `${baseUrl}/` },
        { name: tool.category, url: `${baseUrl}/category/${tool.categorySlug}` },
        { name: tool.canonicalName, url: canonicalUrl },
      ]);

      const pageNode = buildWebPageNode({
        canonicalUrl,
        name: pageTitle,
        description: pageDesc,
        type: 'ItemPage',
        hasBreadcrumbs: true,
        mainEntityId: webAppId,
      });

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

      const faqNode = {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: pageFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      };

      const howToNode =
        tool.instructions && tool.instructions.length >= 2
          ? {
              '@type': 'HowTo',
              '@id': `${canonicalUrl}#howto`,
              name: `How to Use ${tool.canonicalName}`,
              description: pageSeo?.answerFirst || tool.shortDescription,
              step: tool.instructions.map((inst, index) => ({
                '@type': 'HowToStep',
                position: index + 1,
                name: `Step ${index + 1}`,
                text: inst,
              })),
            }
          : null;

      const graph = [
        buildOrganizationNode(),
        buildWebSiteNode(),
        pageNode,
        breadcrumbs,
        webAppSchema,
        faqNode,
        howToNode,
      ];

      return {
        title: pageTitle,
        description: pageDesc,
        keywords: tool.keywords,
        canonicalUrl,
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: wrapInGraph(graph),
      };
    }

    // Unknown tool slug — do not index soft-404 tool shells
    return {
      title: 'Tool Not Found — ToolVerse',
      description: 'That tool is missing or was renamed. Browse the ToolVerse tools hub for free PDF, image, and calculator utilities.',
      canonicalUrl: `${baseUrl}/tools/${parts[1]}`,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      robots: ROBOTS_INDEX,
    };
  }

  // 3. Category Pages (/category/[slug])
  if (parts[0] === 'category' && parts[1]) {
    const category = CATEGORIES.find((c) => c.slug === parts[1]);
    if (category) {
      const canonicalUrl = `${baseUrl}/category/${category.slug}`;
      const catSeo = getCategoryPageContent(category.slug);
      const catTools = getToolsByCategory(category.slug);
      const pageTitle = catSeo?.seoTitle ?? `${category.name} — Free Online Tools | ToolVerse`;
      const pageDesc =
        catSeo?.seoDescription ??
        `${category.description} Free, fast, privacy-first browser utilities.`;

      const itemListId = `${canonicalUrl}#itemlist`;

      const itemListNode: Record<string, unknown> = {
        '@type': 'ItemList',
        '@id': itemListId,
        name: `${category.name} Tools Collection`,
        description: catSeo?.intro || category.description,
        numberOfItems: catTools.length,
        itemListElement: catTools.map((t, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: t.canonicalName,
          url: `${baseUrl}/tools/${t.slug}`,
          description: t.shortDescription,
        })),
      };

      const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
        { name: 'Home', url: `${baseUrl}/` },
        { name: category.name, url: canonicalUrl },
      ]);

      const pageNode = buildWebPageNode({
        canonicalUrl,
        name: pageTitle,
        description: pageDesc,
        type: 'CollectionPage',
        hasBreadcrumbs: true,
        mainEntityId: itemListId,
      });

      const graph = [
        buildOrganizationNode(),
        buildWebSiteNode(),
        pageNode,
        breadcrumbs,
        itemListNode,
      ];

      return {
        title: pageTitle,
        description: pageDesc,
        keywords: [category.name.toLowerCase(), 'free online tools', 'toolverse'],
        canonicalUrl,
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: wrapInGraph(graph),
      };
    }
  }

  // 4. Blog Posts & Blog Index (/blog, /blog/topics, /blog/[slug])
  if (parts[0] === 'blog') {
    if (parts[1] === 'topics') {
      const canonicalUrl = `${baseUrl}/blog/topics`;
      const title = 'US Interest Topics → Free Tools — ToolVerse Blog';
      const description =
        'Evergreen ToolVerse guides mapped to US interest themes — gaming launches, concerts, deal events, paychecks, and creator sizes — each linked to free PDF, QR, and calculator tools.';
      const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
        { name: 'Home', url: `${baseUrl}/` },
        { name: 'Guides & Blog', url: `${baseUrl}/blog` },
        { name: 'Topics', url: canonicalUrl },
      ]);
      const pageNode = buildWebPageNode({
        canonicalUrl,
        name: title,
        description,
        type: 'CollectionPage',
        hasBreadcrumbs: true,
      });
      return {
        title,
        description,
        keywords: [
          'toolverse blog topics',
          'gta 6 prep tools',
          'concert ticket pdf tips',
          'us paycheck calculator guide',
        ],
        canonicalUrl,
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: wrapInGraph([buildOrganizationNode(), buildWebSiteNode(), pageNode, breadcrumbs]),
      };
    }

    if (parts[1]) {
      const post = getBlogPostBySlug(parts[1]);
      if (post) {
        const canonicalUrl = `${baseUrl}/blog/${post.slug}`;
        const ogImage = post.featuredImage || DEFAULT_OG_IMAGE;
        const pageTitle = `${post.title} — ToolVerse`;
        const articleId = `${canonicalUrl}#article`;

        const isEditorialTeam =
          post.author.toLowerCase().includes('editorial') ||
          post.author.toLowerCase().includes('team') ||
          post.author.toLowerCase().includes('toolverse');

        const authorNode: Record<string, unknown> = isEditorialTeam
          ? {
              '@type': 'Organization',
              '@id': ORGANIZATION_ID,
              name: post.author,
              url: `${baseUrl}/legal/about`,
            }
          : {
              '@type': 'Person',
              name: post.author,
              worksFor: { '@id': ORGANIZATION_ID },
            };

        const blogPostingNode: Record<string, unknown> = {
          '@type': 'BlogPosting',
          '@id': articleId,
          headline: post.title,
          description: post.description,
          image: [ogImage],
          datePublished: post.publishDate,
          dateModified: post.publishDate,
          mainEntityOfPage: { '@id': `${canonicalUrl}#webpage` },
          isPartOf: { '@id': `${canonicalUrl}#webpage` },
          publisher: { '@id': ORGANIZATION_ID },
          author: authorNode,
          inLanguage: 'en-US',
        };

        const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
          { name: 'Home', url: `${baseUrl}/` },
          { name: 'Guides & Blog', url: `${baseUrl}/blog` },
          { name: post.title, url: canonicalUrl },
        ]);

        const pageNode = buildWebPageNode({
          canonicalUrl,
          name: pageTitle,
          description: post.description,
          type: 'ItemPage',
          hasBreadcrumbs: true,
          mainEntityId: articleId,
        });

        const faqNode =
          post.faqs && post.faqs.length > 0
            ? {
                '@type': 'FAQPage',
                '@id': `${canonicalUrl}#faq`,
                mainEntity: post.faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer,
                  },
                })),
              }
            : null;

        const graph = [
          buildOrganizationNode(),
          buildWebSiteNode(),
          pageNode,
          breadcrumbs,
          blogPostingNode,
          faqNode,
        ];

        return {
          title: pageTitle,
          description: post.description,
          keywords: post.keywords,
          canonicalUrl,
          ogType: 'article',
          ogImage,
          robots: ROBOTS_INDEX,
          jsonLd: wrapInGraph(graph),
        };
      }
    }

    // Blog Index (/blog)
    const canonicalUrl = `${baseUrl}/blog`;
    const title = 'ToolVerse Blog — Practical Guides for Tools, Careers & Privacy';
    const description =
      'Practical guides on image compression, PDF privacy, barcodes, remote jobs, and Pakistan salary tax — with links to free ToolVerse utilities.';

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Guides & Blog', url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: title,
      description,
      type: 'CollectionPage',
      hasBreadcrumbs: true,
    });

    const graph = [
      buildOrganizationNode(),
      buildWebSiteNode(),
      pageNode,
      breadcrumbs,
    ];

    return {
      title,
      description,
      keywords: ['toolverse blog', 'career guides', 'remote jobs guide', 'pdf tutorial'],
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  // 4b. Live News Hub (/news)
  if (parts[0] === 'news') {
    const canonicalUrl = `${baseUrl}/news`;
    const title = 'Live News Headlines (US, UK, Tech, Finance, Gaming) — ToolVerse';
    const description =
      'Auto-updating news headlines from public RSS feeds. Browse title, source, date, and a short snippet — then read the full story on the original publisher site.';

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'News', url: canonicalUrl },
    ]);

    const pageFaqs = [
      {
        question: 'Does ToolVerse republish full news articles?',
        answer:
          'No. We show headlines, source, date, and short RSS snippets only, and link out to the original publisher for the full article.',
      },
      {
        question: 'How often do headlines refresh?',
        answer:
          'Feeds are fetched on the edge and cached for about 15 minutes. Use the Refresh button on /news for the latest cached snapshot.',
      },
    ];

    const graph: (Record<string, unknown> | null)[] = [
      buildOrganizationNode(),
      buildWebSiteNode(),
      buildWebPageNode({
        canonicalUrl,
        name: title,
        description,
        type: 'CollectionPage',
        hasBreadcrumbs: true,
      }),
      breadcrumbs,
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: pageFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ];

    return {
      title,
      description,
      keywords: [
        'live news',
        'tech news',
        'uk news',
        'us news',
        'finance headlines',
        'gaming news',
        'toolverse news',
      ],
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  // 5. Job Hub Pages (/jobs/[slug])
  if (parts[0] === 'jobs' && parts[1]) {
    const job = getJobPageContent(parts[1]);
    const canonicalUrl = `${baseUrl}/jobs/${parts[1]}`;
    const formattedTitle = parts[1]
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const pageTitle = job?.seoTitle ?? `${formattedTitle} (2026) — ToolVerse Job Finder`;
    const pageDesc =
      job?.seoDescription ??
      `Browse ${formattedTitle.toLowerCase()} listings. Filter remote, government, and tech roles and apply on the original posting sites.`;

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Job Finder', url: `${baseUrl}/tools/global-job-finder` },
      { name: job?.title ?? formattedTitle, url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: pageTitle,
      description: pageDesc,
      type: 'CollectionPage',
      hasBreadcrumbs: true,
    });

    const graph: (Record<string, unknown> | null)[] = [
      buildOrganizationNode(),
      buildWebSiteNode(),
      pageNode,
      breadcrumbs,
    ];

    if (job?.faqs?.length) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: job.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      });
    }

    if (job?.featuredPostings?.length) {
      job.featuredPostings.forEach((posting, idx) => {
        const postingSchema = buildJobPostingJsonLd(posting, canonicalUrl);
        delete (postingSchema as Record<string, unknown>)['@context'];
        (postingSchema as Record<string, unknown>)['@id'] = `${canonicalUrl}#job-${idx + 1}`;
        graph.push(postingSchema);
      });
    }

    return {
      title: pageTitle,
      description: pageDesc,
      keywords: [parts[1].replace(/-/g, ' '), 'toolverse jobs', 'remote jobs'],
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  // 6. Legal & Policy Pages (/legal/[slug])
  if (parts[0] === 'legal' && parts[1]) {
    const slug = parts[1];
    const formattedSlug = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    const pageTitle = `${formattedSlug} — ToolVerse`;
    const canonicalUrl = `${baseUrl}/legal/${slug}`;
    const pageDesc = `Official ToolVerse ${slug.replace(/-/g, ' ')}. Learn more about our privacy-first policies, security, and editorial standards.`;

    let pageType = 'WebPage';
    let mainEntityId: string | undefined = undefined;

    if (slug === 'about') {
      pageType = 'AboutPage';
      mainEntityId = ORGANIZATION_ID;
    } else if (slug === 'contact') {
      pageType = 'ContactPage';
      mainEntityId = ORGANIZATION_ID;
    }

    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: formattedSlug, url: canonicalUrl },
    ]);

    const pageNode = buildWebPageNode({
      canonicalUrl,
      name: pageTitle,
      description: pageDesc,
      type: pageType,
      hasBreadcrumbs: true,
      mainEntityId,
    });

    const graph = [
      buildOrganizationNode(),
      buildWebSiteNode(),
      pageNode,
      breadcrumbs,
    ];

    return {
      title: pageTitle,
      description: pageDesc,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph(graph),
    };
  }

  // SEO Dashboard workspace (/workspace, /workspace/*, /seo-dashboard)
  if (parts[0] === 'workspace' || parts[0] === 'seo-dashboard') {
    const canonicalUrl = `${baseUrl}/workspace`;
    const title = 'SEO Dashboard — Free Semrush-Style Workspace | ToolVerse';
    const description =
      'Free SEO dashboard with nested left nav: Site Audit, On-Page, Site Performance, Keyword Magic, Position Tracking, link extractor, GA4 import, and PDF reports. Your data only — no fake market graphs.';
    return {
      title,
      description,
      keywords: ['seo dashboard', 'free semrush alternative', 'site audit', 'keyword tools', 'toolverse seo'],
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      robots: ROBOTS_INDEX,
      jsonLd: wrapInGraph([
        buildOrganizationNode(),
        buildWebSiteNode(),
        buildWebPageNode({
          canonicalUrl,
          name: title,
          description,
          type: 'WebPage',
          hasBreadcrumbs: true,
        }),
        buildBreadcrumbNode(canonicalUrl, [
          { name: 'Home', url: `${baseUrl}/` },
          { name: 'SEO Dashboard', url: canonicalUrl },
        ]),
      ]),
    };
  }

  // Product hubs (SEO Suite, Tools, Study, Immigration, Pricing, regions, passport)
  const hubMeta: Record<
    string,
    { title: string; description: string; keywords: string[]; crumb: string }
  > = {
    seo: {
      title: 'ToolVerse SEO Suite — Free On-Page & Technical SEO Tools',
      description:
        'SEO software hub: open the free Semrush-style SEO Dashboard for audits, keywords, and reports on your own data — plus classic free SEO utilities.',
      keywords: ['seo suite', 'free seo tools', 'on page seo', 'semrush alternative', 'toolverse seo'],
      crumb: 'SEO Suite',
    },
    tools: {
      title: 'All Tools Hub — Browse ToolVerse by Category',
      description:
        'Find the right free tool fast: PDF, image, calculator, writing, SEO, and developer utilities organized by category. Most file tools run in your browser.',
      keywords: ['online tools hub', 'free pdf tools', 'image tools', 'toolverse'],
      crumb: 'Tools',
    },
    pricing: {
      title: 'ToolVerse Pricing — Free SEO Dashboard (Pro Paused)',
      description: 'Everything free for now: SEO Dashboard, audits, keyword tools, report exports. Pro crawl/backlink index later.',
      keywords: ['toolverse pricing', 'free seo tools'],
      crumb: 'Pricing',
    },
    study: {
      title: 'Study Abroad — USA, UK, Canada, Australia, NZ & Europe | ToolVerse',
      description:
        'Study-abroad hub: how admissions, documents, fee bands, and student visas work for USA, UK, Canada, Australia, New Zealand, and Europe — plus free application tools. Official portals linked; no fake rankings DB.',
      keywords: [
        'study abroad',
        'study in usa',
        'study in uk',
        'study in canada',
        'study in australia',
        'student visa documents',
      ],
      crumb: 'Study Abroad',
    },
    immigration: {
      title: 'Immigration & Work Visas — ToolVerse',
      description: 'Immigration hub for work visas, embassies, and jobs abroad — structured from ToolVerse travel intelligence.',
      keywords: ['immigration', 'work visa', 'embassy directory'],
      crumb: 'Immigration',
    },
    us: {
      title: 'US Tools Hub — Paycheck, Sales Tax, Tip, PDF | ToolVerse',
      description:
        'US-focused free tools: paycheck estimator, sales tax calculator, tip split, compress PDF, Wi‑Fi QR, and 2×2 passport photos. Browser-side privacy.',
      keywords: ['us paycheck calculator', 'sales tax calculator', 'tip calculator', 'compress pdf'],
      crumb: 'United States',
    },
    uk: {
      title: 'UK Tools Hub — Take-Home Pay, VAT, PDF | ToolVerse',
      description:
        'UK-focused free tools: take-home pay estimator, VAT calculator, compress PDF, Wi‑Fi QR, and 35×45 mm passport photos.',
      keywords: ['uk take home pay', 'vat calculator', 'compress pdf', 'uk passport photo'],
      crumb: 'United Kingdom',
    },
    ca: {
      title: 'Canada Tools Hub — Paycheque, GST/HST, PDF | ToolVerse',
      description:
        'Canada-focused free tools: paycheque estimator, GST/HST calculator, PDF merge/compress, and 50×70 mm passport photos.',
      keywords: ['canada paycheck calculator', 'gst calculator', 'hst calculator', 'canada passport photo'],
      crumb: 'Canada',
    },
    au: {
      title: 'Australia Tools Hub — PAYG, GST, PDF | ToolVerse',
      description:
        'Australia-focused free tools: PAYG take-home estimator, 10% GST calculator, PDF compress/merge, and passport photo sizes.',
      keywords: ['australia pay calculator', 'gst calculator australia', 'compress pdf', 'passport photo australia'],
      crumb: 'Australia',
    },
    'passport-photos': {
      title: 'Passport Photo Size Hub (US, UK, CA, AU, EU) | ToolVerse',
      description:
        'Passport and visa photo size presets for US 2×2, UK/AU/EU 35×45 mm, and Canada 50×70 mm — open the free Passport Photo Maker.',
      keywords: ['passport photo size', '2x2 photo', '35x45 passport photo', 'canada passport photo'],
      crumb: 'Passport photos',
    },
  };

  if (parts.length === 1 && hubMeta[parts[0]]) {
    const h = hubMeta[parts[0]];
    const canonicalUrl = `${baseUrl}/${parts[0]}`;
    return {
      title: h.title,
      description: h.description,
      keywords: h.keywords,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph([
        buildOrganizationNode(),
        buildWebSiteNode(),
        buildWebPageNode({
          canonicalUrl,
          name: h.title,
          description: h.description,
          type: 'CollectionPage',
          hasBreadcrumbs: true,
        }),
        buildBreadcrumbNode(canonicalUrl, [
          { name: 'Home', url: `${baseUrl}/` },
          { name: h.crumb, url: canonicalUrl },
        ]),
      ]),
    };
  }

  // Study destination guides: /study/{slug}
  if (parts[0] === 'study' && parts[1] && parts.length === 2) {
    const dest = getStudyDestination(parts[1]);
    if (dest) {
      const canonicalUrl = `${baseUrl}/study/${dest.slug}`;
      const faqId = `${canonicalUrl}#faq`;
      return {
        title: dest.title,
        description: dest.description,
        keywords: dest.keywords,
        canonicalUrl,
        ogType: 'article',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: wrapInGraph([
          buildOrganizationNode(),
          buildWebSiteNode(),
          buildWebPageNode({
            canonicalUrl,
            name: dest.title,
            description: dest.description,
            type: 'WebPage',
            hasBreadcrumbs: true,
            mainEntityId: faqId,
          }),
          buildBreadcrumbNode(canonicalUrl, [
            { name: 'Home', url: `${baseUrl}/` },
            { name: 'Study Abroad', url: `${baseUrl}/study` },
            { name: dest.name, url: canonicalUrl },
          ]),
          {
            '@type': 'FAQPage',
            '@id': faqId,
            mainEntity: dest.faqs.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
              },
            })),
          },
        ]),
      };
    }
  }

  // Human-readable HTML sitemap
  if ((parts[0] === 'sitemap' || parts[0] === 'site-map') && parts.length === 1) {
    const canonicalUrl = `${baseUrl}/sitemap`;
    const title = 'Sitemap — Browse All ToolVerse Pages | ToolVerse';
    const description =
      'HTML sitemap for ToolVerse: tools by category, blog guides, study destinations, cars, jobs, legal pages, and regional hubs. Search and jump to any public page.';
    return {
      title,
      description,
      keywords: ['toolverse sitemap', 'free online tools directory', 'site map'],
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph([
        buildOrganizationNode(),
        buildWebSiteNode(),
        buildWebPageNode({
          canonicalUrl,
          name: title,
          description,
          type: 'CollectionPage',
          hasBreadcrumbs: true,
        }),
        buildBreadcrumbNode(canonicalUrl, [
          { name: 'Home', url: `${baseUrl}/` },
          { name: 'Sitemap', url: canonicalUrl },
        ]),
      ]),
    };
  }

  // Cars hub with FAQ schema
  if (parts[0] === 'cars' && parts.length === 1) {
    const canonicalUrl = `${baseUrl}/cars`;
    const faqId = `${canonicalUrl}#faq`;
    const title = 'Cars Hub — Loan, Fuel, Insurance Ranges & Checklists | ToolVerse';
    const description =
      'Car cost planning hub: loan & fuel calculators, US/UK/CA insurance and registration bands, EV vs gas ranges, buying docs, maintenance basics, and official NHTSA/GOV.UK links. No fake inventory.';
    return {
      title,
      description,
      keywords: [
        'car loan calculator',
        'fuel cost calculator',
        'car insurance cost estimate',
        'used car checklist',
        'ev vs gas cost',
      ],
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph([
        buildOrganizationNode(),
        buildWebSiteNode(),
        buildWebPageNode({
          canonicalUrl,
          name: title,
          description: `${description} ${CARS_DISCLAIMER}`,
          type: 'CollectionPage',
          hasBreadcrumbs: true,
          mainEntityId: faqId,
        }),
        buildBreadcrumbNode(canonicalUrl, [
          { name: 'Home', url: `${baseUrl}/` },
          { name: 'Cars', url: canonicalUrl },
        ]),
        {
          '@type': 'FAQPage',
          '@id': faqId,
          mainEntity: CARS_FAQS.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        },
      ]),
    };
  }

  // Travel intelligence routes (/travel, /travel/route, /travel/:corridor)
  if (parts[0] === 'travel') {
    const travelSub = parts[1];
    if (parts.length === 3) {
      const origin = parts[1].toUpperCase();
      const dest = parts[2].toUpperCase();
      const canonicalUrl = `${baseUrl}/travel/${parts[1]}/${parts[2]}`;
      const title = `Travel & Visa Guide: ${origin} to ${dest} — ToolVerse Travel Intelligence`;
      const description = `Complete visa rules, embassy guidelines, travel corridor requirements, flight routes, and overseas jobs from ${origin} to ${dest}.`;
      const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
        { name: 'Home', url: `${baseUrl}/` },
        { name: 'Travel', url: `${baseUrl}/travel` },
        { name: `${origin} → ${dest}`, url: canonicalUrl },
      ]);
      return {
        title,
        description,
        canonicalUrl,
        ogType: 'article',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: wrapInGraph([
          buildOrganizationNode(),
          buildWebSiteNode(),
          buildWebPageNode({ canonicalUrl, name: title, description, type: 'ItemPage', hasBreadcrumbs: true }),
          breadcrumbs,
        ]),
      };
    }

    const travelHubMeta: Record<string, { title: string; description: string; crumb: string }> = {
      passport: {
        title: 'Global Passport Power & Visa-Free Index 2026 — ToolVerse',
        description: 'Explore global passport mobility rankings, visa-free access countries, and consular guidelines.',
        crumb: 'Passport Index',
      },
      embassies: {
        title: 'Global Embassy & Consulate Directory — ToolVerse',
        description: 'Find official embassy contacts, consular jurisdiction, visa application requirements, and addresses worldwide.',
        crumb: 'Embassies',
      },
      destinations: {
        title: 'Top Travel & Expat Work Destinations 2026 — ToolVerse',
        description: 'Explore leading destinations for tourism, remote work, study abroad, and international immigration.',
        crumb: 'Destinations',
      },
      jobs: {
        title: 'Jobs Abroad & Overseas Visa Sponsorship — ToolVerse',
        description: 'Browse international employment opportunities and visa sponsorship pathways across Gulf, Europe, and North America.',
        crumb: 'Overseas Jobs',
      },
      planner: {
        title: 'Smart Travel Budget & Trip Planner — ToolVerse',
        description: 'Calculate travel expenses, daily allowances, flight estimations, and foreign exchange budgets.',
        crumb: 'Travel Planner',
      },
      route: {
        title: 'Travel Route & Visa Checker — ToolVerse',
        description: 'Check real-time visa requirements, transit rules, and consular requirements between any two countries.',
        crumb: 'Route Checker',
      },
    };

    if (travelSub && travelHubMeta[travelSub]) {
      const h = travelHubMeta[travelSub];
      const canonicalUrl = `${baseUrl}/travel/${travelSub}`;
      const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
        { name: 'Home', url: `${baseUrl}/` },
        { name: 'Travel', url: `${baseUrl}/travel` },
        { name: h.crumb, url: canonicalUrl },
      ]);
      return {
        title: h.title,
        description: h.description,
        canonicalUrl,
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: wrapInGraph([
          buildOrganizationNode(),
          buildWebSiteNode(),
          buildWebPageNode({ canonicalUrl, name: h.title, description: h.description, type: 'CollectionPage', hasBreadcrumbs: true }),
          breadcrumbs,
        ]),
      };
    }

    const canonicalUrl = `${baseUrl}/travel`;
    const title = 'Global Travel & Visa Intelligence Platform — ToolVerse';
    const description = 'Check visa requirements, embassy directories, passport power index, overseas jobs, and international travel routes in one privacy-first platform.';
    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Travel', url: canonicalUrl },
    ]);
    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph([
        buildOrganizationNode(),
        buildWebSiteNode(),
        buildWebPageNode({ canonicalUrl, name: title, description, type: 'CollectionPage', hasBreadcrumbs: true }),
        breadcrumbs,
      ]),
    };
  }

  // Startups & Launch Routes (/startups, /startups/:slug, /submit-startup)
  if (parts[0] === 'startups' || parts[0] === 'submit-startup') {
    if (parts[0] === 'submit-startup') {
      const canonicalUrl = `${baseUrl}/submit-startup`;
      const title = 'Launch & Submit Your Startup — ToolVerse Startup Hub';
      const description = 'Submit your tech startup, AI app, or SaaS product to ToolVerse for free community discovery and backlink visibility.';
      const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
        { name: 'Home', url: `${baseUrl}/` },
        { name: 'Startups', url: `${baseUrl}/startups` },
        { name: 'Submit Startup', url: canonicalUrl },
      ]);
      return {
        title,
        description,
        canonicalUrl,
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: wrapInGraph([
          buildOrganizationNode(),
          buildWebSiteNode(),
          buildWebPageNode({ canonicalUrl, name: title, description, type: 'WebPage', hasBreadcrumbs: true }),
          breadcrumbs,
        ]),
      };
    }

    if (parts[1]) {
      const slugFormatted = parts[1].split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const canonicalUrl = `${baseUrl}/startups/${parts[1]}`;
      const title = `${slugFormatted} — Startup Profile, Reviews & Launch | ToolVerse`;
      const description = `Discover ${slugFormatted} on ToolVerse. Explore product features, founder story, tech stack, and user reviews.`;
      const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
        { name: 'Home', url: `${baseUrl}/` },
        { name: 'Startups', url: `${baseUrl}/startups` },
        { name: slugFormatted, url: canonicalUrl },
      ]);
      return {
        title,
        description,
        canonicalUrl,
        ogType: 'article',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: wrapInGraph([
          buildOrganizationNode(),
          buildWebSiteNode(),
          buildWebPageNode({ canonicalUrl, name: title, description, type: 'ItemPage', hasBreadcrumbs: true }),
          breadcrumbs,
        ]),
      };
    }

    const canonicalUrl = `${baseUrl}/startups`;
    const title = 'Startup Launch & Discovery Directory — ToolVerse';
    const description = 'Discover trending tech startups, AI tools, SaaS apps, and innovative digital platforms launched on ToolVerse.';
    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Startups', url: canonicalUrl },
    ]);
    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph([
        buildOrganizationNode(),
        buildWebSiteNode(),
        buildWebPageNode({ canonicalUrl, name: title, description, type: 'CollectionPage', hasBreadcrumbs: true }),
        breadcrumbs,
      ]),
    };
  }

  // Guest Posting & Publisher Marketplace (/guest-posts, /become-a-publisher, /publishers/:slug)
  if (parts[0] === 'guest-posts' || parts[0] === 'become-a-publisher' || parts[0] === 'publishers') {
    if (parts[0] === 'become-a-publisher') {
      const canonicalUrl = `${baseUrl}/become-a-publisher`;
      const title = 'Become a Verified Publisher — ToolVerse Marketplace';
      const description = 'Monetize your authority blog or publication by accepting high-quality sponsored articles and editorial pitches.';
      const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
        { name: 'Home', url: `${baseUrl}/` },
        { name: 'Guest Posts', url: `${baseUrl}/guest-posts` },
        { name: 'Become a Publisher', url: canonicalUrl },
      ]);
      return {
        title,
        description,
        canonicalUrl,
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: wrapInGraph([
          buildOrganizationNode(),
          buildWebSiteNode(),
          buildWebPageNode({ canonicalUrl, name: title, description, type: 'WebPage', hasBreadcrumbs: true }),
          breadcrumbs,
        ]),
      };
    }

    if (parts[0] === 'publishers' && parts[1]) {
      const pubFormatted = parts[1].split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const canonicalUrl = `${baseUrl}/publishers/${parts[1]}`;
      const title = `${pubFormatted} — Verified Media Publisher | ToolVerse`;
      const description = `View domain metrics, editorial guidelines, and article pitch requirements for ${pubFormatted} on ToolVerse.`;
      const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
        { name: 'Home', url: `${baseUrl}/` },
        { name: 'Publishers', url: `${baseUrl}/guest-posts` },
        { name: pubFormatted, url: canonicalUrl },
      ]);
      return {
        title,
        description,
        canonicalUrl,
        ogType: 'article',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: wrapInGraph([
          buildOrganizationNode(),
          buildWebSiteNode(),
          buildWebPageNode({ canonicalUrl, name: title, description, type: 'ItemPage', hasBreadcrumbs: true }),
          breadcrumbs,
        ]),
      };
    }

    if (parts[1] === 'create-pitch') {
      const canonicalUrl = `${baseUrl}/guest-posts/create-pitch`;
      const title = 'Pitch a Guest Post Article — ToolVerse Publisher Network';
      const description = 'Submit article pitches and guest posts to high-authority technology, finance, and SEO publishers.';
      const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
        { name: 'Home', url: `${baseUrl}/` },
        { name: 'Guest Posts', url: `${baseUrl}/guest-posts` },
        { name: 'Create Pitch', url: canonicalUrl },
      ]);
      return {
        title,
        description,
        canonicalUrl,
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        jsonLd: wrapInGraph([
          buildOrganizationNode(),
          buildWebSiteNode(),
          buildWebPageNode({ canonicalUrl, name: title, description, type: 'WebPage', hasBreadcrumbs: true }),
          breadcrumbs,
        ]),
      };
    }

    const canonicalUrl = `${baseUrl}/guest-posts`;
    const title = 'Guest Posting & Authority Publisher Marketplace — ToolVerse';
    const description = 'Connect with verified publishers, pitch thought leadership articles, and build high-quality contextual backlinks safely.';
    const breadcrumbs = buildBreadcrumbNode(canonicalUrl, [
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Guest Posts', url: canonicalUrl },
    ]);
    return {
      title,
      description,
      canonicalUrl,
      ogType: 'website',
      ogImage: DEFAULT_OG_IMAGE,
      jsonLd: wrapInGraph([
        buildOrganizationNode(),
        buildWebSiteNode(),
        buildWebPageNode({ canonicalUrl, name: title, description, type: 'CollectionPage', hasBreadcrumbs: true }),
        breadcrumbs,
      ]),
    };
  }

  // 7. Fallback / Default (Strictly Self-Referencing Canonical)
  const fallbackUrl = cleanPath === '/' ? `${baseUrl}/` : `${baseUrl}${cleanPath}`;
  const fallbackTitleFormatted =
    parts.length > 0
      ? parts[parts.length - 1]
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ') + ' — ToolVerse'
      : 'ToolVerse — Free Online Tools';
  const fallbackDesc = `Explore ${fallbackTitleFormatted} on ToolVerse. Free, fast, privacy-first online tools for everyday work.`;

  const fallbackGraph = [
    buildOrganizationNode(),
    buildWebSiteNode(),
    buildWebPageNode({
      canonicalUrl: fallbackUrl,
      name: fallbackTitleFormatted,
      description: fallbackDesc,
      type: 'WebPage',
    }),
  ];

  return {
    title: fallbackTitleFormatted,
    description: fallbackDesc,
    canonicalUrl: fallbackUrl,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    robots: ROBOTS_INDEX,
    jsonLd: wrapInGraph(fallbackGraph),
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
    meta.robots || ROBOTS_INDEX
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
