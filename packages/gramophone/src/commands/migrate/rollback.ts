import chalk from 'chalk';
import glob from 'glob-promise';
import { join } from 'path';
import { sha256 } from 'utils/hash';
import db from '../../setup/db';
import { MigrationFile } from './types';
import { log } from './utils';

export default async (silent: boolean = false) => {
  log(silent, '\nRolling back latest migrations!\n');
  if (!(await db.schema.hasTable('migrations'))) {
    log(silent, 'Nothing to rollback.');
    return;
  }

  const eventId = await db('migrations').max('eventId as eid').first()
    .then((v) => (v?.eid ?? -1) as number);

  if (eventId === -1) {
    log(silent, 'Nothing to rollback.');
    return;
  }

  const dir = join(__dirname, '..', '..', 'schema');
  const files = await glob(`${dir}/**.ts`);
  let count = 1;
  // eslint-disable-next-line
  const promises = files.map((file) => [file, require(file)] as MigrationFile)
    .sort((a: MigrationFile, b: MigrationFile) => (a[1].timestamp > b[1].timestamp ? -1 : 1))
    .map(async (migrationFile: MigrationFile) => {
      const [file, schema] = migrationFile;
      const filename = file.split('/').pop();
      const { down, timestamp } = schema;
      const migrationId = sha256(timestamp);
      const exists = await db('migrations').where('migrationId', migrationId)
        .then((migrations) => migrations.length > 0);
      if (!exists) {
        return;
      }
      await down();
      await db('migrations')
        .where('migrationId', migrationId)
        .where('eventId', eventId)
        .delete();
      log(silent, `  🚨 ${count}. Rolled ${chalk.cyan(filename)} back. ${chalk.dim(`[${timestamp} round ${eventId}]`)}`);
      count += 1;
    });
  await Promise.all(promises);
  log(silent, '');
  return db.destroy();
};
