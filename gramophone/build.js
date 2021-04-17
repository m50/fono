/* eslint-disable import/no-extraneous-dependencies */
const babel = require('@babel/core');
const glob = require('glob-promise');
const { mkdir, readFile, rmdir, writeFile } = require('fs/promises');
const { existsSync } = require('fs');
const { dirname } = require('path');
const babelConfig = require('./.babelrc.json');

async function build() {
  const paths = await glob(`${__dirname}/src/**`);
  // const paths = await glob(`${__dirname}/src/index.ts`);
  await rmdir(`${__dirname}/dist`, { recursive: true });
  await Promise.all(
    paths
      .filter((path) => !/\.(test|spec|d)\.ts/.test(path))
      .filter((path) => /\.(ts|json)$/.test(path))
      .map(async (path) => ({ path, file: await readFile(path) }))
      .map(async (res) => {
        const { path, file } = await res;
        const fileText = file.toString();
        const newPath = path.replace(__dirname, '.')
          .replace('src', 'dist')
          .replace(/\.ts$/, '.js');
        if (!existsSync(dirname(newPath))) {
          await mkdir(dirname(newPath), { recursive: true });
        }
        if (/\.json$/.test(path)) {
          await writeFile(newPath, fileText);
          return;
        }
        const result = await babel.transformAsync(fileText, {
          filename: path,
          minified: process.env.NODE_ENV === 'production',
          retainLines: process.env.NODE_ENV !== 'production',
          ...babelConfig,
        });
        if (!result || !result.code) {
          console.error(`${path} failed to be transpiled.`);
          return;
        }
        const code = result.code.replace(/\.ts/g, '');
        await writeFile(newPath, code);
      }),
  );
}

build().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
