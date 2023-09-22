import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Leagues from "src/containers/Leagues";
import redirectInternal from "utils/redirects";
import UserLeague from "src/types/UserLeague";
import prisma from "prisma/client";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import getUsersActiveLeagues from "utils/getUsersActiveLeagues";

type Props = {
  activeLeagues: UserLeague[];
};

const LeaguesPage = ({ activeLeagues }: Props) => {
  return <Leagues activeLeagues={activeLeagues} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const userId = session?.user?.id;
  if (!userId) {
    return redirectInternal("/signIn");
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

  return {
    props: {
      activeLeagues,
    },
  };
};

export default LeaguesPage;
