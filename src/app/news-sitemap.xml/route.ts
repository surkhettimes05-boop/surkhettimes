import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';

// GROQ query to fetch articles from the last 48 hours, up to 1000 items
const newsArticlesQuery = `*[_type == "article" && defined(slug.current) && dateTime(date) > dateTime(now()) - 60*60*48] | order(date desc)[0...1000] {
  title,
  "slug": slug.current,
  date,
  author
}`;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://surkhettimes.vercel.app'));
  
  try {
    const articles = await client.fetch(newsArticlesQuery);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${articles.map((article: any) => `
  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>SurkhetTimes</news:name>
        <news:language>ne</news:language>
      </news:publication>
      <news:publication_date>${new Date(article.date).toISOString()}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
    </news:news>
  </url>
  `).join('')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        // Cache for 10 minutes so we don't bombard Sanity on every request, 
        // but still keep the 48-hour window very fresh
        'Cache-Control': 's-maxage=600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error("Error generating news sitemap:", error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
