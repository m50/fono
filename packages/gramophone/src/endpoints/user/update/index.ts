import { FastifyInstance, FastifyPluginCallback, RouteShorthandOptions } from 'fastify';
import { withAuth } from 'middleware/auth';
import { User, Users } from 'schema/User';
import { bcrypt, check } from 'utils/bcrypt';
import schema from './Body.schema.json';

interface Request {
  Body: {
    email: string;
    username: string;
    password?: string;
    passwordConfirmation?: string;
    currentPassword?: string;
  }
}

export const register: FastifyPluginCallback<{}> = (app: FastifyInstance, _, done) => {
  const opts: RouteShorthandOptions = { schema: { body: schema } };
  withAuth(app).patch<Request>('/user', opts, async ({ body, user }, res) => {
    const { email, username, password } = body;
    const update: Partial<User> = { email, username };
    console.log(body);
    if (password) {
      const { currentPassword, passwordConfirmation } = body;
      if (!await check(currentPassword ?? '', user.password)) {
        res.status(422);
        res.send({
          statusCode: 422,
          message: 'Update failed.',
          errors: {
            body: {
              currentPassword: 'Invalid password provided! Did you use the right password?',
            },
          },
        });
        return;
      }
      if (passwordConfirmation !== password) {
        res.status(422);
        res.send({
          statusCode: 422,
          message: 'Update failed.',
          errors: {
            body: {
              passwordConfirmation: 'Password and password confirmation don\'t match!',
            },
          },
        });
        return;
      }
      update.password = await bcrypt(password);
    }
    await Users()
      .where('id', user.id)
      .update(update);
    const newUser: Partial<User> | undefined = await Users().where('id', user.id).first();
    delete newUser?.password;
    res.status(200);
    res.send({ statusCode: 200, message: 'User updated!', user: newUser });
  });

  done();
};
