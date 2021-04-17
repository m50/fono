import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { auth } from 'middleware/auth';

export const register: FastifyPluginCallback<{}> = (app: FastifyInstance, _, done) => {
  auth(app);

  app.get('/logout', async (req, reply) => {
    reply.removeHeader('X-Refresh-Token');
    reply.status(200);
    return { message: 'Successfully logged out!' };
  });

  done();
};
