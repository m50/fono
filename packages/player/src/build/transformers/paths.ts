import { dirname, join, relative } from 'path';
import { existsSync as exists } from 'fs';
import { readFile, writeFile } from 'fs/promises';

const ext = (path: string): string => `.${path.split('.').pop() ?? ''}`;

export const transform = async (source: string, path: string, rootDir: string, paths: string[]): Promise<string> => {
  let code = source;
  const metaFile = join(rootDir, 'dist', 'meta.json');
  let hashes: Record<string, string> = {};
  if (exists(metaFile)) {
    hashes = JSON.parse((await readFile(metaFile)).toString());
  }
  const discoveryFile = join(rootDir, 'dist', 'discovery.json');
  if (exists(discoveryFile)) {
    hashes = {
      ...JSON.parse((await readFile(discoveryFile)).toString()),
      ...hashes,
    };
  }

  paths
    .map((p) => dirname(p))
    .map((p) => [p, relative(path, p).replace('../', './').replace('./../', '../'), ext(p)])
    .map(([p, relativePath, extension]) => [
      p.replace(`${rootDir}/src/`, '').replace(/\.[tj]s?$/g, ''),
      relativePath.endsWith('.ts') ? relativePath : `${relativePath ? `${relativePath}/` : './'}index`,
      extension,
    ])
    .filter(([absPath]) => code.includes(absPath))
    .forEach(([absPath, localPath, extension]) => {
      const hashPaths = Object.keys(hashes);
      const relativePath = `./${absPath}.${extension}`;
      if (hashPaths.length > 1 && hashPaths.includes(relativePath)) {
        hashes[relativePath] = '';
      }
      code = code.replace(`require("${absPath}")`, `require("${localPath.replace(/\.[tj]s?$/g, '')}.js")`);
      code = code.replace(`require('${absPath}')`, `require('${localPath.replace(/\.[tj]s?$/g, '')}.js')`);
    });

  paths
    .map((p) => [p, relative(path, p).replace('../', './').replace('./../', '../'), ext(p)])
    .map(([p, relativePath, extension]) => [
      p.replace(`${rootDir}/src/`, '').replace(/\.[tj]s?$/g, ''),
      relativePath,
      extension,
    ])
    .filter(([absPath]) => code.includes(absPath))
    .forEach(([absPath, localPath, extension]) => {
      const hashPaths = Object.keys(hashes);
      const relativePath = `./${absPath}.${extension}`;
      if (hashPaths.length > 1 && hashPaths.includes(relativePath)) {
        hashes[relativePath] = '';
      }
      code = code.replace(`require("${absPath}")`, `require("${localPath.replace(/\.[tj]s?$/g, '')}.js")`);
      code = code.replace(`require('${absPath}')`, `require('${localPath.replace(/\.[tj]s?$/g, '')}.js')`);
    });

  if (Object.keys(hashes).length > 0) {
    await writeFile(discoveryFile, JSON.stringify(hashes));
  }

  return code.replace(/@fono\/(\w+)\/src/g, '@fono/$1/dist');
};
