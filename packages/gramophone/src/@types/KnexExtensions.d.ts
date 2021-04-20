/* eslint-disable */
import { Knex } from 'knex';

declare module 'knex' {
  namespace Knex {
    interface QueryBuilder<TRecord, TResult> {
      withRelations(...relations: string[]): Knex.QueryBuilder<TRecord, TResult>;
      _single: { table: string, only: false };
    }
  }
}
