import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { authOptions } from "pages/api/auth/[...nextauth]";
import prisma from "prisma/client";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";

// We get the users session, so don't use caching
export const dynamic = "force-dynamic";

const getCurrentGameweekFromFixtures = async () => {
  const fixtures = await prisma.fixture.findMany({
    select: {
      id: true,
      gameweek: true,
      kickoff: true,
    },
  });

  return calculateCurrentGameweek(fixtures);
};

const Page = async () => {
  return Promise.all([
    getServerSession(authOptions),
    getCurrentGameweekFromFixtures(),
  ]).then(([session, currentGameweek]) => {
    return !session?.user.id
      ? redirect("/signIn")
      : redirect(`/predictions/${currentGameweek}`);
  });
};

export default Page;
