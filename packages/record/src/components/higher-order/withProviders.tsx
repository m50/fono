import React from 'react';
import { SocketProvider } from 'hooks/useSocket';
import { ApolloProvider } from '@apollo/client/react';
import { useApollo } from 'hooks/useApollo';
import { ToastsProvider } from 'components/toasts';

type Component<Props extends {}> = React.FC<Props> | ((props: Props) => JSX.Element);
type HOC = <Props extends {}>(Comp: Component<Props>) => ((props: Props) => JSX.Element);

export const withProviders: HOC = (Comp) => (props) => {
  const { client } = useApollo();
  return (
    <ApolloProvider client={client}>
      <SocketProvider value={{}}>
        <ToastsProvider>
          <Comp {...props} />
        </ToastsProvider>
      </SocketProvider>
    </ApolloProvider>
  )
};
