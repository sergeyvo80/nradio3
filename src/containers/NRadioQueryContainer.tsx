'use client';

import queryClient from '@/api/reactQueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NRadioMergeStateContainer from './NRadioMergeStateContainer';
import { HydrationBoundary } from '@tanstack/react-query';

interface Props {
  /* eslint-disable */
  state: any, // TODO: interface
  children: React.ReactNode;
}

const NRadioQueryContainer = ({ state, children }: Props) => (
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={state}>
      <NRadioMergeStateContainer>
        {children}
      </NRadioMergeStateContainer>
    </HydrationBoundary>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);


export default NRadioQueryContainer;
