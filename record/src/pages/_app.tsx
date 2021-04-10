import React from 'react';
import type { AppProps } from 'next/app';
import { SocketContext } from 'hooks/useSocket';
import '../styles/tailwind.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketContext.Provider value={{}}>
      <Component {...pageProps} />
    </SocketContext.Provider>
  );
}

export default MyApp;
