import { FastifyInstance, FastifyPluginCallback, RouteShorthandOptions } from 'fastify';
import schema from './Body.schema.json';

export const register: FastifyPluginCallback<{}> = (app: FastifyInstance, _, done) => {
  const opts: RouteShorthandOptions = { schema: { body: schema } };
  app.post('/login', opts, async (req, reply) => {
    if (!req.user) {
      reply.status(401);
      return { message: 'Authentication failed' };
    }

    reply.status(200);
    return { message: 'Successfully logged in!' };
  });

  done();
};
