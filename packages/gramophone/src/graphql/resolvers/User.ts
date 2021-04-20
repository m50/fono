import { IResolverObject } from 'apollo-server-fastify';
import { User } from 'schema/User';
import { ApiKeys } from 'schema/ApiKey';


const UserResolvers: IResolverObject<User> = {
  async apiKeys(parent) {
    return await ApiKeys()
      .where('userId', parent.id);
  },
  async apiKey(parent, { id }: { id: number }) {
    return await ApiKeys()
      .where('userId', parent.id)
      .where('id', id);
  },
};

export default UserResolvers;
