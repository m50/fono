import React, { useEffect, useState } from 'react';

const SocketContext = React.createContext<WebSocket | null>(null);

const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    if (!socket) {
      const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
      setSocket(new WebSocket(`${proto}://${window.location.hostname}/g/ws`));
    } else {
      socket.onopen = () => {
        console.log('ready?', socket.readyState);
        socket.send('hello');
      };
      socket.onmessage = (ev) => {
        console.log(ev.data);
      };
    }
  }, [socket]);

  return { SocketContext, socket };
};

export default useSocket;
