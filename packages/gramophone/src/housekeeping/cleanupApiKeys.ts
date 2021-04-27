import { ApiKeys } from 'schema/ApiKey';

export const cleanupApiKeys = () => {
  setInterval(() => {
    console.log({ message: 'Cleaning up API Keys.' });
    ApiKeys()
      .where('expiresAt', '<', Date.now())
      .delete();
  }, 60 * 60 * 1000); // Once an hour
};
