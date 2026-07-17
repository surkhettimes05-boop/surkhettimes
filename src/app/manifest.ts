import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SurkhetTimes — Karnali Province News',
    short_name: 'SurkhetTimes',
    description: 'Latest news and stories from Surkhet, Karnali Province, and Nepal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F5F0',
    theme_color: '#ef4444',
    icons: [
      {
        src: '/app-icon.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/app-icon.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
      {
        src: '/app-icon.jpg',
        sizes: 'any',
        type: 'image/jpeg',
      },
    ],
  };
}
