import fastify from 'fastify';
import cors from 'fastify-cors';
import { setup as sockets } from 'sockets';
import * as endpoints from 'endpoints';
import { auth } from 'middleware/auth';

export default () => {
  const server = fastify({ logger: true });
  server.decorate('auth', () => {
    auth(server);
    return server;
  });
  server.register(cors);

  // Health check endpoint.
  server.register(async (app, _, done) => {
    app.get('/ping', async (request, reply) => {
      reply.type('application/json').code(200);
      return { message: 'pong' };
    });

    done();
  });

  // Setup Web Sockets.
  server.register(sockets);

  // Setup all over endpoints.
  Object.values(endpoints)
    .forEach((endpoint) => server.register(endpoint));

  return server;
};
