'use client';

import React from 'react';
import { QueryClientProvider, DehydratedState } from '@tanstack/react-query';
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
    {/* кнопка React Query Devtools рендерится в шапке (Header, dev-only),
        чтобы не висеть поверх плеера в правом нижнем углу */}
  </QueryClientProvider>
);


export default NRadioQueryContainer;
