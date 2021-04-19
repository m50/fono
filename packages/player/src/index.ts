import yargs from 'yargs';
import migrate from './commands/migrate';

async function run() {
  const commands = yargs(process.argv.slice(2))
    .scriptName('player')
    .usage('player <cmd>:<subcmd> [args]')
    .command(require('./commands/build'))
    .help();

  migrate(commands);

  return commands.parse();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
