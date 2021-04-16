import { FastifyInstance, FastifyPluginCallback, FastifyRequest } from 'fastify';
import { refreshToken, unauthenticated } from './utils';
import { jwtAuth } from './jwtAuth';
import { passwordAuth } from './passwordAuth';
import { AuthParams } from './types';

export const register: FastifyPluginCallback<{}> = (app: FastifyInstance, _, done) => {
  app.decorateRequest('user', { getter: () => ({}) })
    .addHook('preHandler', async (req: FastifyRequest<AuthParams>, reply) => {
      if (!req.auth) {
        return;
      }
      let user = null;
      try {
        const { email, password } = req.body;
        if (!email && !password) {
          user = await jwtAuth(req);
        } else {
          user = await passwordAuth(req);
        }
      } catch (e) {
        app.log.error(`Authentication error: ${e}`);
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

  done();
};
