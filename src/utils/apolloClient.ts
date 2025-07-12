// import getToken from '@/app/getToken';
// import { GRAPHQL_URL } from '@/constants/env';
// const GRAPHQL_URL = 'http://nradio.pro/graphql'; // TODO: move to .env
// import { AuthNotAuthorizedError } from '@/errors/auth';
import fetch from 'cross-fetch'; 
import { GraphqlNetworkError, GraphqlUnknownError } from '@/errors/graphql';
import { registerError } from '@/utils/registeError';
import { ApolloClient, HttpLink, InMemoryCache, from, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
// import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { createClient } from 'graphql-ws';

const removeTypenameLink = removeTypenameFromVariables();

// const uploadLink = createUploadLink({
//   uri: GRAPHQL_URL,
// });

const httpLink = new HttpLink({
  uri: process.env.NEXT_GRAPHQL_URL, fetch
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.NEXT_GRAPHQL_URL || 'graphql',
    retryAttempts: Infinity,
    connectionParams: () => ({
      headers: {
        // Authorization: `Bearer ${getToken()}`,
      },
    }),
  }),
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      //console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);

      if (message.includes('Unauthorized')) {
        // registerError(new AuthNotAuthorizedError(message, 401));

        return;
      }

      registerError(new GraphqlUnknownError(message));
    });
  }

  if (networkError) {
    // console.error(`[Network error]: ${networkError}`);
    console.log(`[Network error]: ${networkError}`);

    if (networkError.message.includes('401')) {
      // registerError(new AuthNotAuthorizedError('Вы не авторизированы', 401));

      return;
    }

    registerError(new GraphqlNetworkError(networkError.message, 401));
  }
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    // Authorization: `Bearer ${getToken()}`,
  },
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  // eslint-disable-next-line no-use-before-define
  authLink.concat(httpLink), //.concat(uploadLink),
);

// eslint-disable-next-line no-use-before-define
const link = from([removeTypenameLink, splitLink]);

const client = new ApolloClient({
  link: errorLink.concat(link),
  cache: new InMemoryCache(),
});

export default client;
