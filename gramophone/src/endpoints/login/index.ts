import { FastifyInstance } from 'fastify';
import schema from './Body.schema.json';

export default async function register(app: FastifyInstance, opts: {}, next: CallableFunction) {
  console.log(schema);
  app.post('/login', async (req, reply) => {
    if (!req.user) {
      reply.status(401);
      return { message: 'Authentication failed' };
    }

    reply.status(200);
    return { message: 'Successfully logged in!' };
  });
  next();
}
