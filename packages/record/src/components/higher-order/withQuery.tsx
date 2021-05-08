import React, { useEffect, useState } from 'react';
import useApi from 'hooks/useApi';
import { GQLAPI } from 'hooks/useApi/useGraphql';
import { ApolloQueryResult } from '@apollo/client';

const isReady = <P extends Record<string, any>>(p: Partial<P> | undefined, ready: boolean): p is P => ready;

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
  QueriedProps extends Partial<Record<keyof Props, any>>,
  Props extends Record<string, any>,
  PassedProps = Omit<Props, keyof QueriedProps>,
>(
    request: (gql: GQLAPI, props: PassedProps) => Promise<ApolloQueryResult<QueriedProps>>,
    Comp: React.ComponentType<Props>,
  ) => (props: PassedProps) => {
    const { gql } = useApi();
    const [ready, setReady] = useState(false);
    const [status, setStatus] = useState<ApolloQueryResult<QueriedProps>>();
    const [fulfilledProps, setFulfilledProps] = useState<QueriedProps | undefined>();

    useEffect(() => {
      request(gql, props).then((result) => setStatus(result));
    }, []);

    useEffect(() => {
      if (status && !status.loading) {
        setReady(true);
        setFulfilledProps(status.data);
      }
    }, [status]);

    if (status?.errors) {
      return (
        <div className="w-screen h-screen flex justify-center items-centertext-red-400 text-4xl">
          Failed to load data. Please refresh.
        </div>
      );
    }

    if (isReady(fulfilledProps, ready)) {
      return <Comp {...props} {...fulfilledProps} />;
    }

    return null;
  };
