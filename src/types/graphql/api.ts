import type StationInterface from '@/types/StationInterface';

export type StationsInterface = StationInterface[];

export interface StationsQueryResponse {
  items: StationInterface[];
}

export interface GetStationsQueryResponse {
  getStations: StationsQueryResponse;
}

export interface PublishStationsMutateResponse {
  publishStation: StationInterface;
}
