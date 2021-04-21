import React from 'react';
import { SocketContext } from 'hooks/useSocket';
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';

type Component<Props extends {}> = React.FC<Props> | ((props: Props) => JSX.Element);
type HOC = <Props extends {}>(Comp: Component<Props>) => ((props: Props) => JSX.Element);

const client = new ApolloClient({
  uri: `${window.location.origin}/g/ql`,
  cache: new InMemoryCache(),
});

export const withProviders: HOC = (Comp) => (props) => (
  <ApolloProvider client={client}>
    <SocketContext.Provider value={{}}>
      <Comp {...props} />
    </SocketContext.Provider>
  </ApolloProvider>
);
