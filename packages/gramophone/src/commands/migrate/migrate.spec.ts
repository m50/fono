import { readFile, rm, rmdir } from 'fs/promises';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import up from './up';
import rollback from './rollback';
import reset from './reset';
import create from './create';
import db from '../../setup/db';

describe('migrate', () => {
  afterEach(() => reset(true));
  afterAll(() => rm(join(__dirname, '..', '..', 'schema', 'MigrationTest.ts')));

  describe('up', () => {
    it('can run migrations', async () => {
      await up(true);
      const count = await db('migrations').count('migrationId');
      expect(count[0]['count(`migrationId`)']).toBeGreaterThan(0);
    });
    it('can migrate subdir', async () => {
      await create('dir/migration_2_test', true);
      await up(true);
      const path = join(__dirname, '..', '..', 'schema', 'dir', 'Migration2Test.ts');
      await rm(path);
      await rmdir(dirname(path));

      const hasTable = await db.schema.hasTable('migration_2_tests');
      expect(hasTable).toBeTruthy();
    });
  });
  describe('rollback', () => {
    it('can rollback migrations', async () => {
      await up(true);
      const count = await db('migrations').count('migrationId');
      expect(count[0]['count(`migrationId`)']).toBeGreaterThan(0);

      await rollback(true);
      const count2 = await db('migrations').count('migrationId');
      expect(count2[0]['count(`migrationId`)']).toBe(0);
    });
  });
  describe('reset', () => {
    it('empties database', async () => {
      await up(true);
      const count = await db('migrations').count('migrationId');
      expect(count[0]['count(`migrationId`)']).toBeGreaterThan(0);
      await reset(true);
      const migrationsExist = await db.schema.hasTable('migrations');
      expect(migrationsExist).toBe(false);
    });
  });

  describe('create', () => {
    it('creates a migration file with snake_case param', async () => {
      Date.now = jest.fn(() => 1618196206380);
      await create('migration_test', true);
      const path = join(__dirname, '..', '..', 'schema', 'MigrationTest.ts');
      expect(existsSync(path)).toBeTruthy();
      const fileData = await readFile(path);
      const file = fileData.toString();
      expect(file).toMatch(/export interface MigrationTest/);
      expect(file).toMatch(/export const MigrationTests = \(\) => db<MigrationTest>\('migration_tests'\);/);
      expect(file).toMatch(/createdAt: DateTime \| Date;/);
      expect(file).toMatch(/updatedAt: DateTime \| Date;/);
      expect(file).toMatch(/await db\.schema\.createTable\('migration_tests'/);
      expect(file).toMatch(/export const up = async/);
      expect(file).toMatch(/export const down = async/);
      expect(file).toMatch(/export const timestamp = \d+;/);
      expect(file).toMatchSnapshot();
      await rm(path);
    });

    it('creates a migration file with PascalCase param', async () => {
      Date.now = jest.fn(() => 1618196206380);
      await create('MigrationTest', true);
      const path = join(__dirname, '..', '..', 'schema', 'MigrationTest.ts');
      expect(existsSync(path)).toBeTruthy();
      const fileData = await readFile(path);
      const file = fileData.toString();
      expect(file).toMatch(/export interface MigrationTest/);
      expect(file).toMatch(/export const MigrationTests = \(\) => db<MigrationTest>\('migration_tests'\);/);
      expect(file).toMatch(/createdAt: DateTime \| Date;/);
      expect(file).toMatch(/updatedAt: DateTime \| Date;/);
      expect(file).toMatch(/await db\.schema\.createTable\('migration_tests'/);
      expect(file).toMatch(/export const up = async/);
      expect(file).toMatch(/export const down = async/);
      expect(file).toMatch(/export const timestamp = \d+;/);
      expect(file).toMatchSnapshot();
      await rm(path);
    });
  });
});
