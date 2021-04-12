import { User } from 'schema/User';

declare module 'fastify' {
  interface FastifyRequest {
    user: User;
  }
}
