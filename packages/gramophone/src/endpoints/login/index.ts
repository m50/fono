import { FastifyInstance, FastifyPluginCallback, RouteShorthandOptions } from 'fastify';
import { refreshToken } from 'middleware/auth/utils';
import { passwordAuth, AuthParams } from './passwordAuth';
import schema from './Body.schema.json';

export const register: FastifyPluginCallback<{}> = (app: FastifyInstance, _, done) => {
  const opts: RouteShorthandOptions = { schema: { body: schema } };
  app.post<AuthParams>('/login', opts, async (req, reply) => {
    let user;
    try {
      user = await passwordAuth(req);
    } catch (error) {
      reply.status(401);
      app.log.error(error);
      return { statusCode: 401, message: error.toString(), error };
    }
    if (!user) {
      reply.status(401);
      return { statusCode: 401, message: 'Authentication failed' };
    }
    // If keepLoggedIn, then have the token survive for 20 days.
    const jwt = await refreshToken(user, req.body.keepLoggedIn ? 24 * 20 : 1);
    reply.header('X-Refresh-Token', jwt);
    reply.status(200);
    // @ts-expect-error
    delete user.password;
    // @ts-expect-error
    delete user.apiKeys;
    return {
      statusCode: 200,
      message: 'Successfully logged in!',
      user,
    };
  });

  done();
};
