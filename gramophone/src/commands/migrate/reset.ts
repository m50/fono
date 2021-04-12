import chalk from 'chalk';
import { readdir } from 'fs/promises';
import { join } from 'path';
import db from '../../setup/db';
import { Migration } from './types';

export default async () => {
  if (!(await db.schema.hasTable('migrations'))) {
    console.log('Nothing to reset.');
    return;
  }

  const dir = join(__dirname, '..', '..', 'schema');
  const files = await readdir(dir);
  // eslint-disable-next-line
  const promises = files.map((file) => require(`${dir}/${file}`) as Migration)
    .sort((a: Migration, b: Migration) => (a.timestamp > b.timestamp ? -1 : 1))
    .map(async (schema: Migration) => {
      const { down } = schema;
      await down();
    });
  await Promise.all(promises);
  await db.schema.dropTableIfExists('migrations');
  console.log(chalk.yellow('\n\t⚠️  Rolled back all migrations. ⚠️\n'));
};
