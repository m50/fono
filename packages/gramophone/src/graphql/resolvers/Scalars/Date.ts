import { GraphQLScalarType, Kind } from 'graphql';
import { DateTime } from 'luxon';

export default new GraphQLScalarType({
  name: 'Date',
  description: 'Date Scalar Type',
  serialize(value: DateTime) {
    return value.toISO();
  },
  parseValue(value: string): Date {
    return new Date(Date.parse(value));
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return DateTime.fromMillis(parseInt(ast.value, 10));
    } if (ast.kind === Kind.STRING) {
      return DateTime.fromISO(ast.value);
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});
