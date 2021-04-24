import { transformAsync } from '@babel/core';

export async function transform(source: string, path: string, rootDir: string) {
  const result = await transformAsync(source, {
    filename: path,
    minified: process.env.NODE_ENV === 'production',
    retainLines: process.env.NODE_ENV !== 'production',
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      '@babel/preset-typescript',
    ],
    plugins: [
      ['babel-plugin-tsconfig-paths', { relative: true, tsconfig: './tsconfig.json', rootDir }],
    ],
  });
  if (!result || !result.code) {
    throw new Error('Unable to process files.');
  }

  result.code = result.code.replace(/\.ts/g, '');
  if (['\n', ''].includes(result.code)) {
    return '';
  }

  return result.code;
}
