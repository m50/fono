import chalk from 'chalk';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { sha256 } from 'utils/hash';
import db from '../../setup/db';
import { MigrationFile } from './types';

export default async () => {
  console.log('\nRolling back latest migrations!\n');
  if (!(await db.schema.hasTable('migrations'))) {
    console.log('Nothing to rollback.');
    return;
  }

  const eventId = await db('migrations').max('eventId as eid').first()
    .then((v) => (v?.eid ?? -1) as number);

  if (eventId === -1) {
    console.log('Nothing to rollback.');
    return;
  }

  const dir = join(__dirname, '..', '..', 'schema');
  const files = await readdir(dir);
  let count = 1;
  // eslint-disable-next-line
  const promises = files.map((file) => [file, require(`${dir}/${file}`)] as MigrationFile)
    .sort((a: MigrationFile, b: MigrationFile) => (a[1].timestamp > b[1].timestamp ? -1 : 1))
    .map(async (migrationFile: MigrationFile) => {
      const [file, schema] = migrationFile;
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
      console.log(`  🚨 ${count}. Rolled ${chalk.cyan(file)} back. ${chalk.dim(`[${timestamp} round ${eventId}]`)}`);
      count += 1;
    });
  await Promise.all(promises);
  console.log('');
};
