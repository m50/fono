import knex from 'knex';
import { DateTime } from 'luxon';

type Result = Record<string, any> | Record<string, any>[] | undefined | null;

function castTimestamps(result?: Record<string, any>) {
  if (!result) {
    return result;
  }
  const newResult = result;
  Object.keys(newResult).forEach((key) => {
    if (typeof newResult[key] !== 'string') {
      return;
    }
    const time = DateTime.fromISO(newResult[key]);
    if (time.isValid) {
      newResult[key] = time;
    }
  });
  return newResult;
}
const testConfig = {
  client: 'sqlite3',
  connection: {
    filename: ':memory:',
  },
  useNullAsDefault: true,
};

const prodConfig = {
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
};

export default knex({
  ...(process.env.NODE_ENV === 'test' ? testConfig : prodConfig),
  postProcessResponse: (result: Result) => {
    if (!result) {
      return result;
    }

    if (Array.isArray(result)) {
      return result.map(castTimestamps);
    }

    return castTimestamps(result);
  },
});
