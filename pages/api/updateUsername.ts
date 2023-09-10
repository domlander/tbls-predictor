import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { withSentry } from "@sentry/nextjs";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed.");
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(500).end();
  }

  const { username } = req.body;

  if (username.length < 3 || username.length > 20)
    return res
      .status(422)
      .json("Select a username between 3 and 20 characters");

  const user = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      username,
    },
  });

  return res.status(200).json(user);
};

export default withSentry(handler);
