import { Knex } from 'knex';
import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';
import { plural, singular } from 'pluralize';

interface Context {
  relations?: string[];
  db?: Knex;
  table?: string;
  [key: string]: any;
}

const getRelationships = (result?: Record<string, any>, context?: Context) => {
  if (!context?.db || !context.relations || !result) {
    return result;
  }
  const newResult = result;

  const { db } = context;
  context.relations.forEach((relation) => {
    const col = camelCase(singular(relation));
    const table = plural(snakeCase(relation));
    const idName = `${col}Id`;

    if (newResult[idName]) {
      newResult[col] = async () => db(table).where('id', newResult[idName]).first();
    } else if (context.table && newResult.id) {
      const localIdName = `${camelCase(singular(context.table))}Id`;
      newResult[plural(col)] = async () => db(table).where(localIdName, newResult.id);
    }
  });

  return newResult;
};

export default getRelationships;
