import { basename, dirname, join } from 'path';

export const transform = async (input: string, path: string): Promise<string> => {
  const rpath = join(basename(dirname(path)), basename(path));
  const code = `'use strict';
// Original Definition at ${rpath}
const { gql } = require('apollo-server-fastify');
module.exports = gql\`${input}\`;
module.exports.default = gql\`${input}\`;
module.exports.raw = \`${input}\`;
`;
  return code;
};
