import chalk from 'chalk';
import glob from 'glob-promise';
import { join } from 'path';
import db from '../../setup/db';
import { Migration } from './types';
import { log } from './utils';

export default async (silent: boolean = false) => {
  if (!(await db.schema.hasTable('migrations'))) {
    log(silent, 'Nothing to reset.');
    return;
  }

  const dir = join(__dirname, '..', '..', 'schema');
  const files = await glob(`${dir}/**.ts`);
  // eslint-disable-next-line
  const promises = files.map((file) => require(file) as Migration)
    .sort((a: Migration, b: Migration) => (a.timestamp > b.timestamp ? -1 : 1))
    .map(async (schema: Migration) => {
      const { down } = schema;
      await down();
    });
  await Promise.all(promises);
  await db.schema.dropTableIfExists('migrations');
  log(silent, chalk.yellow('\n\t⚠️  Rolled back all migrations. ⚠️\n'));
  return db.destroy();
};
