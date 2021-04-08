// import { getSession } from "next-auth/client";
import prisma from "prisma/client";

/*

  I want a service that updates the score (home_goals and away_goals) on the fixtures table

  When this is complete, I want the predictions table score field updated with the amount
  of points achieved by the prediction.

*/
export default async (req, res) => {
  // const session = await getSession({ req });

  // TODO: VALIDATE USER

  const { scores } = req.body;

  if (!scores?.length) {
    res.status(400).send("League not created. Scores missing.");
  }

  // Update Fixture table with results
  const scoresUpsert = scores.map((score) =>
    prisma.fixture.update({
      where: {
        id: score.fixtureId,
      },
      data: {
        homeGoals: score.homeGoals,
        awayGoals: score.awayGoals,
      },
    })
  );
  Promise.all(scoresUpsert);

  // TODO - Update prediction table with User's score

  res.send(200);
};
