import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import prisma from "prisma/client";
import Fixture from "src/types/Fixture";
import ManageFixtures from "src/containers/AdminManageFixtures";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";

interface Props {
  currentGameweek: number;
  fixtures: Fixture[];
}

const ManageFixturesPage = ({ currentGameweek, fixtures }: Props) => (
  <ManageFixtures gameweek={currentGameweek} fixtures={fixtures} />
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  // TODO Replace with roles https://github.com/nextauthjs/next-auth/discussions/805
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return {
      props: {},
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const allFixtures: Fixture[] = await prisma.fixture.findMany();
  const currentGameweek = calculateCurrentGameweek(allFixtures);

  const fixtures = allFixtures
    .filter((fixture) => fixture.gameweek === currentGameweek)
    .map((fixture) => ({
      ...fixture,
      kickoff: fixture.kickoff.toString(),
    }));

  return {
    props: {
      currentGameweek,
      fixtures,
    },
  };
};

export default ManageFixturesPage;
