import { APP_NAME, APP_SHORT_NAME, IMAGES, SEO, THEME_COLOR } from '@/lib/config';
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${APP_NAME} - Professional Project Management Tool`,
    short_name: APP_SHORT_NAME,
    description: SEO.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: THEME_COLOR,
    orientation: 'any',
    icons: [
      {
        src: IMAGES.manifest192,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: IMAGES.manifest512,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['productivity', 'business', 'utilities'],
  };
}
