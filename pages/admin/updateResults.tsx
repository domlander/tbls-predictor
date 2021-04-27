import React from "react";
import { GetServerSideProps } from "next";
import prisma from "prisma/client";

import { Fixture } from "@prisma/client";
import { EditablePrediction } from "@/types";
import UpdateResults from "@/containers/UpdateResults";
import { getSession } from "next-auth/client";

interface Props {
  fixtures: Fixture[];
  scores: EditablePrediction[];
}

const UpdateResultsPage = ({ fixtures, scores }: Props) => (
  <UpdateResults fixtures={fixtures} initialScores={scores} />
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

  // TODO Validate user has the permissions to update results

  // Show all past fixtures. We may want to filter this to recent fixtures or fixtures without scores.
  const fixtures = await prisma.fixture.findMany({
    where: {
      kickoff: {
        lte: new Date(),
      },
    },
  });

  const scores: EditablePrediction[] = [];
  fixtures.map((fixture) =>
    scores.push({
      fixtureId: fixture.id,
      homeGoals: fixture.homeGoals?.toString() || "",
      awayGoals: fixture.awayGoals?.toString() || "",
    })
  );

  fixtures.sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
  );

  return {
    props: {
      fixtures: JSON.parse(JSON.stringify(fixtures)),
      scores: JSON.parse(JSON.stringify(scores)),
    },
  };
};

export default UpdateResultsPage;
