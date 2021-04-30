import { FastifyRequest } from 'fastify';
import { ApiKeys } from 'schema/ApiKey';
import { User } from 'schema/User';
import { DateTime } from 'luxon';
import { getJwt } from './utils';

export const jwtAuth = async (req: FastifyRequest): Promise<User | null> => {
  const data = getJwt(req.headers);
  if (!data) {
    throw new Error('No JWT.');
  }
  const validKey = await ApiKeys()
    .where('userId', data.u)
    .where('token', data.k)
    .first();

  if (!validKey) {
    throw new Error(`No valid keys for user[${data.u}].`);
  }
  if (validKey.expiresAt && (validKey.expiresAt as DateTime).toMillis() < DateTime.now().toMillis()) {
    await ApiKeys()
      .where('userId', data.u)
      .where('id', validKey.id)
      .delete();
    throw new Error(`Key[${validKey.id}] expired for user[${data.u}]; removing`);
  }

  const user = await validKey.user();
  if (!user) {
    throw new Error(`Key exists for user[${data.u}] but user not found.`);
  }

  setTimeout((userId: number, validKeyId: number) => {
    ApiKeys()
      .where('userId', userId)
      .where('id', validKeyId)
      .delete();
  }, 5 * 1000, user.id, validKey.id); // After 5 seconds

  return user;
};
