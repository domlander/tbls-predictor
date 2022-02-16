import { ApolloServer } from "apollo-server-micro";
import { schema } from "apollo/schema";
import Cors from "micro-cors";
import { PageConfig } from "next";
import { getSession } from "next-auth/react";

export const config: PageConfig = {
  api: {
    bodyParser: false, // Tell Next.js not to parse the incoming request and let GraphQL handle it for us
  },
};

const cors = Cors();

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const session = await getSession({ req });
    const user = session?.user || null;
    return { user };
  },
});

const startServer = server.start();

export default cors(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await server.createHandler({ path: "/api/graphql" })(req, res);
});
