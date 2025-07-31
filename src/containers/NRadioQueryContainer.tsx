'use client';

import queryClient from '@/api/reactQueryClient';
import { hydrate, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NRadioContainer from './NRadioContainer';
import React from 'react';

interface Props {
  /* eslint-disable */
  state: any, // TODO: interface
  slug: string
}

const NRadioQueryContainer = ({ state, slug }: Props) => {

  hydrate(queryClient, state);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NRadioContainer slug={slug} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
};

export default NRadioQueryContainer;
