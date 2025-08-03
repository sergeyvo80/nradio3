/* eslint-disable */
import api from '@/api/apiGraphql';
import { getLocalStorage } from '@/api/localStorage';
import { StationsInterface } from '@/types/interfaces/graphql/api';
import StationInterface from '@/types/interfaces/StationInterface';
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
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
// import { v4 as uuidv4 } from 'uuid';
// import type TypingInterface from '@/interfaces/TypingInterface';

const PAGE_SIZE = 100;

const useStations = (): any => {
  const queryClient = useQueryClient();
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
      // queryFn: async ({ pageParam = 0 }) => api.getStations(0, PAGE_SIZE),
      queryFn: () => api.getStations(0, PAGE_SIZE),
      enabled: false,
      // networkMode: 'offlineFirst',
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
  // }, [station, refetch, queryClient])


  const clientStateMergeMutate = useMutation({

    mutationFn: async () => {
      await queryClient.cancelQueries({ queryKey: ['stations'] });

      const previousStations = queryClient.getQueryData<StationsInterface>(['stations']);

      if (!previousStations) return;

      // merged likes flag from localStorage to server state
      const likeStations: string[] = getLocalStorage('likeStations', []) as string[];
    
      if (likeStations) {
        const mergedStations = previousStations.map((station: StationInterface) => ({
          ...station,
          isLiked: likeStations.includes(station.slug),
        }))
        .sort((a: StationInterface, b: StationInterface) => Number(b.isLiked) - Number(a.isLiked));
    
        queryClient.setQueryData<StationsInterface>(['stations'], mergedStations);
        return mergedStations;
      }
      
      return false;
    },
  });


  const likeMutate = useMutation({

    mutationFn: async (slug: string) => {
      await queryClient.cancelQueries({ queryKey: ['stations'] });

      const previousStations = queryClient.getQueryData<StationsInterface>(['stations']);

      if (!previousStations) return;

      const station = previousStations.find((station) => (station.slug === slug))
        
      if (station) {
        station.isLiked = !station.isLiked
        queryClient.setQueryData<StationsInterface>(
          ['stations'],
          previousStations.sort((a: StationInterface, b: StationInterface) => Number(b.isLiked) - Number(a.isLiked)),
        );
        return station;
      }
      
      return false;
    },
  });



  return {
    // // setStationSlug,
    stations: data,
    // stations: data?.pages ? [].concat(...data.pages) : [], // messages,
    // stationsError: error,
    // stationsStatus: status,
    // fetchNextPage,
    likeMutate: likeMutate.mutate,
    clientStateMergeMutate: clientStateMergeMutate.mutate
  };
};

export default useStations;
