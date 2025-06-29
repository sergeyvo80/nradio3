// import getToken from '@/app/getToken';
// import { GRAPHQL_BASE_URL } from '@/constants/env';
// import {
//   DELETE_CHAT_MESSAGE_MUTATION, MARK_CHAT_MESSAGE_AS_READ_MUTATION, SEND_CHAT_MESSAGE_FILE_MUTATION,
//   SEND_CHAT_MESSAGE_MUTATION,
//   TYPING_IN_CHAT_MUTATION,
// } from '@/constants/graphql/mutation';

import { GET_STATIONS_QUERY } from '@/graphql/query';


import type {
  GetStationsQueryResponse,
  GetStationsResponse,
  // MarkAsReadChatMessageResponse,
  Stations,
  // SendChatMessageFileResponse,
} from '@/types/interfaces/graphql/api';
import type StationInterface from '@/types/interfaces/StationInterface';
// import type PrevewOptions from '@/interfaces/PreviewOptions';
import apolloClient from '@/utils/apolloClient';


import type { AxiosInstance, AxiosResponse } from 'axios';
import axiosGlobal from 'axios';

// export interface SendChatMessageResponse {
//   sendChatMessage: Message;
// }

const axios: AxiosInstance = axiosGlobal.create({
  timeout: 30000,
  baseURL: 'graphql', // `${GRAPHQL_BASE_URL ?? ''}`,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
    // 'Authorization': `Bearer ${getToken()}`,
  },
  withCredentials: true,
});

class ApiGraphql {

  async getStations(pageParam: number, pageSize: number): Promise<StationInterface[]> {
    const { data, error } = await apolloClient.query<GetStationsQueryResponse>({
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

export default new ApiGraphql();
