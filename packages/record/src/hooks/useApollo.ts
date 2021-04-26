import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core';
import { useCallback, useMemo } from 'react';
import { useToken, JWT } from './useApi';

export const useApollo = () => {
  const [token, setToken] = useToken();
  const fetchClient: typeof fetch = (uri, options) => {
    const jwt = btoa(JSON.stringify(token));
    const opts = {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...token && { Authorization: `Bearer ${jwt}` },
        ...options?.headers
      },
    };

    return fetch(uri, opts).then((response) => {
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
    });
  };

  const client = useMemo(() => {
    const link = new HttpLink({
      uri: `${window.location.origin}/g/ql`,
      fetch: fetchClient
    });
    const responseMod = new ApolloLink((operation, forward) => {
      return forward(operation).map((response) => {
        // @ts-ignore
        Object.keys(response.data).forEach((k) => {
          // @ts-ignore
          delete response.data[k].__typename;
        });
        return response;
      });
    });
    return new ApolloClient({
      link: responseMod.concat(link),
      cache: new InMemoryCache(),
    });
  }, [token]);

  return { client, fetchClient };
};
