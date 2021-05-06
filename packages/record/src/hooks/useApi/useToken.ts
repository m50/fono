import { createLocalStorageStateHook } from 'use-local-storage-state';

export interface JWT {
  u: number;
  t: number;
  k: string;
  e: number;
}

export const useToken = createLocalStorageStateHook<JWT | undefined>('jwt', undefined);
