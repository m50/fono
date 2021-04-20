import { IResolverObject } from 'apollo-server-fastify';
import { User } from 'schema/User';
import { ApiKeys } from 'schema/ApiKey';


const UserResolvers: IResolverObject<User> = {
  async apiKeys(parent) {
    const keys = await ApiKeys()
      .where('userId', parent.id);

    return keys;
  },
  async apiKey(parent, { id }: { id: number }) {
    const keys = await ApiKeys()
      .where('userId', parent.id)
      .where('id', id);

    return keys;
  },
};

export default UserResolvers;
