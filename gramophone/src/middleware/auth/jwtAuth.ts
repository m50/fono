import { FastifyRequest } from 'fastify';
import { check } from 'utils/bcrypt';
import { ApiKeys } from 'schema/ApiKey';
import { User, Users } from 'schema/User';
import { DateTime } from 'luxon';
import { getJwt } from './utils';

export const jwtAuth = async (req: FastifyRequest): Promise<User | null> => {
  const data = getJwt(req.headers);
  if (!data) {
    throw new Error('No JWT.');
  }
  const keys = await ApiKeys().where('userId', data.u);

  const validKeys = keys.filter((key) => check(data.k, key.token));
  if (validKeys.length > 1) {
    await ApiKeys()
      .where('userId', data.u)
      .delete();
  }
  const validKey = validKeys[0] ?? undefined;
  if (!validKey) {
    throw new Error(`No valid keys for user[${data.u}].`);
  }
  if (validKey.expiresAt.toMillis() < DateTime.now().toMillis()) {
    await ApiKeys()
      .where('userId', data.u)
      .where('id', validKey.id)
      .delete();
    throw new Error(`Key[${validKey.id}] expired for user[${data.u}]; removing`);
  }

  const user = await Users().where('id', data.u).first();
  if (!user) {
    throw new Error(`Key exists for user[${data.u}] but user not found.`);
  }

  await ApiKeys()
    .where('userId', data.u)
    .where('id', validKey.id)
    .delete();

  return user;
};
