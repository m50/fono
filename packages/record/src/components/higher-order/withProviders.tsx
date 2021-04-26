import React from 'react';
import { SocketProvider } from 'hooks/useSocket';
import { ApolloProvider } from '@apollo/client/react';
import { useApollo } from 'hooks/useApollo';

type Component<Props extends {}> = React.FC<Props> | ((props: Props) => JSX.Element);
type HOC = <Props extends {}>(Comp: Component<Props>) => ((props: Props) => JSX.Element);

export const withProviders: HOC = (Comp) => (props) => {
  const { client } = useApollo();
  return (
    <ApolloProvider client={client}>
      <SocketProvider value={{}}>
        <Comp {...props} />
      </SocketProvider>
    </ApolloProvider>
  )
};
