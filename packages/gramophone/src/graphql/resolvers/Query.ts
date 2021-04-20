import { IResolverObject } from 'apollo-server-fastify';
import { User, Users } from 'schema/User';
import { ApiKeys } from 'schema/ApiKey';

interface UserQueryArgs {
  email?: string;
  username?: string;
  id?: number;
}

const QueryResolvers: IResolverObject = {
  async users() {
    return await Users();
  },
  async user(_, { email, username, id }: UserQueryArgs) {
    console.log(email, username, id);
    return await Users()
      .maybeWhere('id', id)
      .maybeWhere('email', email)
      .maybeWhere('username', username)
      .first();
  },
};

export default QueryResolvers;
