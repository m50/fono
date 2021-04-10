import React, { useContext, useMemo } from 'react';
import WS from 'lib/WS';
import { isClientSide, isProduction } from 'lib/helpers';
import { useIsMounted } from './useIsMounted';

export const SocketContext = React.createContext<Record<string, WS>>({});

const useSocket = (path: string = 'g/ws') => {
  const sockets = useContext(SocketContext);
  const isMounted = useIsMounted();
  const ws = useMemo(() => {
    if (!isMounted) {
      return undefined;
    }
    let socket = sockets[path];
    if (!socket && isClientSide()) {
      socket = new WS(path);
      sockets[path] = socket;
      if (!isProduction()) {
        // @ts-ignore
        window.sockets = sockets;
      }
    }
    return socket;
  }, [sockets, path, isMounted]);

  return ws;
};

export default useSocket;
