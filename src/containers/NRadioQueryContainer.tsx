'use client';

import queryClient from '@/utils/reactQueryClient';

import {
  hydrate,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NRadioContainer from './NRadioContainer';


interface Props {
  /* eslint-disable */
  state: any, // TODO: interface
  slug: string
}

const NRadioQueryContainer = ({
  state, slug
}: Props) => {

  // load server state to client
  hydrate(queryClient, state);

  return (
    <QueryClientProvider client={queryClient}>
      <NRadioContainer slug={slug} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default NRadioQueryContainer;
