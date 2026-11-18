import getStations from '@/api/stations';
import { getLocalStorage, setLocalStorage } from '@/api/localStorage';
import NewStationInterface from '@/types/NewStationInterface';
import StationInterface from '@/types/StationInterface';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

const STATIONS_KEY = ['stations'];

// лайкнутые — первыми; порядок применяется и к кэшу, и к localStorage
const sortLikedFirst = (stations: StationInterface[]): StationInterface[] =>
  [...stations].sort((a, b) => Number(b.isLiked) - Number(a.isLiked));

interface UseStationsResult {
  stations: StationInterface[];
  likeMutate: (slug: string) => void;
  clientStateMergeMutate: () => void;
  newStationMutate: (station: NewStationInterface) => void;
  deleteStationMutate: (slug: string) => void;
}

const useStations = (): UseStationsResult => {
  const queryClient = useQueryClient();

  // используется только для кэша/гидрации - данные приходят из layout.tsx (json-файл)
  const { data } = useQuery({
    queryKey: STATIONS_KEY,
    queryFn: () => getStations(),
    enabled: false,
  });

  // единая запись каталога: кэш React Query + localStorage
  const writeStations = (stations: StationInterface[]): void => {
    queryClient.setQueryData<StationInterface[]>(STATIONS_KEY, stations);
    setLocalStorage<StationInterface[]>('stations', stations);
  };

  const readStations = (): StationInterface[] | undefined =>
    queryClient.getQueryData<StationInterface[]>(STATIONS_KEY);

  const clientStateMergeMutate = useMutation({

    mutationFn: async () => {
      await queryClient.cancelQueries({ queryKey: STATIONS_KEY });

      const stations = readStations();

      if (!stations) return;

      // восстанавливаем состояние из localStorage: лайки - по slug (json-станции uuid не имеют,
      // а сравнение uuid === undefined === undefined не имеет смысла)
      const localStations = getLocalStorage<StationInterface[]>('stations', []) ?? [];

      const likedSlugs = new Set(
        localStations
          .filter((localStation) => localStation.isLiked)
          .map((localStation) => localStation.slug),
      );

      // пользовательские (локальные) станции в json не входят - оставляем их как есть.
      // Всё, чего нет в актуальном каталоге (в т.ч. лайкнутые ранее), удаляем из
      // localStorage: resurrect'ить нельзя - у таких станций мёртвый поток
      const localOnlyStations = localStations.filter(
        (localStation) => localStation.isLocal,
      );

      const mergedStations: StationInterface[] = sortLikedFirst([
        ...localOnlyStations,
        ...stations.map((station: StationInterface) => ({
          ...station,
          isLocal: !!station.uuid,
          isLiked: likedSlugs.has(station.slug),
        })),
      ]);

      writeStations(mergedStations);

      return mergedStations;
    },
  });


  const likeMutate = useMutation({

    mutationFn: async (slug: string) => {
      await queryClient.cancelQueries({ queryKey: STATIONS_KEY });

      const stations = readStations();

      if (!stations) return;

      const newStations = stations.map((station: StationInterface) => (
        station.slug === slug
          ? { ...station, isLiked: !station.isLiked }
          : station
      ));

      writeStations(sortLikedFirst(newStations));

      return newStations.find((station: StationInterface) => station.slug === slug);
    },
  });

  const deleteStationMutate = useMutation({

    mutationFn: async (slug: string) => {
      await queryClient.cancelQueries({ queryKey: STATIONS_KEY });

      const stations = readStations();

      if (!stations) return;

      const station = stations.find((filteredStation) => filteredStation.slug === slug);

      if (!station) return false;

      const newStations = stations.filter(
        (filteredStation: StationInterface) => filteredStation.slug !== slug,
      );

      writeStations(newStations);

      return station;
    },
  });

  const newStationMutate = useMutation({

    // без сервера: новая станция добавляется только локально (localStorage)
    mutationFn: async (newStation: NewStationInterface) => newStation,

    // оптимистичная мутация - добавление станции локально
    onMutate: async (newStation: NewStationInterface) => {
      await queryClient.cancelQueries({ queryKey: STATIONS_KEY });

      const stations = readStations();

      if (!stations) return;

      const newStations = sortLikedFirst([
        {
          ...newStation,
          isLocal: true,
          isLiked: true,
          dateAdded: new Date().toDateString(),
          dateUpdated: new Date().toDateString(),
        },
        ...stations,
      ]);

      writeStations(newStations);

      return { newStations };
    },
    onError: (err, variables, context) => {
      if (context?.newStations) {
        writeStations(context.newStations);
      }
    },
    onSuccess: async (newStation, variables, context) => {
      if (context?.newStations) {
        writeStations(context.newStations);
      }
    },
  });

  return {
    // гидрация даёт данные сразу; пустой массив — только страховка
    // для редкого рендера до готовности кэша
    stations: data ?? [],
    likeMutate: likeMutate.mutate,
    clientStateMergeMutate: clientStateMergeMutate.mutate,
    newStationMutate: newStationMutate.mutate,
    deleteStationMutate: deleteStationMutate.mutate,
  };
};

export default useStations;
