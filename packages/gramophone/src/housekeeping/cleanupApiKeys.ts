import { ApiKeys } from 'schema/ApiKey';

export const cleanupApiKeys = () => {
  setInterval(() => {
    ApiKeys()
      .where('expiresAt', '<', Date.now())
      .delete();
  }, 60 * 60 * 1000); // Once an hour
};
