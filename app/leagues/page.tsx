import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import prisma from "prisma/client";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import Leagues from "src/containers/Leagues";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import getUsersActiveLeagues from "utils/getUsersActiveLeagues";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;
  if (!userId) {
    return redirect("/signIn");
  }

  const fixtures = await prisma.fixture.findMany({
    select: {
      id: true,
      gameweek: true,
      kickoff: true,
      homeGoals: true,
      awayGoals: true,
    },
  });
  const currentGameweek = calculateCurrentGameweek(fixtures);

  const activeLeagues = await getUsersActiveLeagues(
    userId,
    fixtures,
    currentGameweek
  );

  return <Leagues activeLeagues={activeLeagues} />;
};

export default Page;
