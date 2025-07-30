'use client';

import queryClient from '@/api/reactQueryClient';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { hydrate } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NRadioContainer from './NRadioContainer';
import isServer from '@/utils/isServer';


const persister = createAsyncStoragePersister({
  storage: !isServer() ? window.localStorage : null,
});

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

  debugger;

  return (
    <>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        {/* <QueryClientProvider client={queryClient}> */}
        <NRadioContainer slug={slug} />
        <ReactQueryDevtools initialIsOpen={false} />
        {/* </QueryClientProvider> */}
      </PersistQueryClientProvider>
    </>
  );
};

export default NRadioQueryContainer;
