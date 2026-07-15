import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { createClient } from 'next-sanity';

// Configure the Sanity Client with a write token
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Highly privileged write token
});

const parser = new Parser();

// Helper to generate a URL-safe slug from Nepali text
function generateSlug(title: string) {
  const safeString = title.trim().replace(/\s+/g, '-').substring(0, 80);
  const randomSuffix = Math.floor(Math.random() * 10000);
  return `${safeString}-${randomSuffix}`;
}

export async function GET(request: Request) {
  try {
    // 1. Verify Vercel Cron Secret (Security)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch the RSS Feed (Example: OnlineKhabar or standard Nepali feed)
    const feed = await parser.parseURL('https://www.onlinekhabar.com/feed');
    
    let addedCount = 0;

    // 3. Process the top 3 latest items
    for (const item of feed.items.slice(0, 3)) {
      if (!item.title) continue;

      // Check if article already exists (prevent duplicates by title)
      const existing = await client.fetch(`*[_type == "article" && title == $title][0]`, { title: item.title });
      
      if (!existing) {
        // Prepare the new document
        const newArticle = {
          _type: 'article',
          title: item.title,
          slug: { _type: 'slug', current: generateSlug(item.title) },
          category: 'news',
          author: item.creator || 'AutoBot',
          date: new Date(item.pubDate || Date.now()).toISOString(),
          fullStory: item.contentSnippet || item.content || item.summary || 'No content provided.',
          hasAudio: false,
          hasVideo: false,
        };

        // 4. Publish to Sanity!
        await client.create(newArticle);
        addedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Cron job executed successfully. Published ${addedCount} new articles.` 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Cron Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
