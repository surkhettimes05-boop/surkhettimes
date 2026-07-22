import { MetadataRoute } from 'next';
import { client } from '@/sanity/client';
import { articleSlugsQuery } from '@/sanity/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://surkhettimes.vercel.app'));

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/category/news`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/politics`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/sports`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/business`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category/agriculture`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/obituaries`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/gov-notices`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ];

  // Dynamic routes
  try {
    const slugs = await client.fetch(articleSlugsQuery);
    
    if (slugs && slugs.length > 0) {
      const articleRoutes = slugs.map((item: any) => ({
        url: `${baseUrl}/article/${item.slug}`,
        lastModified: new Date(item._updatedAt || new Date()), // Fetch the _updatedAt from Sanity for exact precision
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }));
      routes.push(...articleRoutes);
    }
  } catch (error) {
    console.warn("Could not fetch Sanity slugs for sitemap generation.");
  }

  return routes;
}
