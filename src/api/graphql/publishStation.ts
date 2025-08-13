import type { PublishStationsMutateResponse } from '@/types/graphql/api';
import type StationInterface from '@/types/StationInterface';
import apolloClient from '@/api/apolloClient';
import publishStationMutate from '@/graphql/publishStationMutate';
import NewStationInterface from '@/types/NewStationInterface';

const publishStation = async (newStation: NewStationInterface): Promise<StationInterface> => {
  const { data } = await apolloClient.query<PublishStationsMutateResponse>({
    query: publishStationMutate,
    fetchPolicy: 'no-cache',
    variables: newStation,
  });

  return data.publishStation;
};

export default publishStation;
