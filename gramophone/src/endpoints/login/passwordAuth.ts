import { FastifyRequest } from 'fastify';
import { User, Users } from 'schema/User';
import { check } from 'utils/bcrypt';

export interface AuthParams {
  Body?: {
    email?: string;
    username?: string;
    password?: string;
  };
}

export const passwordAuth = async (req: FastifyRequest<AuthParams>): Promise<User | null> => {
  const { email, username, password } = req.body;
  if ((!email && !username) || !password) {
    throw new Error('Authentication params missing.');
  }
  let column = 'username';
  let search = username;
  if (email) {
    column = 'email';
    search = email;
  }

  const user = await Users()
    .where(column, search)
    .first();
  if (!user) {
    throw new Error(`User not found: ${search}`);
  }

  const valid = await check(password, user.password);
  if (!valid) {
    throw new Error('Password invalid!');
  }

  return user;
};
