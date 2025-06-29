import type StationInterface from '@/types/interfaces/StationInterface';

export interface StationsInterface {
  pageParams: any[];
  pages: StationInterface[][];
}

export interface StationsQueryResponse {
  items: StationInterface[];
  // count: number;
}

export interface GetStationsQueryResponse {
  getStations: StationsQueryResponse;
}
