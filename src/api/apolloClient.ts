// import getToken from '@/app/getToken';
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
import { createClient } from 'graphql-ws';

const removeTypenameLink = removeTypenameFromVariables();


console.log('>>> process.env.NEXT_PUBLIC_GRAPHQL_URL', process.env.NEXT_PUBLIC_GRAPHQL_URL);

const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_GRAPHQL_URL, fetch });

const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'graphql',
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
  authLink.concat(httpLink), //.concat(uploadLink),
);


const link = from([removeTypenameLink, splitLink]);

const client = new ApolloClient({
  link: errorLink.concat(link),
  cache: new InMemoryCache(),
});

export default client;
