import { relative } from 'path';

export const transform = async (source: string, path: string, rootDir: string, paths: string[]): Promise<string> => {
  let code = source;

  paths
    .map((p) => [p, relative(path, p).replace('../', './').replace('./../', '../')])
    .map(([p, relative]) => [
      p.replace(`${rootDir}/src/`, '').replace(/\.[tj]s?$/g, ''),
      relative.endsWith('.ts') ? relative : `${relative ? `${relative}/` : './'}index`
    ])
    .filter(([absPath]) => code.includes(absPath))
    .forEach(([absPath, localPath]) => {
      code = code.replace(`require("${absPath}")`, `require("${localPath.replace(/\.[tj]s?$/g, '')}.js")`);
    });

  return code.replace(/@fono\/(\w+)\/src/g, '@fono/$1/dist');
}
