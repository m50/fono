import { readFile, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import up from './up';
import rollback from './rollback';
// import reset from './reset';
import create from './create';
import db from '../../setup/db';

describe('migrate', () => {
  afterEach(() => rollback());
  describe('up', () => {
    it('can run migrations', async () => {
      await up();
      const count = await db('migrations').count('migrationId');
      expect(count[0]['count(`migrationId`)']).toBeGreaterThan(0);
    });
  });
  describe('rollback', () => {
    it('can rollback migrations', async () => {
      await up();
      const count = await db('migrations').count('migrationId');
      expect(count[0]['count(`migrationId`)']).toBeGreaterThan(0);

      await rollback();
      const count2 = await db('migrations').count('migrationId');
      expect(count2[0]['count(`migrationId`)']).toBe(0);
    });
  });

  describe('create', () => {
    it('creates a migration file with snake_case param', async () => {
      await create('migration_test');
      const path = join(__dirname, '..', '..', 'schema', 'MigrationTest.ts');
      expect(existsSync(path)).toBeTruthy();
      const fileData = await readFile(path);
      const file = fileData.toString();
      expect(file).toMatch(/export interface MigrationTest/);
      expect(file).toMatch(/export const MigrationTests = \(\) => db<MigrationTest>\('migration_tests'\);/);
      expect(file).toMatch(/createdAt: DateTime;/);
      expect(file).toMatch(/updatedAt: DateTime;/);
      expect(file).toMatch(/await db\.schema\.createTable\('migration_tests'/);
      expect(file).toMatch(/export const up = async/);
      expect(file).toMatch(/export const down = async/);
      expect(file).toMatch(/export const timestamp = \d+;/);
      expect(file).toMatchSnapshot();
      await rm(path);
    });

    it('creates a migration file with PascalCase param', async () => {
      await create('MigrationTest');
      const path = join(__dirname, '..', '..', 'schema', 'MigrationTest.ts');
      expect(existsSync(path)).toBeTruthy();
      const fileData = await readFile(path);
      const file = fileData.toString();
      expect(file).toMatch(/export interface MigrationTest/);
      expect(file).toMatch(/export const MigrationTests = \(\) => db<MigrationTest>\('migration_tests'\);/);
      expect(file).toMatch(/createdAt: DateTime;/);
      expect(file).toMatch(/updatedAt: DateTime;/);
      expect(file).toMatch(/await db\.schema\.createTable\('migration_tests'/);
      expect(file).toMatch(/export const up = async/);
      expect(file).toMatch(/export const down = async/);
      expect(file).toMatch(/export const timestamp = \d+;/);
      expect(file).toMatchSnapshot();
      await rm(path);
    });
  });
});
