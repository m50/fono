import { DateTime } from 'luxon';

const cast = (timestamp: string) => {
  let result = DateTime.fromSQL(timestamp);
  if (!result.isValid) {
    result = DateTime.fromISO(timestamp);
  }

  return result;
};

export default function castTimestamps(result?: Record<string, any>) {
  if (!result) {
    return result;
  }
  const newResult = result;
  Object.keys(newResult).forEach((key) => {
    if (newResult[key] instanceof Date) {
      newResult[key] = DateTime.fromJSDate(newResult[key]);
      return;
    }
    if (Array.isArray(newResult[key])) {
      newResult[key] = newResult[key].map((r: any) => {
        if (typeof r === 'object') {
          return castTimestamps(r);
        }
        return r;
      });
      return;
    }
    if (typeof newResult[key] === 'object') {
      newResult[key] = castTimestamps(newResult[key]);
      return;
    }
    if (typeof newResult[key] !== 'string') {
      return;
    }
    const time = cast(newResult[key]);
    if (time.isValid) {
      newResult[key] = time;
    }
  });

  return newResult;
}
