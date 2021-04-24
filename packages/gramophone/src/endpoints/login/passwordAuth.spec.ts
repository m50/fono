import { up, rollback } from 'commands/migrate';
import { passwordAuth } from './passwordAuth';

describe('passwordAuth', () => {
  afterAll(async () => rollback(true));
  beforeAll(async () => up(true));

  it('returns user with correct username/password', async () => {
    const request = {
      body: {
        username: 'admin',
        password: 'admin',
      },
    };
    // @ts-expect-error
    const user = await passwordAuth(request);
    expect(user?.id).toBe(1);
    expect(user?.email).toBe('admin');
    expect(user?.username).toBe('admin');
  });

  it('throws if user not found', async () => {
    const request = {
      body: {
        username: 'not-real',
        password: 'admin',
      },
    };
    let user = null;
    try {
      // @ts-expect-error
      user = await passwordAuth(request);
    } catch (e) {
      expect(e).toEqual(new Error('User not found: not-real'));
    }
    expect(user).toBe(null);
  });

  it('throws if missing param', async () => {
    const request = {
      body: {
        username: 'admin',
      },
    };
    let user = null;
    try {
      // @ts-expect-error
      user = await passwordAuth(request);
    } catch (e) {
      expect(e).toEqual(new Error('Authentication params missing.'));
    }
    expect(user).toBe(null);
  });

  it('throws if invalid password', async () => {
    const request = {
      body: {
        username: 'admin',
        password: 'wrong!',
      },
    };
    let user = null;
    try {
      // @ts-expect-error
      user = await passwordAuth(request);
    } catch (e) {
      expect(e).toEqual(new Error('Password invalid!'));
    }
    expect(user).toBe(null);
  });
});
