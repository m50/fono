export interface JWT {
  u: number;
  t: number;
  k: string;
  e: number;
}

export interface AuthParams {
  Querystring?: {
    authKey?: string;
  },
}
