import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiKeys } from 'schema/ApiKey';
import { User } from 'schema/User';
import { sha256 } from 'utils/hash';
import { DateTime } from 'luxon';
import { JWT } from './types';

export const getJwt = (headers: FastifyRequest['headers']): JWT | undefined => {
  const authHeader = headers.authorization;
  if (!authHeader) {
    return undefined;
  }
  const jwt = Buffer.from(authHeader.replace(/^Bearer /, ''), 'base64').toString('ascii');
  const data = JSON.parse(jwt) as JWT;

  return data;
};

export const refreshToken = async (user: User, expiresIn = 1): Promise<string> => {
  const token = sha256(Date.now());
  const expiresAt = DateTime.now().plus({ hour: expiresIn });
  await ApiKeys().insert({
    userId: user.id,
    token,
    type: 'refresh',
    expiresAt: expiresAt.toJSDate(),
  });
  const jwt: JWT = { u: user.id, k: token, t: Date.now(), e: expiresAt.toMillis() };

  return Buffer.from(JSON.stringify(jwt)).toString('base64');
};
