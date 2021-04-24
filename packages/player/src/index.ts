import yargs from 'yargs';
import migrate from './commands/migrate';

const run = async () => migrate(yargs(process.argv.slice(2)))
  .scriptName('player')
  .usage('player <cmd>:<subcmd> [args]')
  .command(require('./commands/build'))
  .command(require('@fono/gramophone/src/commands/run'))
  .help()
  .parse();

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
