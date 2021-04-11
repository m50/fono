import { readdir } from 'fs/promises';
import { join } from 'path';
import db from '../setup/db';

export default async () => {
  if (!(await db.schema.hasTable('migrations'))) {
    console.log('Nothing to rollback!');
    return;
  }

  const eventId = await db('migrations').max('eventId as eid').first()
    .then((v) => (v?.eid ?? -1) as number);

  if (eventId === -1) {
    console.log('Nothing to rollback!');
    return;
  }

  const dir = join(__dirname, '..', 'schema');
  const files = await readdir(dir);
  // eslint-disable-next-line
  const promises = files.map((file) => require(`${dir}/${file}`))
    .map(async (schema) => {
      const { down, timestamp } = schema;
      const exists = await db('migrations').where('migrationId', timestamp)
        .then((migrations) => migrations.length > 0);
      if (!exists) {
        return;
      }
      await down();
      await db('migrations')
        .where('migrationId', timestamp)
        .where('eventId', eventId)
        .delete();
    });
  await Promise.all(promises);
};
