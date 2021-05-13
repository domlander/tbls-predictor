// import { getSession } from "next-auth/client";
import prisma from "prisma/client";
import calculatePredictionScore from "../../utils/calculatePredictionScore";

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

  const originalScores = await prisma.fixture.findMany({
    where: {
      kickoff: {
        lte: new Date(),
      },
    },
  });

  // Filter out scores that haven't been updated
  const filteredScores = scores.filter((score) => {
    const originalScore = originalScores.find(
      (os) => os.id === score.fixtureId
    );

    if (!originalScore) return false; // New fixture found since opening the page and submitting. Discard it as we can't have edited it. This fixture will appear on the page when the page is refreshed

    return (
      score.homeGoals !== originalScore.homeGoals ||
      score.awayGoals !== originalScore.awayGoals
    );
  });

  // Update Fixture table with results
  const scoresUpsert = filteredScores.map(
    ({ fixtureId, homeGoals, awayGoals }) =>
      prisma.fixture.update({
        where: {
          id: fixtureId,
        },
        data: {
          homeGoals,
          awayGoals,
        },
      })
  );
  Promise.all(scoresUpsert);

  // Find all predictions related to fixtures that have just been updated
  const predictionsToEvaluate = await prisma.prediction.findMany({
    where: {
      fixtureId: {
        in: filteredScores.map((fs) => fs.fixtureId),
      },
    },
  });

  const evaluatedPredictions = [];
  predictionsToEvaluate.forEach((prediction) => {
    const fixture = filteredScores.find(
      (fs) => fs.fixtureId === prediction.fixtureId
    );

    const predictedHomeGoals = prediction.homeGoals || 0; // If a user hasn't entered a prediction before the deadline, it becomes a zero
    const predictedAwayGoals = prediction.awayGoals || 0;

    const actualResult = [fixture.homeGoals, fixture.awayGoals];
    const predictedResult = [predictedHomeGoals, predictedAwayGoals];
    const score = calculatePredictionScore(predictedResult, actualResult);

    evaluatedPredictions.push({
      ...prediction,
      homeGoals: predictedHomeGoals,
      awayGoals: predictedAwayGoals,
      score,
    });
  });

  // Update Prediction table with score and no prediction converted to zero's
  const predictionsUpdate = evaluatedPredictions.map(
    ({ fixtureId, userId, homeGoals, awayGoals, score }) =>
      prisma.prediction.update({
        where: {
          fixtureId_userId: {
            fixtureId,
            userId,
          },
        },
        data: {
          homeGoals,
          awayGoals,
          score,
        },
      })
  );
  Promise.all(predictionsUpdate);

  return res.send(200);
};
