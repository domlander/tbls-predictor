import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import prisma from "prisma/client";

import { ALL_FIXTURES_QUERY } from "apollo/queries";
import { initializeApollo } from "apollo/client";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import redirectInternal from "utils/redirects";
import sortFixtures from "utils/sortFixtures";
import Fixture from "src/types/Fixture";
import Predictions from "src/containers/Predictions";
import TeamFixtures from "src/types/TeamFixtures";
import generateRecentFixturesByTeam from "utils/generateRecentFixturesByTeam";

interface Props {
  fixtures: Fixture[];
  weekId: number;
  recentFixturesByTeam: TeamFixtures[];
  firstGameweek: number;
  lastGameweek: number;
}

const PredictionsPage = ({
  fixtures,
  weekId,
  recentFixturesByTeam,
  firstGameweek,
  lastGameweek,
}: Props) => (
  <>
    <Predictions
      fixtures={fixtures}
      weekId={weekId}
      recentFixturesByTeam={recentFixturesByTeam}
      firstGameweek={firstGameweek}
      lastGameweek={lastGameweek}
    />
  </>
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const weekId = convertUrlParamToNumber(params?.weekId);
  if (!weekId || weekId <= 0) return redirectInternal("/");

  const apolloClient = initializeApollo();
  const {
    data: {
      allFixtures: { fixtures },
      currentGameweek,
    },
  }: {
    data: { allFixtures: { fixtures: Fixture[] }; currentGameweek: number };
  } = await apolloClient.query({
    query: ALL_FIXTURES_QUERY,
  });

  const firstGameweek = fixtures.reduce(
    (acc, fixture) => (fixture.gameweek < acc ? fixture.gameweek : acc),
    fixtures[0].gameweek
  );
  const lastGameweek = fixtures.reduce(
    (acc, fixture) => (fixture.gameweek > acc ? fixture.gameweek : acc),
    fixtures[0].gameweek
  );

  const sortedFixtures = sortFixtures(
    fixtures.filter((fixture) => fixture.gameweek === weekId)
  );

  const recentFixturesByTeam = generateRecentFixturesByTeam(
    fixtures,
    currentGameweek
  );

  return {
    props: {
      fixtures: sortedFixtures,
      weekId,
      recentFixturesByTeam,
      firstGameweek,
      lastGameweek,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const fixtures = await prisma.fixture.findMany();
  const weeks = fixtures.reduce((acc: number[], fixture) => {
    if (acc.indexOf(fixture.gameweek) === -1) {
      acc.push(fixture.gameweek);
    }
    return acc;
  }, []);

  const paths = weeks.map((x) => ({
    params: { weekId: x.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
};

export default PredictionsPage;
