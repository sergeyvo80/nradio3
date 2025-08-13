import '@/styles/globals.scss';
import { dehydrate } from '@tanstack/react-query';
import queryClient from '@/api/reactQueryClient';
import getStations from '@/api/graphql/getStations';
import React from 'react';
import NRadioQueryContainer from '@/containers/NRadioQueryContainer';
import { StationsInterface } from '@/types/graphql/api';


const RootLayout = async ({ children }: Readonly<{children: React.ReactNode}>) => {

  let stations: StationsInterface;

  await queryClient.prefetchQuery({
    queryKey: ['stations'], 
    queryFn: async () => {
      stations = await getStations(0, 100);
      console.log('Stations', stations);
      return stations;
    }
  });

  const state = dehydrate(queryClient, { shouldDehydrateQuery: () => true });

  return (
    <html lang="en">
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
      </body>
    </html>
  );
};

export default RootLayout;