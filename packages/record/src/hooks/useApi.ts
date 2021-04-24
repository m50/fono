/* eslint-disable no-param-reassign */
import { useCallback, useEffect } from 'react';
import { useNavigate } from '@reach/router';
import castTimestamps from '@fono/gramophone/src/setup/db/castTimestamps';
import useLocalStorageState, { createLocalStorageStateHook } from 'use-local-storage-state';
import { ApolloQueryResult, gql as gqlConvert } from '@apollo/client/core';
import { useApolloClient } from '@apollo/client/react';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type URL = `/${string}`;

export type GQLAPI = <Res>(strings: TemplateStringsArray, ...expr: string[]) => Promise<ApolloQueryResult<Res>>;
export type API = <TResponse extends Record<string, any> = { message: string }, TOpts extends Record<string, any> = {}>(
  method: Method,
  url: URL,
  bodyOrQueryString?: TOpts,
) => Promise<TResponse>;

interface JWT {
  u: number;
  t: number;
  k: string;
  e: number;
}

const useToken = createLocalStorageStateHook<JWT | undefined>('jwt', undefined);

const useApi = () => {
  const [token, setToken] = useToken();
  const navigate = useNavigate();
  const client = useApolloClient();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const timer = setTimeout(() => {
      setToken(undefined);
    }, token.e - Date.now());

    if (token.e < Date.now()) {
      setToken(undefined);
    }

    return () => clearTimeout(timer);
  }, [token]);

  const gql: GQLAPI = useCallback((strings, ...expr) => {
    const q = strings.reduce((p, c, idx) => p + c + (expr[idx] ?? ''), '');
    const query = gqlConvert`${q}`;
    return client.query({ query });
  }, [client]);

  const api: API = useCallback(<TResponse extends Record<string, any>, TOpts extends Record<string, any>>(
    method: Method,
    url: URL,
    bodyOrQueryString?: TOpts,
  ): Promise<TResponse> => {
    let reqUrl = `/g${url}`;
    if (token) {
      token.t = Date.now();
    }
    const jwt = btoa(JSON.stringify(token));
    const opts = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...token && { Authorization: `Bearer ${jwt}` },
      },
      ...(method !== 'GET' && { body: JSON.stringify(bodyOrQueryString ?? {}) }),
    };
    if (method === 'GET' && bodyOrQueryString) {
      const queryString = Object
        .keys(bodyOrQueryString)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(bodyOrQueryString[key]))}`)
        .join('&');
      if (queryString) {
        reqUrl += `?${queryString}`;
      }
    }
    return fetch(reqUrl, opts).then((response) => {
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
    }).then((response) => response.json())
      .then((response) => castTimestamps(response) as TResponse);
  }, [token, setToken]);

  return { api, gql, userId: token?.u };
};

export default useApi;
