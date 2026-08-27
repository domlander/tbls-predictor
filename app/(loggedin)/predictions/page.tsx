import { auth } from "auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
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
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  return Promise.all([session, getCurrentGameweekFromFixtures()]).then(
    ([session, currentGameweek]) => {
      return !session?.user?.id
        ? redirect("/signIn")
        : redirect(`/predictions/${currentGameweek}`);
    },
  );
};

export default Page;
