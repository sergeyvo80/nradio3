import StationInterface from '@/types/StationInterface';

// источник станции из названия: «Groove Salad [SomaFM]» → «SomaFM»;
// у локальных станций без скобок — «local»
const getStationSource = (station: StationInterface): string => {
  const match = station.title.match(/\[([^\]]+)\]\s*$/);
  return match ? match[1] : 'local';
};

export default getStationSource;
