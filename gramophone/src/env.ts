import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { join } from 'path';

const files = [
  '.env',
  '.env.local',
];

files.forEach((file) => {
  let env = dotenv.config({ path: join(__dirname, '..', file) });
  dotenvExpand(env);
  env = dotenv.config({ path: join(__dirname, '..', '..', file) });
  dotenvExpand(env);
});
