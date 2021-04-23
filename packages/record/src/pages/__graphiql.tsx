import React from 'react';
import type { RouteComponentProps } from '@reach/router';
import GraphiQL from 'graphiql/dist';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { isDev } from 'lib/helpers';
import 'graphiql/graphiql.min.css';

const fetcher = createGraphiQLFetcher({
  url: `${window.location.origin}/g/ql`,
});

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
const page: GraphiqlPage = () => (isDev() ? (
  <div className="w-full min-h-screen p-8">
    <GraphiQL fetcher={fetcher} defaultQuery={defaultQuery} />
  </div>
) : null);

export default page;
