import getStationQuery from '@/graphql/getStationsQuery';
import apolloClient from '@/api/apolloClient';

import type { GetStationsQueryResponse } from '@/types/graphql/api';
import type StationInterface from '@/types/StationInterface';

const getStations = async (pageParam: number, pageSize: number): Promise<StationInterface[]>  => {
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
};

export default getStations;
