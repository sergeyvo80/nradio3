import { GET_STATIONS_QUERY } from '@/graphql/query';

import type {
  GetStationsQueryResponse,
  // GetStationsResponse,
  // Stations,
} from '@/types/interfaces/graphql/api';
import type StationInterface from '@/types/interfaces/StationInterface';
import apolloClient from '@/api/apolloClient';

class ApiGraphql {
  async getStations(pageParam: number, pageSize: number): Promise<StationInterface[]> {
    const { data } = await apolloClient.query<GetStationsQueryResponse>({
      query: GET_STATIONS_QUERY,
      fetchPolicy: 'no-cache',
      variables: {
        pageSize,
        pageIndex: pageParam,
      },
    });

    const res: StationInterface[] = data.getStations.items;

    return res;
  }
}

const apiGraphql = new ApiGraphql();

export default apiGraphql;
