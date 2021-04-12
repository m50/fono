import { join } from 'path';
import { snakeCase, camelCase, upperFirst } from 'lodash';
import { writeFile } from 'fs/promises';
import { singular, plural } from 'pluralize';

export default async (tablename: string) => {
  const table = plural(snakeCase(tablename)).toLowerCase();
  const typename = upperFirst(camelCase(singular(table)));
  const timestamp = Date.now();
  const template = `import { DateTime } from 'luxon';
import db from 'setup/db';

export const timestamp = ${timestamp};

export const ${plural(typename)} = () => db<${typename}>('${table}');

export interface ${typename} {
  id: number;

  createdAt: DateTime;
  updatedAt: DateTime;
}

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
`;
  const path = join(__dirname, '..', '..', 'schema', `${typename}.ts`);
  await writeFile(path, template);
};
