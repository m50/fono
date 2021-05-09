import { FastifyInstance } from 'fastify';
import { ApiKeys } from 'schema/ApiKey';

export const cleanupApiKeys = (app: FastifyInstance, frequency = 60 * 60 * 1000) => { // Once an hour
  setInterval(() => {
    ApiKeys()
      .where('expiresAt', '<', new Date())
      .delete()
      .then((count) => app.log.info('Cleaning up API Keys.', { count }));
  }, frequency);
};
