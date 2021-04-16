import { FastifyInstance, FastifyPluginCallback, RouteShorthandOptions } from 'fastify';
import { refreshToken } from 'middleware/auth/utils';
import { passwordAuth, AuthParams } from './passwordAuth';
import schema from './Body.schema.json';

export const register: FastifyPluginCallback<{}> = (app: FastifyInstance, _, done) => {
  const opts: RouteShorthandOptions = { schema: { body: schema } };
  app.post<AuthParams>('/login', opts, async (req, reply) => {
    const user = await passwordAuth(req);
    if (!user) {
      reply.status(401);
      return { message: 'Authentication failed' };
    }

    const token = refreshToken(user);

    reply.header('X-Refresh-Token', token);
    reply.status(200);
    return { message: 'Successfully logged in!' };
  });

  done();
};
