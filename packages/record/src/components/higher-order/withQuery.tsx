import React, { useEffect, useState } from 'react';
import useApi, { GQLAPI } from 'hooks/useApi';
import { ApolloQueryResult } from '@apollo/client';

const isReady = <Props extends Record<string, any>>(props: Partial<Props>, ready: boolean): props is Props => ready;

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
export const withQuery = <
  Props extends Record<string, any>,
  RProps extends Record<keyof Props, any>,
  FProps = Partial<Props>,
>(
    request: (gql: GQLAPI) => Promise<ApolloQueryResult<RProps>>,
    Comp: React.FC<Props> | ((props: Props) => JSX.Element),
  ) => (props: FProps) => {
    const { gql } = useApi();
    const [ready, setReady] = useState(false);
    const [fulfilledProps, setFulfilledProps] = useState<Partial<Props> | Props>(props);

    useEffect(() => {
      request(gql)
        .then((result) => result.data)
        .then((result) => setFulfilledProps((p) => ({ ...p, ...result })))
        .then(() => setReady(true));
    }, []);

    if (isReady(fulfilledProps, ready)) {
      return <Comp {...fulfilledProps} />;
    }

    return null;
  };
