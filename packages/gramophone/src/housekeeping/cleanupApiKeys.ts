import { ApiKeys } from 'schema/ApiKey';

export const cleanupApiKeys = (frequency = 60 * 60 * 1000) => { // Once an hour
  setInterval(() => {
    ApiKeys()
      .where('expiresAt', '<', new Date())
      .delete()
      .then((count) => console.log({ message: 'Cleaning up API Keys.', count }));
  }, frequency);
};
