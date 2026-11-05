import stationsData from '@/data/stations.json';

import type StationInterface from '@/types/StationInterface';

// project работает без сервера - станции берутся из статичного json-файла
const stations = stationsData as unknown as StationInterface[];

const getStations = async (): Promise<StationInterface[]> => [...stations];

export default getStations;
