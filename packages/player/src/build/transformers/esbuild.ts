import { transform as esbuild } from 'esbuild';

export async function transform(source: string, sourcefile: string, tsconfigRaw: string) {
  const output = await esbuild(source, {
    loader: 'ts',
    sourcefile,
    tsconfigRaw,
    minify: process.env.NODE_ENV === 'production',
  });
  const s = process.env.NODE_ENV === 'production' ? '' : ' '
  if (output.warnings.length > 0) {
    throw output.warnings;
  }
  let { code } = output;
  if (['\n', ''].includes(code)) {
    return '';
  }
  code = code
    .replace(/^#!.+\n/, '')
    .replace(/import\s*(.*?)\s*from\s*(['"].*?['"]);?/g, `const $1${s}=${s}require($2);`)
    .replace(/import\s*(['"].*?['"]);?/g, 'require($1);')
    .replace(/const \* as /g, 'const ')
    .replace(
      /export \{(.*?)\}\s*from\s*(['"].*?['"]);?/gs,
      (a, exports: string, from: string) => {
        const importAs = exports.replace(/\s*as\s*/g, `:${s}`);
        const imp = `const${s}{${importAs}}${s}=${s}require(${from});`
        const matches = exports.split(',')
          .map((s) => s.trim())
          .map((m) => m.replace(/(?:\w+\s+as\s+)(.*)/, '$1'))
          .map((m) => `module.exports.${m}${s}=${s}${m};`);
        return `${imp}${s}${matches.join(s)}`;
      }
    )
    .replace(/export\s+default\s+/g, `module.exports${s}=${s}`)
    .replace(/export\s+const\s+(\w+)/g, `const $1${s}=${s}module.exports.$1`)
    .replace(
      /export ((?:async)? function) (\w+)/g,
      `module.exports.$2${s}=${s}$2;$1 $2`
    )
  ;

  while (/(const {.*)(\w+) as (\w+)/g.test(code)) {
    code = code.replace(/(const {.*)(\w+) as (\w+)/g, `$1$2:${s}$3`);
  }

  return `'use strict';${code}`;
}
