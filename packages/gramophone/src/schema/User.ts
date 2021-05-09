import { DateTime } from 'luxon';
import db from 'setup/db';
import { bcrypt } from 'utils/bcrypt';
import { ApiKey } from './ApiKey';

export const timestamp = 1618172673408;

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;

  apiKeys: () => Promise<ApiKey[]>;

  createdAt: DateTime | Date;
  updatedAt: DateTime | Date;
}

export const Users = () => db<User>('users').withRelations('apiKeys');

export const up = async () => {
  await db.schema.createTable('users', (table) => {
    table.increments().notNullable();
    table.string('email').index().unique().notNullable();
    table.string('username').index().unique().notNullable();
    table.string('password').notNullable();

    table.timestamp('createdAt').defaultTo(db.fn.now()).notNullable();
    table.timestamp('updatedAt').defaultTo(db.fn.now()).notNullable();
  });

  await Users().insert({
    email: 'admin@root.test',
    username: 'admin',
    password: await bcrypt('admin'),
  });
};

export const down = async () => {
  await db.schema.dropTableIfExists('users');
};
