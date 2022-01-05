import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";

import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import redirectInternal from "utils/redirects";
import { Fixture } from "@prisma/client";
import prisma from "prisma/client";
import { ALL_FIXTURES_QUERY, FIXTURES_QUERY } from "apollo/queries";
import { initializeApollo } from "apollo/client";
import Predictions from "@/containers/Predictions";

interface Props {
  fixtures: Fixture[];
  weekId: number;
  firstGameweek: number;
  lastGameweek: number;
}

const PredictionsPage = ({
  fixtures,
  weekId,
  firstGameweek,
  lastGameweek,
}: Props) => (
  <>
    {/* <Head>
      <meta
        name="description"
        content="Leicester host Arsenal, whilst Man Utd and Everton travel to Spurs and Wolves respectively, hoping to bounce back from large home defeats."
      />
      <meta
        property="og:description"
        content="Leicester host Arsenal, whilst Man Utd and Everton travel to Spurs and Wolves respectively, hoping to bounce back from large home defeats."
      />
    </Head> */}
    <Predictions
      fixtures={fixtures}
      weekId={weekId}
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
    data: { allFixtures },
  } = await apolloClient.query({
    query: ALL_FIXTURES_QUERY,
  });

  const firstGameweek = allFixtures.reduce(
    (acc, cur) => (cur.gameweek < acc ? cur.gameweek : acc),
    allFixtures[0].gameweek
  );
  const lastGameweek = allFixtures.reduce(
    (acc, cur) => (cur.gameweek > acc ? cur.gameweek : acc),
    allFixtures[0].gameweek
  );

  const {
    data: { fixtures },
  } = await apolloClient.query({
    query: FIXTURES_QUERY,
    variables: { input: { gameweek: weekId } },
  });

  return {
    props: {
      fixtures: JSON.parse(JSON.stringify(fixtures)),
      weekId,
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
    fallback: false,
  };
};

export default PredictionsPage;
