import { slug, isClientSide, isProduction, isDeployed, isServerSide, cl } from './helpers';

describe('helpers', () => {
  test.concurrent('slug()', async () => {
    const real = slug('Hi, how are you?');
    const expected = 'hi-how-are-you';
    expect(real).toBe(expected);
  });

  test.concurrent('isClientSide()', async () => {
    expect(isClientSide()).toBe(true);
  });

  test.concurrent('isServerSide()', async () => {
    expect(isServerSide()).toBe(false);
  });

  test.concurrent('isProduction()', async () => {
    expect(isProduction()).toBe(false);
    process.env.CONTEXT = 'production';
    expect(isProduction()).toBe(true);
  });

  test.concurrent('isDeployed()', async () => {
    expect(isDeployed()).toBe(false);
    process.env.NETLIFY = 'true';
    expect(isDeployed()).toBe(true);
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
