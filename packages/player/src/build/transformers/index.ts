import { existsSync as exists, readFileSync as readFile } from 'fs';
import { join } from 'path';
import { transform as babel } from './babel';
import { transform as esbuild } from './esbuild';
import { transform as json } from './json';
import { transform as paths } from './paths';

type Transformer = (source: string, path: string) => Promise<string>;

export const transform = (type: string, rootDir: string, srcPaths: string[]): Transformer => {
  if (type === 'babel') return (source, path) => babel(source, path, rootDir);
  if (type === 'esbuild') {
    let tsconfig = '';
    if (exists(join(rootDir, 'tsconfig.json'))) {
      tsconfig = readFile(join(rootDir, 'tsconfig.json')).toString();
    }

    return (source, path) => esbuild(source, path, tsconfig);
  }
  if (type === 'json') return json;
  if (type === 'paths') return (source, path) => paths(source, path, rootDir, srcPaths);

  return (source, path) => Promise.resolve(source);
}
