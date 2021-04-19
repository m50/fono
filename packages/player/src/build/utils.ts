import { mkdir, writeFile } from 'fs/promises';
import { existsSync as exists } from 'fs';
import { dirname } from 'path';
import { transformers, extensionMap } from './build.config.json';
import { transform } from './transformers';
import chalk from 'chalk';

export const isInTransformers = (extension: string): extension is keyof typeof transformers =>
  Object.keys(transformers).includes(extension);
export const isInExtensionMap = (extension: string): extension is keyof typeof extensionMap =>
  Object.keys(extensionMap).includes(extension);
export const getExtension = (curExt: string): string => {
  if (!isInExtensionMap(curExt)) {
    return curExt;
  }

  return extensionMap[curExt];
}

export const ext = (path: string): string => '.' + (path.split('.').pop() ?? '');

interface DoTransformArgs {
  transformerType: string | string[];
  rootDir: string;
  paths: string[];
  code: string;
  path: string;
  attempt?: number;
}
export async function doTransform(args: DoTransformArgs, debug?: boolean): Promise<string> {
  const { rootDir, paths, path } = args;
  let { code, attempt = 0, transformerType } = args;
  try {
    if (typeof transformerType === 'string') {
      const start = Date.now();
      code = await transform(transformerType, rootDir, paths)(code, path);
      const timeTaken = ((Date.now() - start) / 1000) + 's';
      debug && console.log(`[${chalk.yellow(timeTaken)}] Ran ${transformerType} on ${path.replace(rootDir, '.')}`);
    } else {
      for (const type of transformerType) {
        const start = Date.now();
        code = await transform(type, rootDir, paths)(code, path);
        const timeTaken = ((Date.now() - start) / 1000) + 's';
        debug && console.log(`[${chalk.yellow(timeTaken)}] Ran ${type} on ${path.replace(rootDir, '.')}`);
      }
    }
    return code;
  } catch (e) {
    console.log(e);
    if (attempt > 2) {
      return code;
    }
    return doTransform({ ...args, transformerType: transformers['fallback'], attempt: attempt + 1 });
  }
}

export async function write(path: string, rootDir: string, code: string) {
  const newPath = path.replace(rootDir, '<rootDir>')
    .replace('src', 'dist')
    .replace('<rootDir>', rootDir)
    .replace(/\.\w+$/, (s) => {
      if (isInExtensionMap(s)) {
        return extensionMap[s];
      }
      return s;
    });

  if (!exists(dirname(newPath))) {
    await mkdir(dirname(newPath), { recursive: true });
  }
  if (['\n', ''].includes(code)) {
    return;
  }
  return writeFile(newPath, code);
}
