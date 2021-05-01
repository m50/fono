import { FastifyInstance } from 'fastify';
import { getJwt, refreshToken } from './utils';
import { jwtAuth } from './jwtAuth';
import { AuthParams, JWT } from './types';

export const auth = (app: FastifyInstance) => {
  app.decorateRequest('user', null);
  app.addHook<AuthParams>('preHandler', async (req, reply) => {
    let user = null;
    try {
      user = await jwtAuth(req);
    } catch (e) {
      app.log.error(`Authentication ${e}`);
      reply.status(401).send({ statusCode: 401, message: 'Unauthenticated.' });
      return;
    }
    if (!user) {
      throw new Error('Authenticated succesfully but user not found.');
    }
    req.user = user;
    const data = getJwt(req.headers) as JWT;
    const survivalHours = (data.e - data.t) / 1000 / 60 / 60;
    const newToken = await refreshToken(req.user, survivalHours);
    reply.header('X-Refresh-Token', newToken);
  },);

  return app;
};
export const withAuth = auth;
