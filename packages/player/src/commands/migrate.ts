import { reset, rollback, up, create } from '@fono/gramophone/src/commands/migrate';
import { closeConnection } from '@fono/gramophone/src/commands/migrate/utils';
import type { Argv } from 'yargs';

export default function setup(args: Argv) {
  return args.command(
    'migrate:up',
    'Runs any migrations that haven\'t been run yet.',
    (yargs) => yargs.option('quiet', {
      type: 'boolean',
      describe: 'Silently perform the migration.',
      alias: 'q',
    }),
    async ({ quiet }) => up(quiet).then(() => closeConnection()),
  ).command(
    ['migrate:down', 'migrate:rollback'],
    'Rolls back the newest set of migrations.',
    (yargs) => yargs.option('quiet', {
      type: 'boolean',
      describe: 'Silently perform the migration.',
      alias: 'q',
    }),
    async ({ quiet }) => rollback(quiet).then(() => closeConnection()),
  ).command(
    'migrate:reset',
    'Completely resets the database, undoing all migrations.',
    (yargs) => yargs.option('quiet', {
      type: 'boolean',
      describe: 'Silently perform the migration.',
      alias: 'q',
    }),
    async ({ quiet }) => reset(quiet).then(() => closeConnection()),
  ).command(
    'migrate:create <tableName>',
    'Creates a new migration.',
    (yargs) => yargs.option('quiet', {
      type: 'boolean',
      describe: 'Silently perform the migration.',
      alias: 'q',
    }).positional('tableName', {
      type: 'string',
      describe: 'The name of the table to create.',
      required: true,
    }),
    async ({ quiet, tableName }) => create(tableName as string, quiet),
  );
}
