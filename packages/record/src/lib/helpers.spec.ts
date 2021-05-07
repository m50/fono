import { slug, isProduction, cl, buildQueryParams } from './helpers';

describe('helpers', () => {
  test('slug()', () => {
    const real = slug('Hi, how are you?');
    expect(real).toBe('hi-how-are-you');
  });

  test('isProduction()', () => {
    expect(isProduction()).toBe(false);
  });

  test('cl``', () => {
    const out = cl`
    test
        new
      lines
    `;
    expect(out).toBe('test new lines');
  });

  test('buildQueryParams', () => {
    const real = buildQueryParams({
      test: 1,
      test2: 'hi',
      test3: true,
      test4: {
        a: 1,
        b: 2,
      },
      test5: [1, 2]
    });
    expect(real).toBe('test=1&test2=hi&test3=true&test4[a]=1&test4[b]=2&test5[0]=1&test5[1]=2');
  });
});
