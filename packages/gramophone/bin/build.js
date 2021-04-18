#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
const babel = require('@babel/core');
const glob = require('glob-promise');
const { mkdir, readFile, rmdir, writeFile } = require('fs/promises');
const { existsSync } = require('fs');
const { dirname } = require('path');
const babelConfig = require('../config/.babelrc.json');
const esbuildConfig = require('../config/.esbuild.json');
const tsconfigRaw = require('../tsconfig.json');
const esbuild = require('esbuild');
const { relative, resolve } = require('path');

const { argv } = process;
if (argv[argv.length - 1] === '') {
  argv.pop();
}
const arg = argv.pop();
if (arg === '--help') {
  console.log('\n\tJust run build on it\'s own. No additional arguments available.');
  console.log('\tAlternatively, you can use `build:prod` to conduct a production build.\n');
  process.exit(0);
}
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}
if (arg === 'prod') {
  process.env.NODE_ENV = 'production';
}

const rootDir = dirname(__dirname);
const srcDir = `${rootDir}/src`;
const distDir = `${rootDir}/dist`;

async function transformEsbuild(source, path, paths) {
  const output = await esbuild.transform(source, {
    ...esbuildConfig,
    sourcefile: path,
    minify: process.env.NODE_ENV === 'production',
    tsconfigRaw,
  });
  const s = process.env.NODE_ENV === 'production' ? '' : ' '
  if (output.warnings.length > 0) {
    throw output.warnings;
  }
  output.code = `"use strict";${output.code}`
    .replace(/import (.*?) from\s*(['"].*?['"]);?/g, `const $1${s}=${s}require($2);`)
    .replace(/import\s*(['"].*?['"]);?/g, 'require($1);')
    .replace(/const \* as /g, 'const ')
    .replace(
      /export \{(.*?)\}\s*from\s*(['"].*?['"]);?/gs,
      (a, exports, from) => {
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
      /export function (\w+)/g,
      `module.exports.$1${s}=${s}$1;function $1`
    )
    .replace(/\{(\w+) as (\w+)\}/g, `{$1:${s}$2}`)
  ;

  const searchPaths = [];
  output.code.replace(/require\(["'](.*)['"]\)/g, (s, match) => searchPaths.push(match));
  const searchRegex = new RegExp(`(?:${searchPaths.join('|')})`);

  paths
    .filter((p) => !/.*\.spec\..*/.test(p))
    .filter((p) => searchRegex.test(p))
    .map((p) => [p, relative(path, p).replace('../', './').replace('./../', '../')])
    .map(([p, relative]) => [
      p.replace(`${srcDir}/`, '').replace(/\.[tj]s?$/g, ''),
      relative.endsWith('.ts') ? relative : `${relative ? `${relative}/` : './'}index.ts`
    ])
    .forEach(([absPath, localPath]) => {
      output.code = output.code.replace(`require("${absPath}")`, `require("${localPath}.js")`);
    });
  return output;
}

async function transformBabel(source, path) {
  return babel.transformAsync(source, {
    filename: path,
    minified: process.env.NODE_ENV === 'production',
    retainLines: process.env.NODE_ENV !== 'production',
    ...babelConfig,
  });
}

async function build() {
  const start = Date.now();
  const paths = await glob(`${srcDir}/**`);
  // const srcPaths = await glob(`${srcDir}/utils/hash.ts`);
  await rmdir(distDir, { recursive: true });
  await Promise.all(
    paths
      .filter((path) => !/\.(test|spec|d)\.ts/.test(path))
      .filter((path) => /\.(ts|json)$/.test(path))
      .map(async (path) => ({ path, file: await readFile(path) }))
      .map(async (res) => {
        const { path, file } = await res;
        const fileText = file.toString();
        const newPath = path.replace(rootDir, '<rootDir>')
          .replace('src', 'dist')
          .replace('<rootDir>', rootDir)
          .replace(/\.ts$/, '.js');
        if (!existsSync(dirname(newPath))) {
          await mkdir(dirname(newPath), { recursive: true });
        }
        if (/\.json$/.test(path)) {
          await writeFile(newPath, fileText);
          return;
        }
        let result = fileText;
        try {
          result = await transformEsbuild(fileText, path, paths)
        } catch (e) {
          result = await transformBabel(fileText, path);
        }
        if (!result || !result.code) {
          console.error(`${path} failed to be transpiled.`);
          return;
        }
        if (['\n', '"use strict";\n', ''].includes(result.code)) {
          return;
        }
        const code = result.code.replace(/\.ts/g, '');
        await writeFile(newPath, code);
      }),
  );
  const timeTaken = (Date.now() - start) / 1000;
  console.log(` ✨ Took ${timeTaken}s to build. ✨`);
}

build().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
