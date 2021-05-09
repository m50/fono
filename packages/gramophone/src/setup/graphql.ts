import { ApolloServer, IResolvers } from 'apollo-server-fastify';
import { glob } from 'glob';
import { basename, dirname } from 'path';
import type { DocumentNode } from 'graphql';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { withAuth } from 'middleware/auth';

export const register: FastifyPluginCallback<{}> = (app: FastifyInstance, _, done) => {
  const typeDefs = glob.sync(`${dirname(__dirname)}/graphql/schema/**`, { dot: true, nodir: true })
    .map((p) => require(p))
    .map((node: DocumentNode) => node);

  const resolvers: IResolvers = {};
  glob.sync(`${dirname(__dirname)}/graphql/resolvers/**`, { dot: true, nodir: true })
    .map((p) => [p, require(p)])
    .forEach(([p, resolver]) => {
      const resolverName = basename(p).replace(/\.\w+$/, '');
      resolvers[resolverName] = resolver;
    });

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
  });
  withAuth(app).register(apollo.createHandler());

  apollo.setGraphQLPath('/ql'); // `/g/ql`

  done();
};
