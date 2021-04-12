import { readdir } from 'fs/promises';
import { join } from 'path';
import { sha256 } from 'utils/hash';
import db from '../../setup/db';
import { MigrationFile } from './types';

export default async () => {
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
  const files = await readdir(dir);
  // eslint-disable-next-line
  const promises = files.map((file) => [file, require(`${dir}/${file}`)] as MigrationFile)
    .sort((a: MigrationFile, b: MigrationFile) => (a[1].timestamp > b[1].timestamp ? 1 : -1))
    .map(async (migrationFile: MigrationFile) => {
      const [file, schema] = migrationFile;
      const { up, timestamp } = schema;
      const migrationId = sha256(timestamp);
      const exists = await db('migrations').where('migrationId', migrationId)
        .then((migrations) => migrations.length > 0);
      if (exists) {
        return;
      }
      await up();
      await db('migrations').insert({ migrationId, eventId });
      console.log(`Migrated ${file} [${timestamp} round ${eventId}]`);
    });
  await Promise.all(promises);
};
