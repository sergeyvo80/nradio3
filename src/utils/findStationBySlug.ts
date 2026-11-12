import stationData from '@/data/station.json';
import stationsData from '@/data/stations.json';
import StationInterface from '@/types/StationInterface';

const stations = stationsData as unknown as StationInterface[];

// поиск станции по slug для метаданных: синхронно из локального json —
// работает и на этапе статической генерации (build), без queryClient
const findStationBySlug = (slug?: string): StationInterface =>
  (slug && stations.find((station) => station.slug === slug)) ||
  (stationData as unknown as StationInterface);

export default findStationBySlug;
