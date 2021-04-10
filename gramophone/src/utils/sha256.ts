import { createHash } from 'crypto';

export function sha256(value: any) {
  const hash = createHash('sha256');
  return hash.update(JSON.stringify(value)).digest('hex');
}
