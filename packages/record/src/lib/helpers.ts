import slugify from 'slugify';

export const slug = (str: string) => slugify(str, { lower: true, strict: true, locale: 'en' });
export const isProduction = (): boolean => import.meta.env.NODE_ENV === 'production';
export const isDev = (): boolean => !isProduction();
export const cl = (strings: TemplateStringsArray, ...expr: string[]): string => strings
  .reduce((prev, cur, idx) => prev + cur + (expr[idx] ?? ''), '')
  .replace(/\s+/g, ' ')
  .trim();
