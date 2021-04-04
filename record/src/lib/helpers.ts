import slugify from 'slugify';

export const slug = (str: string) => slugify(str, { lower: true, strict: true, locale: 'en' });
export const isClientSide = (): boolean => typeof window !== 'undefined';
export const isServerSide = (): boolean => !isClientSide;
export const isProduction = (): boolean => process.env.CONTEXT === 'production';
export const isDeployed = (): boolean => !!process.env.NETLIFY;
export const cl = (strings: TemplateStringsArray, ...expr: string[]): string => {
  let str = '';
  strings.forEach((string, i) => {
    str += string + (expr[i] || '');
  });

  str = str.replace(/\s+/g, ' ').trim();

  return str;
};
