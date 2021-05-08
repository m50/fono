import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client/core';
import castTimestamps from '@fono/gramophone/src/setup/db/castTimestamps';
import castJson from '@fono/gramophone/src/setup/db/castJson';
import { isDev } from 'lib/helpers';
import { useMemo } from 'react';
import { useToken, JWT } from './useApi/useToken';

export const useApollo = () => {
  const [token, setToken] = useToken();
  const cache = useMemo(() => new InMemoryCache(), []);
  const fetchClient: typeof fetch = async (uri, options) => {
    const jwt = btoa(JSON.stringify(token));
    const opts = {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...token && { Authorization: `Bearer ${jwt}` },
        ...options?.headers,
      },
    };

    const response = await fetch(uri, opts);
    if (!response.ok) {
      if (response.status === 401) {
        setToken(undefined);
      }
      return response;
    }
    const newToken = response.headers.get('X-Refresh-Token');
    if (newToken) {
      const newJwt = JSON.parse(atob(newToken)) as JWT;
      setToken(newJwt);
    }
    return response;
  };

  const client = useMemo(() => {
    const link = new HttpLink({
      uri: `${window.location.origin}/g/ql`,
      fetch: fetchClient,
    });
    const responseMod = new ApolloLink((operation, forward) => forward(operation).map((response) => {
      if (!response?.data) {
        return response;
      }
      response.data = castTimestamps(castJson(response?.data ?? undefined));
      return response;
    }));
    return new ApolloClient({
      link: responseMod.concat(link),
      cache,
      connectToDevTools: isDev(),
    });
  }, [token, cache]);

  return { client, fetchClient };
};
