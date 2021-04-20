import { DateTime } from 'luxon';
import castTimestamps from './castTimestamps';

describe('castTimestamps()', () => {
  it('casts all timestamps correctly', () => {
    const obj = {
      createdAt: '2021-04-16 17:26:28.031 -05:00',
      createdAt2: new Date(),
      updatedAt: '2021-04-16 17:26:28.031 -05:00',
      expiresAt: '2021-04-16T18:22:32.401-05:00',
      relation: { createdAt: '2021-04-16 17:26:28.031 -05:00' },
      relations: [{ createdAt: '2021-04-16 17:26:28.031 -05:00' }],
    };
    const casted = castTimestamps(obj);
    expect(typeof casted?.createdAt).not.toBe('string');
    expect(casted?.createdAt).toBeInstanceOf(DateTime);
    expect(casted?.createdAt2).toBeInstanceOf(DateTime);
    expect(typeof casted?.updatedAt).not.toBe('string');
    expect(typeof casted?.expiresAt).not.toBe('string');
    expect(typeof casted?.relation.createdAt).not.toBe('string');
    expect(typeof casted?.relations[0].createdAt).not.toBe('string');
  });
});
