import { DateTime } from 'luxon';

export default function castTimestamps(result?: Record<string, any>) {
  if (!result) {
    return result;
  }
  const newResult = result;
  Object.keys(newResult).forEach((key) => {
    if (Array.isArray(newResult[key])) {
      newResult[key] = newResult[key].map((r: any) => {
        if (typeof newResult[key] === 'object') {
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
    const time = DateTime.fromSQL(newResult[key]);
    if (time.isValid) {
      newResult[key] = time;
    }
  });

  return newResult;
}
