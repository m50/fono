import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { join } from 'path';
import { existsSync as exists } from 'fs';

const files = [
  '.env',
  '.env.local',
];

files.forEach((file) => {
  try {
    const file1 = require.resolve(join(__dirname, '..', '..', file));
    if (exists(file1)) {
      const env = dotenv.config({ path: file1 });
      dotenvExpand(env);
      // @ts-ignore
      process.env = { ...process.env, ...env };
    }
  } catch (e) { }
  try {
    const file2 = require.resolve(join(__dirname, '..', '..', '..', '..', file));
    if (exists(file2)) {
      const env = dotenv.config({ path: file2 });
      dotenvExpand(env);
      // @ts-ignore
      process.env = { ...process.env, ...env };
    }
  } catch (e) { }
});
