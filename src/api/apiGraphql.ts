import getStationQuery from '@/graphql/getStationsQuery';
import type {
  GetStationsQueryResponse,
  PublishStationsMutateResponse,
  // GetStationsResponse,
  // Stations,
} from '@/types/graphql/api';
import type StationInterface from '@/types/StationInterface';
import apolloClient from '@/api/apolloClient';
import publishStationMutate from '@/graphql/publishStationMutate';
import NewStationInterface from '@/types/NewStationInterface';

class ApiGraphql {

  async getStations(pageParam: number, pageSize: number): Promise<StationInterface[]> {
    const { data } = await apolloClient.query<GetStationsQueryResponse>({
      query: getStationQuery,
      fetchPolicy: 'no-cache',
      variables: {
        pageSize,
        pageIndex: pageParam,
      },
    });

    const res: StationInterface[] = data.getStations.items;

    return res;
  }

  async publishStation(newStation: NewStationInterface): Promise<StationInterface> {
    const { data } = await apolloClient.query<PublishStationsMutateResponse>({
      query: publishStationMutate,
      fetchPolicy: 'no-cache',
      variables: newStation,
    });

    const res: StationInterface[] = data.publishStation;

    return res;
  }
}

const apiGraphql = new ApiGraphql();

export default apiGraphql;
