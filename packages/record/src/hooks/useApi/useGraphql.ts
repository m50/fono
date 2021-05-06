import { ApolloClient, useApolloClient } from '@apollo/client';
import { ApolloQueryResult, gql } from '@apollo/client/core';
import { useMemo } from 'react';
import { useToken } from './useToken';

export type GQLAPI = <Res = Record<string, any>>(
  strings: TemplateStringsArray,
  ...expr: string[]
) => Promise<ApolloQueryResult<Res>>;

const makeGql = (client: ApolloClient<any>): GQLAPI => (strings, ...expr) => {
  const q = strings.reduce((p, c, idx) => p + c + (expr[idx] ?? ''), '');
  const fetchPolicy = /\s*#\s*no-?cache\n/.test(q) ? 'network-only' : 'cache-first';
  const query = gql`${q.replace(/\s*#.*\n/g, '')}`;
  return client.query({ query, fetchPolicy });
};

export const useGraphql = (): GQLAPI => {
  const [token] = useToken();
  const client = useApolloClient();
  return useMemo(() => makeGql(client), [client, token]);
};
