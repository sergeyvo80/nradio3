/* eslint-disable */
import api from '@/api/apiGraphql';
import { getLocalStorage, setLocalStorage } from '@/api/localStorage';
import { StationsInterface } from '@/types/graphql/api';
import NewStationInterface from '@/types/NewStationInterface';
import StationInterface from '@/types/StationInterface';
import { v4 as uuidv4 } from 'uuid';
// import type ErrorInterface from '@/interfaces/ErrorInterface';
// import type { StationsInterface } from '@/interfaces/graphql/api';
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
import { useEffect } from 'react';
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
  });

  const clientStateMergeMutate = useMutation({

    mutationFn: async () => {
      await queryClient.cancelQueries({ queryKey: ['stations'] });

      const stations = queryClient.getQueryData<StationInterface[]>(['stations']);

      if (!stations) return;

      // merged likes flag from localStorage to server state
      const localStations = getLocalStorage<StationInterface[]>('stations', []);

      if (localStations) {
        const mergedStations: StationInterface[] = [
          ...localStations.filter((localStation) => !localStation._id),
          ...stations.map((station: StationInterface) => ({
            ...station,
            isLiked: !!localStations.find((localStation) => localStation.slug === station.slug && localStation.isLiked)
          }))
        ].sort((a: StationInterface, b: StationInterface) => Number(b.isLiked) - Number(a.isLiked));
    
        queryClient.setQueryData<StationInterface[]>(['stations'], mergedStations);
        setLocalStorage<StationInterface[]>('stations', mergedStations);

        return mergedStations;
      }
      
      return false;
    },
  });


  const likeMutate = useMutation({

    mutationFn: async (slug: string) => {
      await queryClient.cancelQueries({ queryKey: ['stations'] });

      const stations = queryClient.getQueryData<StationsInterface>(['stations']);

      if (!stations) return;

      const station = stations.find((station) => (station.slug === slug))
        
      if (station) {
        station.isLiked = !station.isLiked
        queryClient.setQueryData<StationsInterface>(
          ['stations'],
          stations.sort((a: StationInterface, b: StationInterface) => Number(b.isLiked) - Number(a.isLiked)),
        );
    
        setLocalStorage<StationInterface[]>('stations', stations);

        return station;
      }
      
      return false;
    },
  });


  const newStationMutate = useMutation({

    mutationFn: async (newStation: NewStationInterface) => {

      await queryClient.cancelQueries({ queryKey: ['stations'] });

      const stations = queryClient.getQueryData<StationInterface[]>(['stations']);

      if (!stations) return;

      const newStations = [
        {
          ...newStation,
          isLiked: true,
          tags: [],
          slug: uuidv4(),
          uid: uuidv4(),
          dateAdded: new Date().toDateString(),
          dateUpdated: new Date().toDateString(),
        },        
        ...stations,
      ];

      queryClient.setQueryData<StationsInterface>(
        ['stations'],
        newStations.sort((a: StationInterface, b: StationInterface) => Number(b.isLiked) - Number(a.isLiked)),
      );
  
      setLocalStorage<StationInterface[]>('stations', newStations);

      return newStations;
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
    clientStateMergeMutate: clientStateMergeMutate.mutate,
    newStationMutate: newStationMutate.mutate,
  };
};

export default useStations;
