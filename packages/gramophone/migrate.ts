#!/usr/bin/env ts-node
/* eslint-disable */
import './src/setup/env';
import yargs from 'yargs';
import { reset, rollback, up, create } from './src/commands/migrate';
import chalk from 'chalk';

const { argv } = yargs
  .usage('$0 <cmd> [args]')
  .command('up', 'Runs any migrations that haven\'t been run yet.')
  .command(['down', 'rollback'], 'Rolls back the newest set of migrations.')
  .command('reset', 'Completely resets the database, undoing all migrations')
  .command('create <tableName>', 'Creates a new migration')
  .help();

interface Args {
  _: [('up' | 'down' | 'rollback' | 'reset' | 'create'), ...(string | number)[]];
  '$0': 'migrate.ts';
  silent?: true;
  tableName?: string;
}

async function run(command: Args['_'][0], args: Args) {
  const start = Date.now();
  const { silent } = args;
  let cmd = null;
  switch (command) {
    case 'up':
      await up(silent);
      break;
    case 'rollback':
    case 'down':
      await rollback(silent);
      break;
    case 'reset':
      await reset(silent);
      break;
    case 'create':
      await create(args.tableName as string, silent);
      break;
    default:
      throw new Error('Unknown command');
  }

  const completedIn = Date.now() - start;
  console.log(`✨ Completed in ${chalk.cyan(`${completedIn}s`)} ✨`);
}
const cmd = argv._[0] as Args['_'][0];
argv.command = cmd;
run(cmd, argv as unknown as Args)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
