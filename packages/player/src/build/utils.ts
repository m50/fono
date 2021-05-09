import { mkdir, writeFile, rm, access } from 'fs/promises';
import { constants } from 'fs';
import { dirname } from 'path';
import chalk from 'chalk';
import { transformers, extensionMap } from './build.config.json';
import { transform } from './transformers';

export const exists = (path: string) => access(path, constants.F_OK).then(() => true).catch(() => false);
export const isInTransformers = (extension: string):
  extension is keyof typeof transformers => Object.keys(transformers).includes(extension);
export const isInExtensionMap = (extension: string):
  extension is keyof typeof extensionMap => Object.keys(extensionMap).includes(extension);
export const getExtension = (curExt: string): string => {
  if (!isInExtensionMap(curExt)) {
    return curExt;
  }

  return extensionMap[curExt];
};

export const ext = (path: string): string => `.${path.split('.').pop() ?? ''}`;

interface DoTransformArgs {
  transformerType: string | string[];
  rootDir: string;
  paths: string[];
  code: string;
  path: string;
  attempt?: number;
}
export async function doTransform(args: DoTransformArgs, debug?: boolean): Promise<string> {
  const { rootDir, paths, path, attempt = 0, transformerType } = args;
  let { code } = args;

  try {
    if (typeof transformerType === 'string') {
      const start = Date.now();
      code = await transform(transformerType, rootDir, paths)(code, path);
      const timeTaken = `${((Date.now() - start) / 1000).toString().padEnd(5, '0')}s`;
      const localPath = path.replace(rootDir, '.');
      debug && console.log(
        `[${chalk.yellow(timeTaken)}] Ran ${chalk.magenta(transformerType)} on ${chalk.dim(localPath)}`,
      );
    } else {
      // eslint-disable-next-line
      for (const type of transformerType) {
        const start = Date.now();
        // eslint-disable-next-line
        code = await transform(type, rootDir, paths)(code, path);
        const timeTaken = `${((Date.now() - start) / 1000).toString().padEnd(5, '0')}s`;
        debug && console.log(
          `[${chalk.yellow(timeTaken)}] Ran ${chalk.magenta(type)} on ${chalk.dim(path.replace(rootDir, '.'))}`,
        );
      }
    }
    return code;
  } catch (e) {
    console.log(e);
    if (attempt > 2) {
      return code;
    }
    return doTransform({ ...args, transformerType: transformers.fallback, attempt: attempt + 1 });
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

  if (!await exists(dirname(newPath))) {
    await mkdir(dirname(newPath), { recursive: true });
  }
  if (['\n', ''].includes(code)) {
    if (await exists(newPath)) {
      await rm(newPath);
    }
    return;
  }
  writeFile(newPath, code);
}
