import { ApolloClient, useApolloClient } from '@apollo/client';
import { ApolloQueryResult, gql } from '@apollo/client/core';
import { useMemo } from 'react';
import { useToken } from './useToken';

export type GQLAPI = <Res = Record<string, any>>(
  strings: TemplateStringsArray,
  ...expr: any[]
) => Promise<ApolloQueryResult<Res>>;

const makeGql = (client: ApolloClient<any>): GQLAPI => (strings, ...expr) => {
  const q = strings.reduce((p, c, idx) => p + c + (expr[idx]?.toString() ?? ''), '');
  const fetchPolicy = /\s*#\s*no-?cache\n/.test(q) ? 'cache-first' : 'cache-first';
  const query = gql(strings, expr);
  return client.query({ query, fetchPolicy });
};

export const useGraphql = (): GQLAPI => {
  const [token] = useToken();
  const client = useApolloClient();
  return useMemo(() => makeGql(client), [client, token]);
};
