export interface JWT {
  u: number;
  t: number;
  k: string;
}

export interface AuthParams {
  Body: {
    email?: string;
    password?: string;
    authKey?: string;
  };
}
