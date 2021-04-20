export const transform = async (input: string, path: string): Promise<string> => {
  const code = `'use strict';
// Original Definition at ${path}
const { gql } = require('apollo-server-fastify');
module.exports = gql\`${input}\`;
module.exports.default = gql\`${input}\`;
module.exports.raw = \`${input}\`;
`;
  return code;
}
