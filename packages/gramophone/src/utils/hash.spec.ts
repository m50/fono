import * as Hash from './hash';

describe('hash', () => {
  test('md5', () => {
    const result = Hash.md5('test');
    expect(result).toMatchSnapshot();
  });
  test('sha1', () => {
    const result = Hash.sha1('test');
    expect(result).toMatchSnapshot();
  });
  test('sha256', () => {
    const result = Hash.sha256('test');
    expect(result).toMatchSnapshot();
  });
});
