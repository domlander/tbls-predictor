import { ApolloServer } from "apollo-server-micro";
import { getServerSession } from "next-auth/next";
import { schema } from "apollo/schema";
import { authOptions } from "./auth/[...nextauth]";

const apolloServer = new ApolloServer({
  schema,
  context: async ({ req, res }) => {
    const session = await getServerSession(req, res, authOptions);
    const user = session?.user || null;
    return { user };
  },
});

export const config = {
  api: {
    bodyParser: false, // Tell Next.js not to parse the incoming request and let GraphQL handle it for us
  },
};

export default apolloServer.createHandler({
  path: "/api/graphql",
});
