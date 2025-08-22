'use client';

import React from 'react';
import { QueryClientProvider, DehydratedState } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HydrationBoundary } from '@tanstack/react-query';

import queryClient from '@/api/reactQueryClient';

import NRadioStateMergeContainer from './NRadioStateMergeContainer';

interface Props {
  state: DehydratedState,
  children: React.ReactNode;
}

const NRadioQueryContainer = ({ state, children }: Props) => (
  <QueryClientProvider client={queryClient}>
    <HydrationBoundary state={state}>
      <NRadioStateMergeContainer>
        {children}
      </NRadioStateMergeContainer>
    </HydrationBoundary>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);


export default NRadioQueryContainer;
