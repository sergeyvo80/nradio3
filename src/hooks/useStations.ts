/* eslint-disable */
import api from '@/api/apiGraphql';
// import getUser from '@/app/getUser';
// import type ErrorInterface from '@/interfaces/ErrorInterface';
// import type FileInterface from '@/interfaces/FileInterface';
// import type { StationsInterface } from '@/interfaces/graphql/api';
// import type MarkAsReadInterface from '@/interfaces/MarkAsReadInterface';
// import type MessageInterface from '@/interfaces/StationInterface';
// import { Suspense, useEffect, useRef, useState } from 'react';
import {
  useQuery,
  useInfiniteQuery,
  // useMutation,
  // useQueryClient,
  // QueryClient,
  // QueryClientProvider,
} from '@tanstack/react-query';
// import { v4 as uuidv4 } from 'uuid';
// import type TypingInterface from '@/interfaces/TypingInterface';

const PAGE_SIZE = 100;

const useStations = (): any => {
  // const [stationId, setStationId] = useState(chatIdInit);
  // const queryClient = useQueryClient();
  // const user = getUser();

  /**
   * Создание сообщения
   *
   */
   const {
    status,
    data,
    error,
    // isFetching,
    // isFetchingNextPage,
    // isFetchingPreviousPage,
    // fetchNextPage,
    // fetchPreviousPage,
    // hasNextPage,
    // hasPreviousPage,
    refetch,
  } = useQuery({
      queryKey: ['stations'],
      queryFn: async ({ pageParam = 0 }) => api.getStations(0, PAGE_SIZE),
      // getNextPageParam: (lastPage, allPage) => allPage.length,
      // initialPageParam: 0,
      // getPreviousPageParam: (firstPage) => firstPage?.previousId ?? undefined,
      // getNextPageParam: (lastPage, allPage) => lastPage?.nextId ?? undefined,
    },
  );

  // useEffect(() => {
  //   const reload = async (): Promise<void> => {
  //     await queryClient.cancelQueries({
  //       queryKey: ['channels'],
  //     });
  //     await refetch();
  //   };

  //   void reload();
  // }, [station, refetch, queryClient]);


  return {
    // // setStationSlug,
    stationsData: data,
    // stations: data?.pages ? [].concat(...data.pages) : [], // messages,
    // messagesError: error,
    // messagesStatus: status,
    // fetchNextPage,
  };
};

export default useStations;
