import React, { useContext, useMemo } from 'react';
import WS from 'lib/WS';
import { isProduction } from 'lib/helpers';

export const SocketContext = React.createContext<Record<string, WS>>({});

const useSocket = (path: string = 'g/ws') => {
  const sockets = useContext(SocketContext);
  const ws = useMemo(() => {
    let socket = sockets[path];
    if (!socket) {
      socket = new WS(path);
      sockets[path] = socket;
      if (!isProduction()) {
        // @ts-ignore
        window.sockets = sockets;
      }
    }
    return socket;
  }, [sockets, path]);

  return ws;
};

export default useSocket;
