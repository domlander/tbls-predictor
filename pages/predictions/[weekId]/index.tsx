import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import prisma from "prisma/client";

import { FixtureWithPrediction } from "@/types";
import { convertUrlParamToNumber } from "@/utils";
import Predictions from "src/containers/Predictions";
import redirectInternal from "../../../utils/redirects";

interface Props {
  gameweek: number;
  firstGameweek: number;
  lastGameweek: number;
  fixturesWithPredictions: FixtureWithPrediction[];
}

const PredictionsPage = ({
  gameweek,
  firstGameweek,
  lastGameweek,
  fixturesWithPredictions,
}: Props) => (
  <Predictions
    gameweek={gameweek}
    firstGameweek={firstGameweek}
    lastGameweek={lastGameweek}
    fixtures={fixturesWithPredictions}
  />
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

  const weekId = convertUrlParamToNumber(context.params?.weekId);
  if (!session?.user.email || !weekId || weekId <= 0)
    return redirectInternal("/");

  // Get the logged in user
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
  });
  if (!user) return redirectInternal("/leagues");

  // Find all fixtures. If we use the same database for multiple seasons, we'll need to filter by season
  const fixtures = await prisma.fixture.findMany();
  if (!fixtures) return redirectInternal("/leagues");

  fixtures.sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
  );

  // Find all my predictions
  const predictions = await prisma.prediction.findMany({
    where: {
      userId: user.id,
    },
  });

  // Match up fixtures and predictions and merge together
  const fixturesWithPredictions: FixtureWithPrediction[] = [];
  fixtures.map((fixture) => {
    const prediction = predictions.find((p) => p.fixtureId === fixture.id);
    return fixturesWithPredictions.push({
      fixtureId: fixture.id,
      gameweek: fixture.gameweek,
      kickoff: fixture.kickoff,
      homeTeam: fixture.homeTeam,
      awayTeam: fixture.awayTeam,
      homeGoals: fixture.homeGoals,
      awayGoals: fixture.awayGoals,
      predictedHomeGoals: prediction?.homeGoals?.toString() || null,
      predictedAwayGoals: prediction?.awayGoals?.toString() || null,
      predictionScore: prediction?.score || null,
    });
  });

  let firstGameweek = fixtures[0].gameweek;
  let lastGameweek = fixtures[0].gameweek;
  fixtures.forEach((fixture) => {
    if (fixture.gameweek < firstGameweek) firstGameweek = fixture.gameweek;
    if (fixture.gameweek > lastGameweek) lastGameweek = fixture.gameweek;
  });

  return {
    props: {
      fixturesWithPredictions: JSON.parse(
        JSON.stringify(fixturesWithPredictions)
      ),
      gameweek: weekId,
      firstGameweek,
      lastGameweek,
    },
  };
};

export default PredictionsPage;
