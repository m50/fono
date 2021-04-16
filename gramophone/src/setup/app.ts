import fastify from 'fastify';
import { setup as sockets } from 'sockets';
import * as middleware from 'middleware';
import * as endpoints from 'endpoints';

export default () => {
  const server = fastify({ logger: true });
  server.decorateRequest('auth', true);

  // Setup Middleware/Hooks.
  Object.values(middleware)
    .forEach((hook) => server.register(hook));

  // Health check endpoint.
  server.register(async (app, _, done) => {
    app.decorateRequest('auth', false);
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
