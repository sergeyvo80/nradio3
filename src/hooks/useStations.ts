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

      // восстанавливаем состояние из localStorage: лайки - по slug (json-станции uuid не имеют,
      // а сравнение uuid === undefined === undefined не имеет смысла)
      const localStations = getLocalStorage<StationInterface[]>('stations', []) ?? [];

      const likedSlugs = new Set(
        localStations
          .filter((localStation) => localStation.isLiked)
          .map((localStation) => localStation.slug),
      );

      // пользовательские (локальные) станции в json не входят - оставляем их как есть
      const localOnlyStations = localStations.filter(
        (localStation) => !stations.find((station) => station.slug === localStation.slug),
      );

      const mergedStations: StationInterface[] = [
        ...localOnlyStations,
        ...stations.map((station: StationInterface) => ({
          ...station,
          isLocal: !!station.uuid,
          isLiked: likedSlugs.has(station.slug),
        })),
      ].sort((a: StationInterface, b: StationInterface) => Number(b.isLiked) - Number(a.isLiked));

      queryClient.setQueryData<StationInterface[]>(['stations'], mergedStations);
      setLocalStorage<StationInterface[]>('stations', mergedStations);

      return mergedStations;
    },
  });


  const likeMutate = useMutation({

    mutationFn: async (slug: string) => {
      await queryClient.cancelQueries({ queryKey: ['stations'] });

      const stations = queryClient.getQueryData<StationsInterface>(['stations']);

      if (!stations) return;

      const newStations = stations.map((station: StationInterface) => (
        station.slug === slug
          ? { ...station, isLiked: !station.isLiked }
          : station
      ));

      queryClient.setQueryData<StationsInterface>(
        ['stations'],
        [...newStations].sort((a: StationInterface, b: StationInterface) => Number(b.isLiked) - Number(a.isLiked)),
      );

      setLocalStorage<StationInterface[]>('stations', newStations);

      return newStations.find((station: StationInterface) => station.slug === slug);
    },
  });

  const deleteStationMutate = useMutation({

    mutationFn: async (slug: string) => {
      await queryClient.cancelQueries({ queryKey: ['stations'] });

      const stations = queryClient.getQueryData<StationsInterface>(['stations']);

      if (!stations) return;

      const station = stations.find((station) => station.slug === slug);

      if (!station) return false;

      const newStations = stations.filter(
        (filteredStation: StationInterface) => filteredStation.slug !== slug,
      );

      queryClient.setQueryData<StationsInterface>(['stations'], newStations);

      setLocalStorage<StationInterface[]>('stations', newStations);

      return station;
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
            isLocal: true,
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
