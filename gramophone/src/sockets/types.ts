import WebSocket from 'ws';

export interface Packet<T> {
  message: string;
  data: T;
}

export interface WS {
  readonly id: string;
  broadcast: <T>(message: string, data: T) => void;
  send: <T>(message: string, data: T) => void;
  close: () => void;
}

export type Handler<T> = (data: T, socket: WS) => void;

export type Handlers = Record<string, Handler<any>>;
