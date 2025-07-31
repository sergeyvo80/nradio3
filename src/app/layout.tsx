// import type { Metadata } from 'next';
// import { useParams, usePathname } from 'next/navigation';
import '@/styles/globals.scss';
// import { DataContext } from './context';
import StationInterface from '@/types/interfaces/StationInterface';
import { dehydrate, QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/api/reactQueryClient';
import api from '@/api/apiGraphql';
import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NRadioQueryContainer from '@/containers/NRadioQueryContainer2';

// export const metadata: Metadata = {
//   title: 'NRadio',
//   description: 'Radio stations player',
// };

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
//
  // const pathname = usePathname();


  let stations: StationInterface[] = [];

  await queryClient.prefetchQuery({
    queryKey: ['stations'], 
    queryFn: async () => {
      stations = await api.getStations(0, 100);
      console.log('Stations', stations.length);
      return stations;
    }
  });

  const state = dehydrate(queryClient, { shouldDehydrateQuery: () => true });
console.log('>>p', state);




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
        {/* <DataContext.Provider value={{ stations: []}}> */}
            {/* <QueryClientProvider client={queryClient}> */}
            <NRadioQueryContainer state={state}>
        {children}
        </NRadioQueryContainer>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}

    {/* </QueryClientProvider> */}

        {/* </DataContext.Provider> */}
      </body>
    </html>
  );
};

export default RootLayout;