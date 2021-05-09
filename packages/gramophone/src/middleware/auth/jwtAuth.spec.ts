import { up, reset } from 'commands/migrate';
import { DateTime } from 'luxon';
import { ApiKeys } from 'schema/ApiKey';
import { jwtAuth } from './jwtAuth';

describe('jwtAuth', () => {
  afterEach(async () => reset(true));
  beforeEach(async () => up(true));

  it('returns user with correct jwt token', async () => {
    const token = '1234567890';
    const expiresAt = DateTime.now().plus({ hours: 1 });
    await ApiKeys().insert({
      token,
      userId: 1,
      type: 'refresh',
      expiresAt,
    });
    const jwt = {
      u: 1,
      k: token,
      t: DateTime.now().toMillis(),
    };
    const request = {
      headers: {
        authorization: `Bearer ${Buffer.from(JSON.stringify(jwt)).toString('base64')}`,
      },
    };
    // @ts-expect-error
    const user = await jwtAuth(request);

    expect(user).not.toBeUndefined();
    expect(user).not.toBe(null);
  });

  it('throws if no valid keys', async () => {
    const token = '1234567890';
    const jwt = {
      u: 1,
      k: token,
      t: DateTime.now().toMillis(),
    };
    const request = {
      headers: {
        authorization: `Bearer ${Buffer.from(JSON.stringify(jwt)).toString('base64')}`,
      },
    };
    let user = null;
    try {
      // @ts-expect-error
      user = await jwtAuth(request);
    } catch (e) {
      expect(e).toEqual(new Error('No valid keys for user[1].'));
    }
    expect(user).toBe(null);
  });

  it('throws if expired', async () => {
    const token = '1234567890';
    const expiresAt = DateTime.now().minus({ hours: 1 });
    await ApiKeys().insert({
      token,
      userId: 1,
      type: 'refresh',
      expiresAt,
    });
    const jwt = {
      u: 1,
      k: token,
      t: DateTime.now().toMillis(),
    };
    const request = {
      headers: {
        authorization: `Bearer ${Buffer.from(JSON.stringify(jwt)).toString('base64')}`,
      },
    };
    let user = null;
    try {
      // @ts-expect-error
      user = await jwtAuth(request);
    } catch (e) {
      expect(e).toEqual(new Error('Key[1] expired for user[1]; removing'));
    }
    expect(user).toBe(null);
  });
});
