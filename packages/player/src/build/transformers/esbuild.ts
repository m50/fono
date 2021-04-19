import { transform as esbuild } from 'esbuild';

export async function transform(source: string, sourcefile: string, tsconfigRaw: string) {
  const output = await esbuild(source, {
    loader: 'ts',
    sourcefile,
    tsconfigRaw,
    minify: process.env.NODE_ENV === 'production',
  });
  if (output.warnings.length > 0) {
    throw output.warnings;
  }
  let { code } = output;
  if (['\n', ''].includes(code)) {
    return '';
  }

  return code;
}
