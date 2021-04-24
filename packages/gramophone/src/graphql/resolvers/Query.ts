import { IResolverObject } from 'apollo-server-fastify';
import { Users } from 'schema/User';
import { DateTime } from 'luxon';

interface UserQueryArgs {
  email?: string;
  username?: string;
  id?: number;
}

interface UsersQueryArgs {
  createdAfter?: DateTime;
}

const QueryResolvers: IResolverObject = {
  async users(_, { createdAfter }: UsersQueryArgs) {
    let query = Users();

    if (createdAfter) {
      query = query.where('createdAt', '>', createdAfter.toSQL());
    }

    return query;
  },
  async user(_, { email, username, id }: UserQueryArgs) {
    return Users()
      .maybeWhere('id', id)
      .maybeWhere('email', email)
      .maybeWhere('username', username)
      .first();
  },
};

export default QueryResolvers;
