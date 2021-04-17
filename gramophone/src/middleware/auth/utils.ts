import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiKey, ApiKeys } from 'schema/ApiKey';
import { User } from 'schema/User';
import { bcrypt } from 'utils/bcrypt';
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

export const unauthenticated = (reply: FastifyReply) => reply.status(401).send({ message: 'Unauthenticated.' });

export const refreshToken = async (user: User): Promise<string> => {
  const token = await bcrypt(sha256(Date.now()));
  const expiresAt = DateTime.now().plus({ hour: 1 });
  await ApiKeys().insert({
    userId: user.id,
    token,
    type: 'refresh',
    expiresAt: expiresAt.toJSDate(),
  });

  return token;
};
