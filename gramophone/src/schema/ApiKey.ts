import { DateTime } from 'luxon';
import db from 'setup/db';
import { User } from './User';

export const timestamp = 1618182158535;

export const ApiKeys = () => db<ApiKey>('api_keys');

export interface ApiKey {
  id: number;
  userId: number;
  token: string;
  type: 'refresh' | 'personal_access_token' | 'one_use';

  user?: () => Promise<User>;

  expiresAt: DateTime;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export const up = async () => {
  await db.schema.createTable('api_keys', (table) => {
    table.increments().notNullable();
    table.integer('userId').unsigned().notNullable();
    table.string('token').notNullable();
    table.enum('type', ['fresh', 'refresh', 'personal_access_token', 'one_use']).notNullable();

    table.timestamp('expiresAt').nullable();
    table.timestamp('createdAt').defaultTo(db.fn.now()).notNullable();
    table.timestamp('updatedAt').defaultTo(db.fn.now()).notNullable();

    table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
  });
};

export const down = async () => {
  await db.schema.dropTableIfExists('api_keys');
};
