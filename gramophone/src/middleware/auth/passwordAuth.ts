import { FastifyRequest } from 'fastify';
import { User, Users } from 'schema/User';
import { check } from 'utils/bcrypt';
import { AuthParams } from './types';

export const passwordAuth = async (req: FastifyRequest<AuthParams>): Promise<User | null> => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error('Authentication params missing.');
  }

  const user = await Users()
    .where('email', email)
    .first();
  if (!user) {
    throw new Error(`User not found: ${email}`);
  }

  const valid = check(password, user.password);
  if (!valid) {
    throw new Error('Password invalid!');
  }

  return user;
};
