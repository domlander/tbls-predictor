import { getSession } from "next-auth/client";
import prisma from "prisma/client";

export default async (req, res) => {
  const session = await getSession({ req });
  const { gameweek, updatedPredictions: predictions } = req.body;

  if (typeof gameweek !== "number" || !predictions) {
    res.status(400).send("Predictions not created/updated. Details missing.");
  }

  const predictionsUpsert = predictions.map((prediction) => {
    const data = {
      userId: session.user.id,
      fixtureId: prediction.fixtureId,
      homeGoals: prediction.homeGoals,
      awayGoals: prediction.awayGoals,
      big_boy_bonus: false,
    };

    return prisma.prediction.upsert({
      where: {
        fixtureId_userId: {
          fixtureId: prediction.fixtureId,
          userId: session.user.id,
        },
      },
      create: data,
      update: data,
    });
  });

  Promise.all(predictionsUpsert);

  res.send(200);
};
