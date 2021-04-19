import { Arguments, Argv } from 'yargs';
import { join } from 'path';
import { build as execute } from '../build/build';

interface Args {
  rootDir: string;
  debug: boolean;
  prod: boolean;
}

export const command = 'build [rootDir]';
export const describe = 'Builds a directory using a set of configured transformers.';
export const builder = (yargs: Argv): Argv<Args> => {
  return yargs.positional('rootDir', {
    type: 'string',
    default: './',
    description: 'The root directory of the project to build. Default is the current working directory.',
    demandOption: false,
  }).option('debug', {
    type: 'boolean',
    alias: [
      'verbose',
      'v'
    ],
    default: false,
    description: 'Output additional debug information into build log.',
    demandOption: false,
  }).option('prod', {
    type: 'boolean',
    alias: 'p',
    default: false,
    description: 'Create a production build (minimized).',
    demandOption: false,
  });
};

export const handler = async (argv: Arguments<Args>) => {
  if (argv.prod) {
    process.env.NODE_ENV = 'production';
  }
  await execute(join(process.cwd(), argv.rootDir).replace(/\/$/, ''), argv.debug);
}
