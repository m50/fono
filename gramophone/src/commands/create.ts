import { join } from 'path';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import { writeFile } from 'fs/promises';

export default async (tablename: string) => {
  const table = tablename.toLowerCase();
  const typename = upperFirst(camelCase(table));
  const timestamp = Date.now();
  const template = `import db from '../setup/db';

export const timestamp = ${timestamp};

export const up = async () => {
  await db.schema.createTable('${table}', (table) => {
    table.increments();

    table.timestamp('createdAt').defaultTo(db.fn.now());
    table.timestamp('updatedAt').defaultTo(db.fn.now());
  });
};

export const down = async () => {
  await db.schema.dropTableIfExists('${table}');
};

export interface ${typename} {
  id: number;

  createdAt: string;
  updatedAt: string;
}
`;
  const path = join(__dirname, '..', 'schema', `${typename}.ts`);
  await writeFile(path, template);
};
