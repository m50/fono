/* eslint-disable no-param-reassign */
import { createLocalStorageStateHook } from 'use-local-storage-state';
import {  useGraphql } from './useGraphql';
import { useRest } from './useRest';
import { useAuthToken } from './useAuthToken';

export interface JWT {
  u: number;
  t: number;
  k: string;
  e: number;
}

export const useToken = createLocalStorageStateHook<JWT | undefined>('jwt', undefined);

const useApi = () => {
  const token = useAuthToken();
  const gql = useGraphql();
  const api = useRest();

  return { api, gql, userId: token?.u, token };
};

export default useApi;
