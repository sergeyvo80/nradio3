import type { MetadataRoute } from 'next';

// Web App Manifest: генерирует /manifest.webmanifest
// см. docs/pwa-plan.md
const manifest = (): MetadataRoute.Manifest => {
  return {
    name: 'NRadio',
    short_name: 'NRadio',
    description: 'Слушать станции: chillout, ambient, trance, drum and bass и др.',
    start_url: '/',
    display: 'standalone',
    orientation: 'any',
    // цвета из дизайна приложения (см. globals.scss)
    background_color: '#292A2D',
    theme_color: '#202124',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
};

export default manifest;
