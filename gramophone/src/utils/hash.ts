import { createHash } from 'crypto';

export function hash(algo: string, value: any) {
  const hashFunc = createHash(algo);
  return hashFunc.update(JSON.stringify(value)).digest('hex');
}

export function sha256(value: any) {
  return hash('sha256', value);
}

export function sha1(value: any) {
  return hash('sha1', value);
}

export function md5(value: any) {
  return hash('md5', value);
}
