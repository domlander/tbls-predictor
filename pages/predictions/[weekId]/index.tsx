import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import prisma from "prisma/client";

import { EditablePrediction } from "@/types";
import { convertUrlParamToNumber } from "@/utils";
import { Fixture } from "@prisma/client";
import Predictions from "src/containers/Predictions";
import redirectInternal from "../../../utils/redirects";

interface Props {
  gameweek: number;
  fixtures: Fixture[];
  predictions: EditablePrediction[];
}

const PredictionsPage = ({ gameweek, fixtures, predictions }: Props) => (
  <Predictions
    gameweek={gameweek}
    fixtures={fixtures}
    initialPredictions={predictions}
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

  if (!session?.user.email) return redirectInternal("/");

  // Get the logged in user
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
  });

  const weekId = convertUrlParamToNumber(context.params?.weekId);

  if (!user || !weekId || weekId <= 0) {
    return redirectInternal("/leagues");
  }

  const fixtures = await prisma.fixture.findMany({
    where: {
      gameweek: weekId,
    },
  });
  if (!fixtures) return redirectInternal("/leagues");

  fixtures.sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
  );

  const predictions = await prisma.prediction.findMany({
    where: {
      AND: {
        userId: user.id,
        fixtureId: { in: fixtures.map((fixture) => fixture.id) }, // filter predictions by fixture ID's of this gameweek
      },
    },
  });

  const editablePredictions: EditablePrediction[] = [];
  fixtures.map((fixture) => {
    const prediction = predictions.find((p) => p.fixtureId === fixture.id);
    return editablePredictions.push({
      fixtureId: fixture.id,
      homeGoals: prediction?.homeGoals?.toString() || "",
      awayGoals: prediction?.awayGoals?.toString() || "",
      score: prediction?.score,
      kickoff: fixture.kickoff,
    });
  });

  return {
    props: {
      fixtures: JSON.parse(JSON.stringify(fixtures)),
      predictions: JSON.parse(JSON.stringify(editablePredictions)),
      gameweek: weekId,
    },
  };
};

export default PredictionsPage;
