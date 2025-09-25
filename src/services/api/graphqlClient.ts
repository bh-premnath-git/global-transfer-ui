import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const DEFAULT_GRAPHQL_PATH = '/graphql';

const resolveGraphqlUri = () => {
  const configuredUrl = import.meta.env.VITE_GRAPHQL_URL as string | undefined;
  if (configuredUrl) {
    if (configuredUrl.startsWith('http')) {
      return configuredUrl;
    }

    if (configuredUrl.startsWith('/')) {
      return configuredUrl;
    }

    return `/${configuredUrl}`;
  }

  const restBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (restBase && restBase.startsWith('http')) {
    try {
      return new URL(DEFAULT_GRAPHQL_PATH, restBase).toString();
    } catch (error) {
      console.warn('Unable to derive GraphQL URL from VITE_API_BASE_URL:', error);
    }
  }

  return DEFAULT_GRAPHQL_PATH;
};

const httpLink = createHttpLink({
  uri: resolveGraphqlUri(),
});

const authLink = setContext((_, { headers }) => {
  if (typeof window === 'undefined') {
    return { headers };
  }

  const token = window.localStorage.getItem('auth_token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const graphqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});