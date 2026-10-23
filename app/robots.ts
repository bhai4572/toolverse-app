import { MetadataRoute } from 'next';

const UTILITY_AND_PRIVATE_DISALLOW: string[] = [];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolverse.baby';

  return {
    rules: [
      {
        userAgent: ['Googlebot', 'Googlebot-Image', 'Googlebot-News', 'Googlebot-Video', 'Google-InspectionTool'],
        allow: '/',
        disallow: UTILITY_AND_PRIVATE_DISALLOW,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: UTILITY_AND_PRIVATE_DISALLOW,
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: UTILITY_AND_PRIVATE_DISALLOW,
      },
      {
        userAgent: ['ChatGPT-User', 'OAI-SearchBot', 'PerplexityBot', 'Claude-Web', 'anthropic-ai'],
        allow: '/',
      },
      {
        userAgent: ['GPTBot', 'CCBot', 'Bytespider', 'Applebot-Extended', 'Google-Extended'],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
