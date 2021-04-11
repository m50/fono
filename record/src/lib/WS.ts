import { isProduction } from './helpers';

/* eslint-disable no-console */
interface Packet<T> {
  message: string;
  data: T;
}

type Handler<T> = (data: T) => void;
type ErrorHandler = (ev: Event) => void;

class WS {
  private socket: WebSocket;

  private handlers: Record<string, Handler<any>[]> = {};

  private errorHandlers: ErrorHandler[] = [];

  constructor(path: string = 'g/ws') {
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const url = `${proto}://${window.location.hostname}/${path}`;
    this.socket = new WebSocket(url);
    this.socket.onmessage = (ev) => {
      const packet: Packet<any> = JSON.parse(ev.data) as Packet<any>;
      if (this.handlers[packet.message] && this.handlers[packet.message].length > 0) {
        this.handlers[packet.message].forEach((handler) => handler(packet.data));
      } else if (!isProduction()) {
        throw new Error(`No handler defined for message '${packet.message}'.`);
      }
    };
    this.socket.onerror = (ev) => this.errorHandlers.forEach((handler) => handler(ev));
  }

  onError(handler: (ev: Event) => void) {
    this.errorHandlers.push(handler);
  }

  on<T>(message: string, handler: Handler<T>) {
    if (!this.handlers[message]) {
      this.handlers[message] = [];
    }
    this.handlers[message].push(handler);
  }

  async broadcast<T>(message: string, data: T) {
    await this.waitForSocket();
    this.send('broadcast', { message, data });
  }

  async send<T>(message: string, data: T) {
    await this.waitForSocket();
    this.socket.send(JSON.stringify({ message, data }));
  }

  async close(code?: number, reason?: string) {
    await this.waitForSocket();
    this.socket.close(code, reason);
  }

  private async waitForSocket() {
    if (this.socket.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const maxNumberOfAttempts = 20;
      const intervalTime = 100;

      let currentAttempt = 0;
      const interval = setInterval(() => {
        if (currentAttempt >= maxNumberOfAttempts) {
          clearInterval(interval);
          reject(new Error('Websocket timed out.'));
        } else if (this.socket.readyState === WebSocket.OPEN) {
          clearInterval(interval);
          resolve();
        }
        currentAttempt += 1;
      }, intervalTime);
    });
  }
}

export default WS;
