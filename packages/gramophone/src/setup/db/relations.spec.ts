import { up, reset } from 'commands/migrate';
import { ApiKeys } from 'schema/ApiKey';
import { Users } from 'schema/User';

describe('getRelationships()', () => {
  beforeAll(async () => {
    await up(true);
    await ApiKeys().insert({
      token: '1234567890',
      userId: 1,
      type: 'one_use',
    });
  });
  afterAll(async () => reset(true));

  it('can get user', async () => {
    const key = await ApiKeys()
      .withRelations('users')
      .first();

    expect(key).not.toBeUndefined();
    expect(key?.user).not.toBeUndefined();

    const user = await key?.user?.();
    expect(user).not.toBeUndefined();
  });

  it('can get api_keys', async () => {
    const user = await Users()
      .withRelations('api_keys')
      .first();

    expect(user).not.toBeUndefined();
    expect(user?.apiKeys).not.toBeUndefined();
    const keys = await user?.apiKeys?.();
    expect(keys).not.toBeUndefined();
  });
});
