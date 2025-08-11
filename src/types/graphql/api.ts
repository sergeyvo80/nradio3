import type StationInterface from '@/types/StationInterface';

export type StationsInterface = StationInterface[];

// export interface StationsInterface {
//   // pageParams?: any;
//   pages: StationInterface[][];
// }

export interface StationsQueryResponse {
  items: StationInterface[];
  // count: number;
}

export interface GetStationsQueryResponse {
  getStations: StationsQueryResponse;
}
