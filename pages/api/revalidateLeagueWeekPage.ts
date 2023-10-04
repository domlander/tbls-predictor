/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

/*
 * Rebuild all the league week pages for the current gameweek when a score has been updated.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.ACTIONS_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const fixtures = await prisma.fixture.findMany();
  const currentGameweek = calculateCurrentGameweek(fixtures);

  const leagues = await prisma.league.findMany({});

  try {
    // This may not be a good solution when we have many leagues
    const revalidatePaths = leagues.map(({ id }) => {
      // this should be the actual path not a rewritten path
      // e.g. for "/blog/[slug]" this should be "/blog/post-1"
      return res.revalidate(`/league/${currentGameweek}/week/${id}`);
    });

    await Promise.allSettled([...revalidatePaths]);

    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
};

export default handler;
