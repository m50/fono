import { reset, rollback, up, create } from '@fono/gramophone/src/commands/migrate';
import type { Argv } from 'yargs';

export default function setup(yargs: Argv) {
  return yargs.command('migrate:up', 'Runs any migrations that haven\'t been run yet.', (yargs) => {
    return yargs.option('quiet', {
      type: 'boolean',
      describe: 'Silently perform the migration.',
      alias: 'q',
    });
  }, async ({ quiet }) => await up(quiet))
    .command(['migrate:down', 'migrate:rollback'], 'Rolls back the newest set of migrations.', (yargs) => {
      return yargs.option('quiet', {
        type: 'boolean',
        describe: 'Silently perform the migration.',
        alias: 'q',
      });
    }, async ({ quiet }) => await rollback(quiet))
    .command('migrate:reset', 'Completely resets the database, undoing all migrations.', (yargs) => {
      return yargs.option('quiet', {
        type: 'boolean',
        describe: 'Silently perform the migration.',
        alias: 'q',
      })
    }, async ({ quiet }) => await reset(quiet))
    .command('migrate:create <tableName>', 'Creates a new migration.', (yargs) => {
      return yargs.option('quiet', {
        type: 'boolean',
        describe: 'Silently perform the migration.',
        alias: 'q',
      }).positional('tableName', {
        type: 'string',
        describe: 'The name of the table to create.',
        required: true,
      });
    }, async ({ quiet, tableName }) => await create(tableName as string, quiet));
}
