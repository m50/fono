import React, { useEffect, useState } from 'react';
import useApi, { GQLAPI } from 'hooks/useApi';
import { ApolloQueryResult } from '@apollo/client';

type Component<Props extends {}> = React.FC<Props> | ((props: Props) => JSX.Element);
type Request<P> = (gql: GQLAPI) => Promise<ApolloQueryResult<Partial<P>>>;

/**
 * How to use:
 * ```ts
 * interface Props { user: User }
 * const UserJson = ({ user }: Props) = (
 *   <div>{JSON.stringify(user)}</div>
 * );
 * export default withQuery((gql) => gql`
 *   query GetUser {
 *     user {
 *       id
 *       email
 *       username
 *       createdAt
 *       updatedAt
 *     }
 *   }
 * `, UserJson);
 * ```
 * @param request A function to call the graphql API.
 * @param Comp The component to wrap.
 * @returns The component with it's props filled from graphql.
 */
export const withQuery = <Props extends Record<string, any>>(
  request: Request<Props>,
  Comp: Component<Props>
) => (props: Props) => {
  const { gql } = useApi();
  const [collectedProps, setCollectedProps] = useState<Partial<Props> | undefined>();

  useEffect(() => {
    request(gql)
      .then((result) => result.data)
      .then((result) => setCollectedProps(result));
  }, []);

  if (collectedProps) {
    return <Comp {...props} {...collectedProps} />;
  }

  return undefined;
};
