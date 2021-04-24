import { dirname, join } from 'path';
import glob from 'glob-promise';
import { rmSync as rm } from 'fs';
import { transform as regex } from './es5-regex';
import { transform as paths } from './paths';
import { transform as esbuild } from './esbuild';
import { transform as babel } from './babel';
import { transform as stringify } from './stringify';
import { transform as graphql } from './graphql';
import { transform } from '.';

const rootDir = dirname(dirname(dirname(__dirname)));
const input = `
import { transform as regex } from './es5-regex';
import { command } from 'commands/build';
import * as Test from '@fono/gramophone/src/setup/graphql';
import React from 'react';
export { k as test } from './test';

export const k: string = \`hi\`;
export default (k: number): void => {

};
export async function blah<P>(l: P) {}
export function blah2() {}
`;

describe('transformers', () => {
  beforeEach(() => { process.env.NODE_ENV = 'test'; });
  afterAll(() => rm(join(dirname(dirname(dirname(__dirname))), 'dist', 'discovery.json')));

  describe('es5-regex', () => {
    it('matches snapshot', async () => {
      const output = await regex(input, __filename);
      expect(output).toMatchSnapshot();
    });
    it('matches snapshot PRODUCTION', async () => {
      process.env.NODE_ENV = 'production';
      const output = await regex(input, __filename);
      expect(output).toMatchSnapshot();
    });
  });

  describe('paths', () => {
    it('matches snapshot', async () => {
      const p = await glob(`${rootDir}/src/**`, { nodir: true });
      const result = await paths(await regex(input, __filename), __filename, rootDir, p);
      expect(/\.\.\/commands\/build.js/.test(result)).toBeTruthy();
      expect(/'@fono\/gramophone\/dist\/setup\/graphql'/.test(result)).toBeTruthy();
      expect(result).toMatchSnapshot();
    });
  });

  describe('stringify', () => {
    it('matches snapshot', async () => {
      const output = await stringify(input, __filename);
      expect(output).toMatchSnapshot();
    });
  });

  describe('esbuild', () => {
    it('matches snapshot', async () => {
      const output = await esbuild(input, __filename, '{}');
      expect(output).toMatchSnapshot();
    });
    it('matches snapshot PRODUCTION', async () => {
      process.env.NODE_ENV = 'production';
      const output = await esbuild(input, __filename, '{}');
      expect(output).toMatchSnapshot();
    });
  });

  describe('babel', () => {
    it('matches snapshot', async () => {
      const output = await babel(input, __filename, rootDir);
      expect(output).toMatchSnapshot();
    });
    it('matches snapshot PRODUCTION', async () => {
      process.env.NODE_ENV = 'production';
      const output = await babel(input, __filename, rootDir);
      expect(output).toMatchSnapshot();
    });
  });

  describe('graphql', () => {
    it('matches snapshot', async () => {
      const inp = `
type Query {
  user: User
}
`;
      const output = await graphql(inp, __filename);
      expect(output).toMatchSnapshot();
    });
  });

  describe('transform root function', () => {
    it('gets a function even with invalid type', async () => {
      const p = await glob(`${rootDir}/src/**`, { nodir: true });
      const tr = transform('not-a-type', rootDir, p);
      expect(await tr(input, __filename)).toBe(input);
    });
  });
});

