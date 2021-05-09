import { knex, Knex } from 'knex';
import castTimestamps from './castTimestamps';
import castJson from './castJson';
import getRelationships from './relations';

type Result = Record<string, any> | Record<string, any>[] | undefined | null;

const config: Record<string, Knex.Config> = {
  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:',
    },
    useNullAsDefault: true,
  },
  production: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
  },
};

const db = knex({
  ...(config[process.env.NODE_ENV ?? 'test'] ?? config.production),
  postProcessResponse(result: Result, context: Record<string, any>) {
    if (!result || (typeof result !== 'object' && !Array.isArray(result))) {
      return result;
    }

    if (Array.isArray(result)) {
      return result.map((record) => getRelationships(castTimestamps(castJson(record)), context));
    }

    return getRelationships(castTimestamps(castJson(result)), context);
  },
});

knex.QueryBuilder.extend('withRelations', function withRelations(...relations: string[]) {
  // eslint-disable-next-line
  const { table } = this._single;
  return this.queryContext({ relations, db, table });
});

knex.QueryBuilder.extend('maybeWhere', function maybeWhere(column, value) {
  if (typeof value === 'undefined') {
    return this;
  }

  return this.where(column, value);
});

export default db;
