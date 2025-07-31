'use client';

import queryClient from '@/api/reactQueryClient';
import { hydrate, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NRadioContainer from './NRadioContainer';

interface Props {
  /* eslint-disable */
  state: any, // TODO: interface
  children: React.ReactNode;
}

const NRadioQueryContainer = ({
  state, children
}: Props) => {

  // load server state to client
  hydrate(queryClient, state);
console.log('>> ===', state);

  return (
    <>
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </>
  );
};

export default NRadioQueryContainer;
