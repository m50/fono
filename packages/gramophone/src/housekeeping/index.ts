import { FastifyInstance } from 'fastify';
import { cleanupApiKeys } from './cleanupApiKeys';
import { keepSpotifyKeysAlive } from './keepSpotifyKeysAlive';

export const housekeeping = (app: FastifyInstance) => {
  cleanupApiKeys(app);
  keepSpotifyKeysAlive(app);
};
