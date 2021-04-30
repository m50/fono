import castTimestamps from "@fono/gramophone/src/setup/db/castTimestamps";
import { response } from "msw";
import { useMemo } from "react";
import { UpdateState } from "use-local-storage-state/src/useLocalStorageStateBase";
import { JWT, useToken } from ".";

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

export const useRest = () => {
  const [token, setToken] = useToken();
  return useMemo(() => makeRest(token, setToken), [token, setToken])
}

const makeRest = (token: JWT | undefined, setToken: UpdateState<JWT | undefined>): API => {
  return <TResponse extends Record<string, any>, TOpts extends Record<string, any>>(
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
      reqUrl += buildQueryString(bodyOrQueryString);
    }
    return fetch(reqUrl, opts)
      .then((response) => handleResponse(response, setToken))
      .then((response) => response.json())
      .then((response) => castTimestamps(response) as ResponseTypes<TResponse>);
  }
}

const handleResponse = (response: Response, setToken: UpdateState<JWT | undefined>) => {
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
}

const headers = (token: JWT | undefined): Record<string, any> => {
  const jwt = btoa(JSON.stringify(token));
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...token && { Authorization: `Bearer ${jwt}` },
  };
}

const buildQueryString = (qstring: Record<string, any>): string => {
  const queryString = Object
    .keys(qstring)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(qstring[key]))}`)
    .join('&');
  if (queryString) {
    return `?${queryString}`;
  }
  return '';
}
