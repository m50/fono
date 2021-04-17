import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { join } from 'path';
import { existsSync as exists } from 'fs';

const files = [
  '.env',
  '.env.local',
];

files.forEach((file) => {
  if (exists(join(__dirname, '..', '..', file))) {
    const env = dotenv.config({ path: join(__dirname, '..', '..', file) });
    dotenvExpand(env);
  }
  if (exists(join(__dirname, '..', '..', '..', file))) {
    const env = dotenv.config({ path: join(__dirname, '..', '..', '..', file) });
    dotenvExpand(env);
  }
});
