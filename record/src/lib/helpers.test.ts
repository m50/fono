import { slug, isProduction, cl } from './helpers';

describe('helpers', () => {
  test.concurrent('slug()', async () => {
    const real = slug('Hi, how are you?');
    const expected = 'hi-how-are-you';
    expect(real).toBe(expected);
  });

  test.concurrent('isProduction()', async () => {
    expect(isProduction()).toBe(false);
    process.env.CONTEXT = 'production';
    expect(isProduction()).toBe(true);
  });

  test.concurrent('cl``', async () => {
    const out = cl`
    test
        new
      lines
    `;
    expect(out).toBe('test new lines');
  });
});
