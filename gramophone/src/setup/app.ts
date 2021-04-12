import fastify from 'fastify';
import { setup as setupSockets } from '../sockets';
import '../middleware';

const app = fastify({ logger: true });

// Health check endpoint.
app.get('/ping', async (request, reply) => {
  reply.type('application/json').code(200);
  return { message: 'pong' };
});

// Setup Web Sockets.
setupSockets(app);

export default app;
