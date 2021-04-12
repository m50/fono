import { readFile, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import up from './up';
import rollback from './rollback';
import reset from './reset';
import create from './create';
import db from '../../setup/db';

const { log } = console;

describe('migrate', () => {
  beforeAll(() => { console.log = jest.fn(); });
  afterAll(() => { console.log = log; });

  afterEach(() => rollback());

  describe('up', () => {
    it('can run migrations', async () => {
      await up();
      const count = await db('migrations').count('migrationId');
      expect(count[0]['count(`migrationId`)']).toBeGreaterThan(0);
      expect(console.log).toHaveBeenCalled();
    });
  });
  describe('rollback', () => {
    it('can rollback migrations', async () => {
      await up();
      const count = await db('migrations').count('migrationId');
      expect(count[0]['count(`migrationId`)']).toBeGreaterThan(0);
      expect(console.log).toHaveBeenCalled();

      await rollback();
      const count2 = await db('migrations').count('migrationId');
      expect(count2[0]['count(`migrationId`)']).toBe(0);
      expect(console.log).toHaveBeenCalled();
    });
  });
  describe('reset', () => {
    it('empties database', async () => {
      await up();
      const count = await db('migrations').count('migrationId');
      expect(count[0]['count(`migrationId`)']).toBeGreaterThan(0);
      await reset();
      const migrationsExist = await db.schema.hasTable('migrations');
      expect(migrationsExist).toBe(false);
    });
  });

  describe('create', () => {
    it('creates a migration file with snake_case param', async () => {
      Date.now = jest.fn(() => 1618196206380);
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
      expect(console.log).toHaveBeenCalled();
      await rm(path);
    });

    it('creates a migration file with PascalCase param', async () => {
      Date.now = jest.fn(() => 1618196206380);
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
