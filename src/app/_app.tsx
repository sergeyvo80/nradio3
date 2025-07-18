import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // eslint-disable-next-line no-mixed-operators
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // With SSR, we usually want to set some default staleTime
      // above 0 to avoid refetching immediately on the client
      staleTime: 60 * 1000,
    },
  },
});

const MyApp = ({ Component, pageProps }: AppProps): React.ReactNode => (
  <QueryClientProvider client={client}>
    <Component {...pageProps} />
    <ReactQueryDevtools initialIsOpen position="top" />
  </QueryClientProvider>
);

export default MyApp;
