#!/usr/bin/env ts-node
/* eslint-disable */
import './src/setup/env';
import yargs from 'yargs';
import reset from './src/commands/migrate/reset';
import rollback from './src/commands/migrate/rollback';
import up from './src/commands/migrate/up';
import create from './src/commands/migrate/create';
import chalk from 'chalk';

const { argv } = yargs
  .usage('$0 <cmd> [args]')
  .command('up', 'Runs any migrations that haven\'t been run yet.')
  .command(['down', 'rollback'], 'Rolls back the newest set of migrations.')
  .command('reset', 'Completely resets the database, undoing all migrations')
  .command('create <tableName>', 'Creates a new migration')
  .help();

async function run(command: string, args: Record<string, unknown>) {
  const start = Date.now();
  let cmd = null;
  switch (command) {
    case 'up':
      await up();
      break;
    case 'rollback':
    case 'down':
      await rollback();
      break;
    case 'reset':
      await reset();
      break;
    case 'create':
      await create(args.tableName as string);
      break;
    default:
      throw new Error('Unknown command');
  }

  const completedIn = Date.now() - start;
  console.log(`✨ Completed in ${chalk.cyan(`${completedIn}s`)} ✨`);
}
const cmd = argv._[0] as string;
run(cmd as string, argv)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
