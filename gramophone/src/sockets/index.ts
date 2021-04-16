import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import ws, { SocketStream } from 'fastify-websocket';
import WebSocket from 'ws';
import { sha256 } from 'utils/hash';
import handlers from './handlers';
import { Packet, WS } from './types';

const connections: WS[] = [];

const removeConnection = (id: string) => {
  const idx = connections.findIndex((c) => c.id === id);
  delete connections[idx];
};

function broadcast<T>(id: string, message: string, data: T) {
  connections.filter((c) => c.id !== id)
    .forEach((c) => c.send(message, data));
}

const createWS = (socket: WebSocket): WS => {
  const id = sha256(Date.now());
  return {
    id,
    broadcast: (message, data) => broadcast(id, message, data),
    send: (message, data) => socket.send(JSON.stringify({ message, data })),
    close: () => socket.close(),
  };
};

export const setup: FastifyPluginCallback<{}> = (app: FastifyInstance, _, done) => {
  app.register(ws);
  app.get('/ws', { websocket: true }, (connection: SocketStream) => {
    const socket = createWS(connection.socket);
    connections.push(socket);
    connection.socket.on('close', () => removeConnection(socket.id));
    connection.socket.on('message', (message: string) => {
      const packet: Packet<any> = JSON.parse(message) as Packet<any>;
      if (handlers[packet.message]) {
        handlers[packet.message](packet.data, socket);
      }
    });
    connection.socket.send(JSON.stringify({ message: 'welcome', data: { message: 'Welcome!' } }));
  });

  done();
};
