export interface JWT {
  u: number;
  t: number;
  k: string;
}

export interface AuthParams {
  Querystring?: {
    authKey?: string;
  },
}
