import { readdir } from 'fs/promises';
import { join } from 'path';
import { sha256 } from 'utils/hash';
import db from '../../setup/db';
import { Migration } from './types';

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
  const promises = files.map((file) => require(`${dir}/${file}`))
    .sort((a: Migration, b: Migration) => (a.timestamp > b.timestamp ? 1 : -1))
    .map(async (schema) => {
      const { up, timestamp } = schema;
      const migrationId = sha256(timestamp);
      const exists = await db('migrations').where('migrationId', migrationId)
        .then((migrations) => migrations.length > 0);
      if (exists) {
        return;
      }
      await up();
      await db('migrations').insert({ migrationId, eventId });
    });
  await Promise.all(promises);
};
