/* eslint-disable */
import getStations from '@/api/stations';
import { getLocalStorage, setLocalStorage } from '@/api/localStorage';
import StationsInterface from '@/types/StationsInterface';
import NewStationInterface from '@/types/NewStationInterface';
import StationInterface from '@/types/StationInterface';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

const useStations = (): any => {
  const queryClient = useQueryClient();

  // используется только для кэша/гидрации - данные приходят из layout.tsx (json-файл)
  const { data } = useQuery({
    queryKey: ['stations'],
    queryFn: () => getStations(),
    enabled: false,
  });

  const clientStateMergeMutate = useMutation({

    mutationFn: async () => {
      await queryClient.cancelQueries({ queryKey: ['stations'] });

      const stations = queryClient.getQueryData<StationInterface[]>(['stations']);

      if (!stations) return;

      let localStations = getLocalStorage<StationInterface[]>('stations', []);
      localStations = localStations?.map((localStation) => {
        const station = stations.find((station) => station.uuid === localStation.uuid);
        return {
          ...localStation,
          ...(station ? {
            _id: station._id,
            slug: station.slug,
          } : {}),
        };
      }).filter((localStation) => !localStation._id || (stations.find((station) => station._id === localStation._id)));


      if (localStations) {
        const mergedStations: StationInterface[] = [
          ...localStations
            .filter((localStation) =>
              !stations.find((station) => station.uuid === localStation.uuid)),
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

  const deleteStationMutate = useMutation({

    mutationFn: async (slug: string) => {
      await queryClient.cancelQueries({ queryKey: ['stations'] });

      const stations = queryClient.getQueryData<StationsInterface>(['stations']);

      if (!stations) return;

      let stationI;
      const station = stations.find((station, i) => {
        stationI = station.slug === slug ? i : undefined;
        return station.slug === slug;
      });

      if (stationI !== undefined) {
        stations.splice(stationI, 1);

        queryClient.setQueryData<StationsInterface>(['stations'], stations);

        setLocalStorage<StationInterface[]>('stations', stations);

        return station;
      }

      return false;
    },
  });

  const newStationMutate = useMutation({

      // без сервера: новая станция добавляется только локально (localStorage)
      mutationFn: async (newStation: NewStationInterface) => newStation,

      // оптимистичная мутация - добавление станции локально
      onMutate: async (newStation: NewStationInterface) => {

        await queryClient.cancelQueries({ queryKey: ['stations'] });

        const stations = queryClient.getQueryData<StationInterface[]>(['stations']);

        if (!stations) return;

        const newStations = [
          {
            ...newStation,
            isLiked: true,
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

        return { newStations };
      },
      onError: (err, variables, context) => {

        console.log('>>> newStationMutate  err', err);

        if (context?.newStations) {
          queryClient.setQueryData<StationInterface[]>(['stations'], context.newStations);
        }
      },
      onSuccess: async (newStation, variables, context) => {

        queryClient.setQueryData<StationInterface[]>(['stations'], context?.newStations);
      },
      onSettled: (data, error, variables, context) => {
        console.log('>> newStationMutate onSettled', data, error, variables, context);
      },

  });

  return {
    stations: data,
    likeMutate: likeMutate.mutate,
    clientStateMergeMutate: clientStateMergeMutate.mutate,
    newStationMutate: newStationMutate.mutate,
    deleteStationMutate: deleteStationMutate.mutate,
  };
};

export default useStations;
