import { ImageResponse } from 'next/og';
import { client } from '@/sanity/client';
import { articleBySlugQuery } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';

export const runtime = 'edge';

// Route segment config
export const alt = 'SurkhetTimes Article';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const article = await client.fetch(articleBySlugQuery, { slug });

  if (!article) {
    return new Response('Not Found', { status: 404 });
  }

  // Fetch the Mukta Devanagari font for Nepali characters
  // WOFF is supported by next/og
  const fontData = await fetch(
    new URL('https://cdn.jsdelivr.net/npm/@fontsource/mukta@5.0.19/files/mukta-devanagari-700-normal.woff')
  ).then((res) => res.arrayBuffer());

  const bgImageUrl = article.coverImage 
    ? urlFor(article.coverImage).width(1200).height(630).url()
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          backgroundColor: '#0a0a0a',
          fontFamily: 'Mukta',
        }}
      >
        {bgImageUrl && (
          <img
            src={bgImageUrl}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.4, // Darken background to make text pop
            }}
          />
        )}
        
        {/* Gradient overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80%',
            background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '60px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                color: '#ef4444', // Red-500
                fontSize: '32px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              SurkhetTimes
            </span>
            <span
              style={{
                color: '#ffffff',
                fontSize: '32px',
                marginLeft: '16px',
                marginRight: '16px',
              }}
            >
              |
            </span>
            <span
              style={{
                color: '#e5e5e5',
                fontSize: '28px',
                padding: '8px 16px',
                border: '2px solid #ef4444',
                borderRadius: '8px',
              }}
            >
              {article.category || 'News'}
            </span>
          </div>

          <h1
            style={{
              color: '#ffffff',
              fontSize: '64px',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '32px',
              maxWidth: '1000px',
              // Use line clamp for safety
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {article.title}
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#a3a3a3', // neutral-400
              fontSize: '24px',
            }}
          >
            {article.author && (
              <span style={{ marginRight: '24px', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: '#ef4444', marginRight: '12px', display: 'flex' }} />
                {article.author}
              </span>
            )}
            <span>{article.date}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Mukta',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
