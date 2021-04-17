import slugify from 'slugify';

export const slug = (str: string) => slugify(str, { lower: true, strict: true, locale: 'en' });
export const isProduction = (): boolean => {
  if (typeof process !== 'undefined') {
    return process.env.NODE_ENV === 'production';
  }

  return import.meta.env.NODE_ENV === 'production';
};
export const cl = (strings: TemplateStringsArray, ...expr: string[]): string => {
  let str = '';
  strings.forEach((string, i) => {
    str += string + (expr[i] || '');
  });

  str = str.replace(/\s+/g, ' ').trim();

  return str;
};
