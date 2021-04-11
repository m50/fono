import db from '../setup/db';

export const timestamp = 1;

export const up = () => db.schema.createTable('test', (table) => {
  table.increments();
  table.integer('test');
  table.timestamp('createdAt').defaultTo(db.fn.now());
  table.timestamp('updatedAt').defaultTo(db.fn.now());
});

export const down = () => db.schema.dropTableIfExists('test');

export interface Test {
  id: number;
  test: number;
  createdAt: string;
  updatedAt: string;
}
