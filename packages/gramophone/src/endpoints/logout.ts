import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { withAuth } from 'middleware/auth';

export const register: FastifyPluginCallback<{}> = (app: FastifyInstance, _, done) => {
  withAuth(app.get('/logout', async (req, reply) => {
    reply.removeHeader('X-Refresh-Token');
    reply.status(401);
    return { statusCode: 401, message: 'Successfully logged out!' };
  }));

  done();
};
