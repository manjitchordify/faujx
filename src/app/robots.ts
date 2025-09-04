import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/engineer/mcq',
          '/engineer/feedback',
          '/engineer/coding/coding-intro',
        ],
      },
    ],
    sitemap: 'https://faujx.com/sitemap.xml',
    host: 'https://faujx.com',
  };
}
