import { FastifyInstance, FastifyPluginCallback, RouteShorthandOptions } from 'fastify';
import { refreshToken } from 'middleware/auth/utils';
import { passwordAuth, AuthParams } from './passwordAuth';
import schema from './Body.schema.json';
import { JWT } from 'middleware/auth/types';

export const register: FastifyPluginCallback<{}> = (app: FastifyInstance, _, done) => {
  const opts: RouteShorthandOptions = { schema: { body: schema } };
  app.post<AuthParams>('/login', opts, async (req, reply) => {
    let user;
    try {
      user = await passwordAuth(req);
    } catch (error) {
      reply.status(401);
      app.log.error(error);
      return { message: 'Authentication failed', error };
    }
    if (!user) {
      reply.status(401);
      return { message: 'Authentication failed' };
    }

    const token = await refreshToken(user);
    const jwt: JWT = { u: user.id, k: token, t: Date.now() };
    reply.header('X-Refresh-Token', Buffer.from(JSON.stringify(jwt)).toString('base64'));
    reply.status(200);
    // @ts-expect-error
    delete user.password;
    delete user.apiKeys;
    return {
      message: 'Successfully logged in!',
      user,
    };
  });

  done();
};
