import getStationQuery from '@/graphql/getStationsQuery';
import type { GetStationsQueryResponse } from '@/types/graphql/api';
import type StationInterface from '@/types/StationInterface';
import apolloClient from '@/api/apolloClient';

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
