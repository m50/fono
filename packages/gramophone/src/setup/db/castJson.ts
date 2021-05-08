

export default function castJson(result?: Record<string, any>) {
  if (!result) {
    return result;
  }
  const newResult = result;
  Object.keys(newResult).forEach((key) => {
    const v = newResult[key];
    if (typeof v === 'string') {
      if ((v.startsWith('{') && v.endsWith('}')) || (v.startsWith('[') && v.endsWith(']'))) {
        newResult[key] = JSON.parse(v);
      }
    }
  });

  return newResult;
}
