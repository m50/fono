import chalk from 'chalk';
import glob from 'glob-promise';
import { join } from 'path';
import { sha256 } from 'utils/hash';
import db from '../../setup/db';
import { MigrationFile } from './types';
import { log } from './utils';

export default async (silent: boolean = false) => {
  log(silent, '\nRunning migrations!\n');
  if (!(await db.schema.hasTable('migrations'))) {
    await db.schema.createTable('migrations', (table) => {
      table.string('migrationId').primary().unique();
      table.integer('eventId');
      table.timestamp('timestamp').defaultTo(db.fn.now());
    });
  }

  const eventId = await db('migrations').max('eventId as eid').first()
    .then((v) => (v?.eid ?? -1) as number)
    .then((eid) => eid + 1);

  const dir = join(__dirname, '..', '..', 'schema');
  const files = await glob(`${dir}/**`);
  let count = 1;
  const promises = files
    .filter((path) => /\.[jt]s$/.test(path))
    // eslint-disable-next-line
    .map((file) => [file, require(file)] as MigrationFile)
    .sort((a: MigrationFile, b: MigrationFile) => (a[1].timestamp > b[1].timestamp ? 1 : -1))
    .map(async (migrationFile: MigrationFile) => {
      const [file, schema] = migrationFile;
      const filename = file.split('/').pop();
      const { up, timestamp, test } = schema;
      if (test && process.env.NODE_ENV !== 'test') {
        return;
      }
      const migrationId = sha256(timestamp);
      const exists = await db('migrations').where('migrationId', migrationId)
        .then((migrations) => migrations.length > 0);
      if (exists) {
        return;
      }
      await up();
      await db('migrations').insert({ migrationId, eventId });
      log(silent, `  ✨ ${count}. Migrated ${chalk.cyan(filename)} ${chalk.dim(`[${timestamp} round ${eventId}]`)}`);
      count += 1;
    });
  await Promise.all(promises);
  log(silent, '');
};
