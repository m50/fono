import { FastifyInstance, FastifyPluginCallback } from 'fastify';

export const register: FastifyPluginCallback<{}> = (app: FastifyInstance, _, done) => {
  app.auth().get('/logout', async (req, reply) => {
    reply.removeHeader('X-Refresh-Token');
    reply.status(200);
    return { message: 'Successfully logged out!' };
  });

  done();
};
