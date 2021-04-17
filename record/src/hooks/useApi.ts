/* eslint-disable no-param-reassign */
import { useCallback, useState } from 'react';
import { useNavigate } from '@reach/router';
import castTimestamps from '@fono/gramophone/src/setup/db/castTimestamps';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type URL = `/${string}`;

type API = <TResponse extends Record<string, any> = { message: string }, TOpts extends Record<string, any> = {}>(
  method: Method,
  url: URL,
  bodyOrQueryString?: TOpts,
) => Promise<TResponse>;

const useApi = () => {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const api: API = useCallback(<TResponse extends Record<string, any>, TOpts extends Record<string, any>>(
    method: Method,
    url: URL,
    bodyOrQueryString?: TOpts,
  ): Promise<TResponse> => {
    let reqUrl = `/g${url}`;
    const opts = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...token && { Authorization: `Bearer ${token}` },
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
        setToken(newToken);
      } else {
        navigate('/login');
      }
      return response;
    }).then((response) => response.json())
      .then((response) => castTimestamps(response) as TResponse);
  }, [token, setToken]);

  return { api };
};

export default useApi;
