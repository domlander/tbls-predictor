import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import prisma from "prisma/client";

import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import Fixture from "src/types/Fixture";
import ManageFixtures from "@/containers/ManageFixtures";

interface Props {
  gameweek: number;
  fixtures: Pick<Fixture, "id" | "kickoff" | "homeTeam" | "awayTeam">[];
}

const ManageFixturesPage = ({ gameweek, fixtures }: Props) => (
  <ManageFixtures gameweek={gameweek} fixtures={fixtures} />
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  // TODO Replace with roles https://github.com/nextauthjs/next-auth/discussions/805
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  // The current gameweek is the default to show fixtures
  const allFixtures = await prisma.fixture.findMany();
  const gameweek = calculateCurrentGameweek(allFixtures);

  const fixtures = allFixtures
    .filter((x) => x.gameweek === gameweek)
    .map((y) => ({
      ...y,
      kickoff: y.kickoff.toString(),
    }));

  return {
    props: {
      gameweek,
      fixtures,
    },
  };
};

export default ManageFixturesPage;
