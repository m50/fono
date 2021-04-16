import { FastifyInstance } from 'fastify';
import { refreshToken, unauthenticated } from './utils';
import { jwtAuth } from './jwtAuth';
import { passwordAuth } from './passwordAuth';
import { AuthParams } from './types';

export const auth = (app: FastifyInstance) => {
  app.decorateRequest('user', { getter: () => ({}) });
  app.addHook<AuthParams>('preHandler', async (req, reply) => {
    let user = null;
    try {
      if (!req.body) {
        user = await jwtAuth(req);
      } else {
        const { email, username, password } = req.body;
        if ((!email || !username) && !password) {
          user = await jwtAuth(req);
        } else {
          user = await passwordAuth(req);
        }
      }
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
