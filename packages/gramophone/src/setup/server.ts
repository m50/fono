import fastify from 'fastify';
import cors from 'fastify-cors';
import { setup as sockets } from 'sockets';
import * as endpoints from 'endpoints';
import withGraphQL from './graphql';
import helmet from 'fastify-helmet';

export default () => {
  const server = withGraphQL(fastify({ logger: true }));
  server.register(cors);
  server.register(helmet);

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
