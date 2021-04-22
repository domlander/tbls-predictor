import { getSession } from "next-auth/client";
import prisma from "prisma/client";

// const isPastDeadline = (kickoff) => {
//   const now = new Date();
//   const kickOffDate = new Date(kickoff);
//   const deadline = new Date(
//     kickOffDate.setTime(
//       kickOffDate.getTime() -
//         90 * 60 * 1000 +
//         kickOffDate.getTimezoneOffset() * 60 * 1000
//     )
//   );

//   return now > deadline;
// };

export default async (req, res) => {
  const session = await getSession({ req });
  const { updatedPredictions: predictions } = req.body;

  if (!predictions) {
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

    // TODO: We can't trust the client. We need to run a find on the fixture table to get the bonafide kick off time
    // Do we need to authenticate as well? We shouldn't, as only authenticated users can see the page. To think about
    // if (isPastDeadline(prediction.kickoff)) return;

    // eslint-disable-next-line consistent-return
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
