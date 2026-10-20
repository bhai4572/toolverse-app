import { MetadataRoute } from 'next';

/** Keep in sync with public/robots.txt + lib/seo/indexability.ts utility / private surfaces. */
const UTILITY_AND_PRIVATE_DISALLOW = [
  '/scratch/',
  '/workspace',
  '/workspace/',
  '/seo-dashboard',
  '/seo-dashboard/',
  '/dashboard',
  '/dashboard/',
  '/admin',
  '/admin/',
  '/business/dashboard',
  '/business/dashboard/',
  '/badges',
  '/claim',
  '/submit',
  '/submit-startup',
  '/guest-posts/create-pitch',
  '/api/',
];

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
