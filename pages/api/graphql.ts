import { ApolloServer } from "apollo-server-micro";
import { schema } from "apollo/schema";
import { getSession } from "next-auth/client";

const apolloServer = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const session = await getSession({ req });
    return { session };
  },
});

// Tell Next.js not to parse the incoming request and let GraphQL handle it for us
export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({
  path: "/api/graphql",
});
