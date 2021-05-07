import { GraphQLScalarType, Kind } from "graphql";

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "A date and time, represented as an ISO-8601 string",
  serialize: (value) => value.toISOString(), // Convert outgoing Date to integer for JSON
  parseValue: (value) => new Date(value), // Convert incoming integer to Date
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});

export default dateScalar;
