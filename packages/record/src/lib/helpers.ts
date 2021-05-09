import slugify from 'slugify';

export const slug = (str: string) => slugify(str, { lower: true, strict: true, locale: 'en' });
export const isProduction = (): boolean => import.meta.env.NODE_ENV === 'production';
export const isDev = (): boolean => !isProduction();
export const cl = (strings: TemplateStringsArray, ...expr: string[]): string => strings
  .reduce((prev, cur, idx) => prev + cur + (expr[idx] ?? ''), '')
  .replace(/\s+/g, ' ')
  .trim();
export const buildQueryParams = (params: Record<string, any>) => Object
  .entries(params)
  .flatMap(([$k, $v]) => {
    if (Array.isArray($v)) {
      // key[0]=value
      return $v.map((v, idx) => ([`${$k}[${idx}]`, v]));
    }
    if (typeof $v === 'object' && $v !== null) {
      // key[subkey]=value
      return Object.entries($v).map(([k, v]) => ([`${$k}[${k}]`, v]));
    }

    return [[$k, $v]];
  })
  .filter(([, v]) => typeof v !== 'undefined' && v !== null)
  .map(([k, v]) => `${k}=${encodeURIComponent(v.toString())}`)
  .join('&');
