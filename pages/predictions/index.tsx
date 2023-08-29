import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import redirectInternal from "utils/redirects";
import prisma from "prisma/client";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";

const RedirectURL = () => null;

const getCurrentGameweekFromFixtures = async () => {
  const fixtures = await prisma.fixture.findMany({
    select: {
      id: true,
      gameweek: true,
      kickoff: true,
    },
  });

  const currentGameweek = calculateCurrentGameweek(fixtures);

  return currentGameweek;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return Promise.all([
    getSession(context),
    getCurrentGameweekFromFixtures(),
  ]).then(([session, currentGameweek]) => {
    return !session?.user.id
      ? redirectInternal("/signIn")
      : redirectInternal(`/predictions/${currentGameweek}`);
  });
};

export default RedirectURL;
