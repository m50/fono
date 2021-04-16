export interface JWT {
  u: number;
  t: number;
  k: string;
}

export interface AuthParams {
  Querystring?: {
    authKey?: string;
  },
  Body?: {
    email?: string;
    username?: string;
    password?: string;
  };
}
