import { FastifyInstance } from 'fastify';
import { refreshToken, unauthenticated } from './utils';
import { jwtAuth } from './jwtAuth';
import { AuthParams } from './types';

export const auth = (app: FastifyInstance) => {
  app.decorateRequest('user', { getter: () => ({}) });
  app.addHook<AuthParams>('preHandler', async (req, reply) => {
    let user = null;
    try {
      user = await jwtAuth(req);
    } catch (e) {
      app.log.error(`Authentication ${e}`);
      unauthenticated(reply);
      return;
    }
    if (!user) {
      throw new Error('Authenticated succesfully but user not found.');
    }
    req.user = user;
    const newToken = refreshToken(user);
    reply.header('X-Refresh-Token', newToken);
  });
};
