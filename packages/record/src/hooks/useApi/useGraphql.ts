import { ApolloClient, useApolloClient } from "@apollo/client";
import { ApolloQueryResult, gql } from '@apollo/client/core';
import { useMemo } from "react";
import { useToken } from ".";

export type GQLAPI = <Res = Record<string, any>>(
  strings: TemplateStringsArray,
  ...expr: string[]
) => Promise<ApolloQueryResult<Res>>;

export const useGraphql = (): GQLAPI => {
  const [token] = useToken();
  const client = useApolloClient();
  return useMemo(() => makeGql(client), [client, token])
}

const makeGql = (client: ApolloClient<any>): GQLAPI => {
  return (strings, ...expr) => {
    const q = strings.reduce((p, c, idx) => p + c + (expr[idx] ?? ''), '');
    const fetchPolicy = /\s*#\s*no-?cache\n/.test(q) ? 'network-only' : 'cache-first';
    const query = gql`${q.replace(/\s*#.*\n/g, '')}`;
    return client.query({ query, fetchPolicy });
  };
}
