import fastify from 'fastify';
import { setup as setupSockets } from '../sockets';

const app = fastify({ logger: true });

app.get('/', async (request, reply) => {
  reply.type('application/json').code(200);
  return { hello: 'world' };
});

setupSockets(app);

export default app;
