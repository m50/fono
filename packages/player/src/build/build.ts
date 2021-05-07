/* eslint-disable no-param-reassign */
import glob from 'glob-promise';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import chalk from 'chalk';
import { sha256 } from '@fono/gramophone/src/utils/hash';
import { transformers } from './build.config.json';
import { isInTransformers, isInExtensionMap, ext, doTransform, write, getExtension, exists } from './utils';


const checkForNewFiles = async (
  rootDir: string,
  paths: string[],
  hashes: Record<string, string>,
  debug: boolean,
  start: number,
): Promise<boolean> => {
  let timeTaken = `${((Date.now() - start) / 1000).toString().padEnd(5, '0')}s`;
  debug && console.log(`[${chalk.yellow(timeTaken)}] Looking to see if new files exist...`);
  const metaFile = join(rootDir, 'dist', 'meta.json');
  const discoveryFile = join(rootDir, 'dist', 'discovery.json');
  if (await exists(discoveryFile)) {
    const discovery = JSON.parse((await readFile(discoveryFile)).toString());
    const newPaths = Object.keys(discovery)
      .filter((p) => !Object.keys(hashes).includes(p));
    if (newPaths.length > 0) {
      newPaths.forEach((p) => { hashes[p] = ''; });
      await writeFile(metaFile, JSON.stringify(hashes, null, 2));

      timeTaken = `${((Date.now() - start) / 1000).toString().padEnd(5, '0')}s`;
      debug && console.log(`[${chalk.yellow(timeTaken)}] Discovery found new files...`);

      return true;
    }
  }

  const newPaths = (await glob(`${rootDir}/src/**`, { nodir: true, dot: true }))
    .filter((path) => !/\.(test|spec|d)\./.test(path))
    .filter((path) => isInExtensionMap(ext(path)));

  if (newPaths.length !== paths.length) {
    newPaths.filter((path) => !paths.includes(path))
      .map((path) => path.replace(`${rootDir}/src`, '.'))
      .forEach((path) => { hashes[path] = ''; });
    await writeFile(metaFile, JSON.stringify(hashes, null, 2));

    timeTaken = `${((Date.now() - start) / 1000).toString().padEnd(5, '0')}s`;
    debug && console.log(`[${chalk.yellow(timeTaken)}] Full search found new files...`);

    return true;
  }

  return false;
};

export const build = async (rootDir: string, debug?: boolean, start = Date.now()): Promise<void> => {
  const metaFile = join(rootDir, 'dist', 'meta.json');
  let hashes: Record<string, string> = {};
  if (await exists(metaFile)) {
    hashes = JSON.parse((await readFile(metaFile)).toString());
  }
  // eslint-disable-next-line
  hashes.__comment = 'DO NOT edit this file by hand, nor modify any files in this folder by hand. If any files are deleted or modified, delete this file, and rebuild.';
  let paths: string[] = [];
  if (Object.keys(hashes).length > 1) {
    paths = Object.keys(hashes)
      .filter((h) => h !== '__comment')
      .map((h) => h.replace(/^\./, `${rootDir}/src`));
  } else {
    paths = (await glob(`${rootDir}/src/**`, { nodir: true, dot: true }))
      .filter((path) => !/\.(test|spec|d)\./.test(path))
      .filter((path) => isInExtensionMap(ext(path)));
  }

  const timeTakenPathDetermination = `${((Date.now() - start) / 1000).toString().padEnd(5, '0')}s`;
  debug && console.log(`[${chalk.yellow(timeTakenPathDetermination)}] Determining paths... Complete!`);

  const transformed = await Promise.all(paths.map(async (path) => {
    const transformStart = Date.now();
    const relativePath = path.replace(`${rootDir}/src`, '.');
    if (!await exists(path)) {
      delete hashes[relativePath];
      const tt = `${((Date.now() - transformStart) / 1000).toString().padEnd(5, '0')}s`;
      debug && console.log(
        `[${chalk.yellow(tt)}] Found deleted file ${chalk.dim(path.replace(rootDir, '.'))}, deleting.`,
      );
      return { path, code: '', noChange: false };
    }
    const extension = ext(path);
    let code = (await readFile(path)).toString();
    const hash = sha256(code);
    const distPath = path
      .replace(`${rootDir}/src`, `${rootDir}/dist`)
      .replace(/\.\w+$/, getExtension(extension));
    if (hashes[relativePath] === hash) {
      return { path, code: (await readFile(distPath)).toString(), noChange: true };
    }
    let transformerType: string | string[] = transformers.fallback;

    if (isInTransformers(extension)) {
      transformerType = transformers[extension];
    }

    code = await doTransform({ code, rootDir, paths, path, transformerType }, debug);
    const timeTaken = `${((Date.now() - transformStart) / 1000).toString().padEnd(5, '0')}s`;
    debug && console.log(
      `[${chalk.yellow(timeTaken)}] Transforming ${chalk.dim(path.replace(rootDir, '.'))}... Complete!`,
    );

    if (!['\n', ''].includes(code)) {
      hashes[relativePath] = hash;
    }

    return { path, code, noChange: false };
  }));

  if (transformed.filter((t) => !t.noChange).length === 0) {
    if (await checkForNewFiles(rootDir, paths, hashes, debug ?? false, start)) {
      build(rootDir, debug, start);
      return;
    }

    const timeTaken = `${((Date.now() - start) / 1000).toString().padEnd(5, '0')}s`;
    console.log(` ✨ No changes... Took ${chalk.yellow(timeTaken)} to complete. ✨`);
    return;
  }

  await Promise.all(transformed
    .filter(({ noChange }) => !noChange)
    .map(async ({ path, code }) => write(path, rootDir, code)));
  await writeFile(metaFile, JSON.stringify(hashes, null, 2));
  if (await checkForNewFiles(rootDir, paths, hashes, debug ?? false, start)) {
    build(rootDir, debug, start);
    return;
  }

  const timeTaken = `${((Date.now() - start) / 1000).toString().padEnd(5, '0')}s`;
  console.log(` ✨ Took ${chalk.yellow(timeTaken)} to build. ✨`);
};
