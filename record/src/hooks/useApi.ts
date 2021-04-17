/* eslint-disable no-param-reassign */
import { useCallback, useEffect } from 'react';
import { useNavigate } from '@reach/router';
import castTimestamps from '@fono/gramophone/src/setup/db/castTimestamps';
import useLocalStorageState from 'use-local-storage-state';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type URL = `/${string}`;

type API = <TResponse extends Record<string, any> = { message: string }, TOpts extends Record<string, any> = {}>(
  method: Method,
  url: URL,
  bodyOrQueryString?: TOpts,
) => Promise<TResponse>;

interface JWT {
  u: number;
  t: number;
  k: string;
}

const useApi = () => {
  const [token, setToken] = useLocalStorageState<JWT | undefined>('jwt', undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setToken(undefined);
      navigate('/login');
    }, 1 /* h */ * 60 /* m */ * 60 /* s */ * 1000 /* ms */);

    if (!token) {
      navigate('/login');
    }

    return () => clearTimeout(timer);
  }, [token]);

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
      ...(method !== 'GET' && { body: JSON.stringify(bodyOrQueryString) }),
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
      if (response.status >= 400) {
        return response;
      }
      const newToken = response.headers.get('X-Refresh-Token');
      if (newToken) {
        const newJwt = JSON.parse(atob(newToken)) as JWT;
        setToken(newJwt);
      } else {
        navigate('/login');
      }
      return response;
    }).then((response) => response.json())
      .then((response) => castTimestamps(response) as TResponse);
  }, [token, setToken]);

  return { api, userId: token?.u };
};

export default useApi;
