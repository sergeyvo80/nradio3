import '@/styles/globals.scss';
import { dehydrate } from '@tanstack/react-query';
import React from 'react';

import queryClient from '@/api/reactQueryClient';
import getStations from '@/api/stations';
import NRadioQueryContainer from '@/containers/NRadioQueryContainer';
import StationsInterface from '@/types/StationsInterface';
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar/ServiceWorkerRegistrar';

import type { Metadata, Viewport } from 'next';

// SomaFM отдаёт 403 при Referer с http-origin (localhost-dev),
// поэтому отсылаем браузеру не слать Referer на сторонние ресурсы
export const metadata: Metadata = {
  other: {
    referrer: 'no-referrer',
  },
  applicationName: 'NRadio',
  appleWebApp: {
    capable: true,
    title: 'NRadio',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/icons/favicon-64.png',
    apple: '/icons/apple-touch-icon.png',
  },
};

// PWA: цвет системных элементов UI (строка заголовка браузера и пр.)
export const viewport: Viewport = {
  themeColor: '#202124',
  width: 'device-width',
  initialScale: 1,
};


const RootLayout = async ({ children }: Readonly<{children: React.ReactNode}>) => {

  // станции предзагружаются в queryClient (на сервере для SSR, затем на клиенте)
  await queryClient.prefetchQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      const stations: StationsInterface = await getStations();
      return stations;
    }
  });

  const state = dehydrate(queryClient, { shouldDehydrateQuery: () => true });

  return (
    <html lang="ru">
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <head>
          {/*<!-- Global Site Tag (gtag.js) - Google Analytics -->*/}
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTM_ID}`}></script>
          <script dangerouslySetInnerHTML={{__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GTM_ID}', {
                page_path: window.location.pathname,
            });
          `}} />                              
        </head>
      )}          
      <body>
        <NRadioQueryContainer state={state}>
          {children}
        </NRadioQueryContainer>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
};

export default RootLayout;