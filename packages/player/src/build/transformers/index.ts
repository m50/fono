import { existsSync as exists, readFileSync as readFile } from 'fs';
import { join } from 'path';
import { transform as babel } from './babel';
import { transform as esbuild } from './esbuild';
import { transform as json } from './json';
import { transform as paths } from './paths';
import { transform as es5 } from './es5-regex';
import { transform as stringify } from './stringify';
import { transform as graphql } from './graphql';

type Transformer = (source: string, path: string) => Promise<string>;

export const transform = (type: string, rootDir: string, srcPaths: string[]): Transformer => {
  if (type === 'babel') return (source, path) => babel(source, path, rootDir);
  if (type === 'es5-regex') return es5;
  if (type === 'json') return json;
  if (type === 'paths') return (source, path) => paths(source, path, rootDir, srcPaths);
  if (type === 'stringify') return stringify;
  if (type === 'graphql') return graphql;
  if (type === 'esbuild') {
    let tsconfig = '';
    if (exists(join(rootDir, 'tsconfig.json'))) {
      tsconfig = readFile(join(rootDir, 'tsconfig.json')).toString();
    }

    return (source, path) => esbuild(source, path, tsconfig);
  }

  return (source, path) => Promise.resolve(source);
}
