import React from 'react';
import type { AppProps } from 'next/app';
import useSocket from 'hooks/useSocket';
import '../styles/tailwind.css';

function MyApp({ Component, pageProps }: AppProps) {
  const { SocketContext, socket } = useSocket();
  return (
    <SocketContext.Provider value={socket}>
      <Component {...pageProps} />
    </SocketContext.Provider>
  );
}

export default MyApp;
