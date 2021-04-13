import { join, dirname } from 'path';
import { snakeCase, camelCase, upperFirst } from 'lodash';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { singular, plural } from 'pluralize';
import { exec } from 'child_process';
import chalk from 'chalk';
import { log } from './utils';

function open(path: string) {
  if (process.platform === 'darwin' && process.env.NODE_ENV !== 'test') {
    exec(`open "${path}"`);
  }
}

export default async (passedName: string, silent: boolean = false) => {
  const buildPath = passedName.split('/');
  const tablename = buildPath.pop();
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
  const path = join(__dirname, '..', '..', 'schema', ...buildPath, `${typename}.ts`);
  if (!existsSync(dirname(path))) {
    await mkdir(dirname(path), { recursive: true });
  }
  if (existsSync(path)) {
    log(silent, chalk.red('\nMigration already exists.\n'));
    open(path);
    return;
  }
  await writeFile(path, template);
  const fname = chalk.cyan(`${typename}.ts`);
  const tname = chalk.cyan(table);
  log(silent, `\nCreated migration ${fname} for table \`${tname}\` \n\tat ${chalk.dim(path)}\n`);
  open(path);
};
