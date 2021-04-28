/* eslint-disable no-param-reassign */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from '@reach/router';
import castTimestamps from '@fono/gramophone/src/setup/db/castTimestamps';
import { createLocalStorageStateHook } from 'use-local-storage-state';
import { ApolloQueryResult, gql as gqlConvert } from '@apollo/client/core';
import { useApolloClient } from '@apollo/client/react';
import { DateTime } from 'luxon';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type URL = `/${string}`;

export type GQLAPI = <Res = Record<string, any>>(
  strings: TemplateStringsArray,
  ...expr: string[]
) => Promise<ApolloQueryResult<Res>>;

export type API = <TResponse extends Record<string, any> = { message: string }, TOpts extends Record<string, any> = {}>(
  method: Method,
  url: URL,
  bodyOrQueryString?: TOpts,
) => Promise<TResponse>;

export interface JWT {
  u: number;
  t: number;
  k: string;
  e: number;
}

export const useToken = createLocalStorageStateHook<JWT | undefined>('jwt', undefined);

const useApi = () => {
  const [token, setToken] = useToken();
  const navigate = useNavigate();
  const client = useApolloClient();

  useEffect(() => {
    if (!token) {
      client.resetStore();
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
    const fetchPolicy = /\s*#\s*no-?cache\n/.test(q) ? 'network-only' : 'cache-first';
    const query = gqlConvert`${q.replace(/\s*#.*\n/g, '')}`;
    return client.query({ query, fetchPolicy });
  }, [client, token]);

  const api: API = useCallback(<TResponse extends Record<string, any>, TOpts extends Record<string, any>>(
    method: Method,
    url: URL,
    bodyOrQueryString?: TOpts,
  ): Promise<TResponse> => {
    let reqUrl = `/g${url}`;
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

  return { api, gql, userId: token?.u, token };
};

export default useApi;
