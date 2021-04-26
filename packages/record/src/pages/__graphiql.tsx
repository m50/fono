import React, { useMemo } from 'react';
import type { RouteComponentProps } from '@reach/router';
import GraphiQL from 'graphiql/dist';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { isDev } from 'lib/helpers';
import 'graphiql/graphiql.min.css';
import { useApollo } from 'hooks/useApollo';
import useApi from 'hooks/useApi';

const defaultQuery = `query Users {
  users {
    id
    email
    username
    createdAt
    updatedAt
  }
}
`;
type GraphiqlPage = (props: RouteComponentProps) => JSX.Element | null;
const page: GraphiqlPage = () => {
  // useApi();
  const { fetchClient } = useApollo();
  const fetcher = useMemo(() => createGraphiQLFetcher({
    url: `${window.location.origin}/g/ql`,
    fetch: fetchClient,
  }), []);

  return (isDev() && fetcher ? (
    <div className="w-full min-h-screen pb-24">
      <GraphiQL fetcher={fetcher} defaultQuery={defaultQuery} />
    </div>
  ) : null)
};

export default page;
