import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://surkhettimes.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/'], // Disallow crawling of the Sanity studio path
    },
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/news-sitemap.xml`
    ],
  };
}
