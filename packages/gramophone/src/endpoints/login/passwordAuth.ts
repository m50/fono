import { FastifyRequest } from 'fastify';
import { User, Users } from 'schema/User';
import { check } from 'utils/bcrypt';

export interface AuthParams {
  Body: {
    username: string;
    password: string;
    keepLoggedIn?: boolean
  };
}

export const passwordAuth = async (req: FastifyRequest<AuthParams>): Promise<User | null> => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new Error('Authentication params missing.');
  }

  const user = await Users()
    .where('username', username)
    .first();
  if (!user) {
    throw new Error(`User not found: ${username}`);
  }

  const valid = await check(password, user.password);
  if (!valid) {
    throw new Error('Password invalid!');
  }

  return user;
};
