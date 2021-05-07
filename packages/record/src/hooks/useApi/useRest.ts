import castTimestamps from '@fono/gramophone/src/setup/db/castTimestamps';
import { useAddToast } from 'components/toasts';
import { Toast } from 'components/toasts/types';
import { useMemo } from 'react';
import { UpdateState } from 'use-local-storage-state/src/useLocalStorageStateBase';
import { JWT, useToken } from './useToken';
import { buildQueryParams } from 'lib/helpers';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type URL = `/${string}`;

export interface SchemaValidationResponse {
  statusCode: 400;
  message: string;
  error: string;
}

export const isSchemaValidationResponse = (obj: any): obj is SchemaValidationResponse => obj?.statusCode
  && obj.statusCode === 400;

export interface CustomValidationResponse {
  statusCode: 422;
  message: string;
  errors: {
    body: {
      [k: string]: string;
    }
  }
}
export const isCustomValidationResponse = (obj: any): obj is CustomValidationResponse => obj?.statusCode
  && obj.statusCode === 422;

export type SuccessResponse<Res extends {}> = Res & {
  statusCode: 200;
}
export const isSuccessResponse = <Res extends {}>(obj: any): obj is SuccessResponse<Res> => obj?.statusCode
  && obj.statusCode === 200;

export type CreatedResponse<Res extends {}> = Res & {
  statusCode: 201;
}
export const isCreatedResponse = <Res extends {}>(obj: any): obj is CreatedResponse<Res> => obj?.statusCode
  && obj.statusCode === 200;

type ResponseTypes<Res> =
  | SchemaValidationResponse
  | CustomValidationResponse
  | SuccessResponse<Res>
  | CreatedResponse<Res>

export type API = <TResponse extends Record<string, any> = { message: string }, TOpts extends Record<string, any> = {}>(
  method: Method,
  url: URL,
  bodyOrQueryString?: TOpts,
) => Promise<ResponseTypes<TResponse>>;

const handleResponse = async (
  response: Response,
  setToken: UpdateState<JWT | undefined>,
  addToast: (toast: Toast) => void,
) => {
  if (!response.ok) {
    if (response.status === 401) {
      setToken(undefined);
    }
    if (response.status >= 500) {
      addToast({
        type: 'error',
        ttl: 20,
        title: 'An unknown server error occured.',
        body: `Code: ${response.status}
Body: ${await response.text()}`,
      });
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

const headers = (token: JWT | undefined): Record<string, any> => {
  const jwt = btoa(JSON.stringify(token));
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...token && { Authorization: `Bearer ${jwt}` },
  };
};

const makeRest = (
  token: JWT | undefined,
  setToken: UpdateState<JWT | undefined>,
  addToast: (toast: Toast) => void,
): API => <TResponse extends Record<string, any>, TOpts extends Record<string, any>>(
  method: Method,
  url: URL,
  bodyOrQueryString?: TOpts,
): Promise<ResponseTypes<TResponse>> => {
  let reqUrl = `/g${url}`;
  const opts = {
    method,
    headers: headers(token),
    ...(method !== 'GET' && { body: JSON.stringify(bodyOrQueryString ?? {}) }),
  };
  if (method === 'GET' && bodyOrQueryString) {
    reqUrl += '?' + buildQueryParams(bodyOrQueryString);
  }
  return fetch(reqUrl, opts)
    .then((response) => handleResponse(response, setToken, addToast))
    .then((response) => response.json())
    .then((response) => castTimestamps(response) as ResponseTypes<TResponse>);
};

export const useRest = () => {
  const [token, setToken] = useToken();
  const addToast = useAddToast();
  return useMemo(() => makeRest(token, setToken, addToast), [token, setToken]);
};
