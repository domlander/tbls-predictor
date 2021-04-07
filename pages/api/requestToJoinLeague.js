import { getSession } from "next-auth/client";
import prisma from "prisma/client";

const isUserAlreadyBelongToLeague = (participants, userId) =>
  participants.some((p) => p.id === userId);

const isUserAppliedToLeague = (applicants, userId) =>
  applicants.some(
    (p) =>
      p.userId === userId && (p.status === "applied" || p.status === "accepted")
  );

/*
  A user has requested to join an existing league.

  If user is already participant or an applicant, don't add them as an applicant to
  avoid adding a player to the same league twice or creating duplicate requests
*/
export default async (req, res) => {
  const session = await getSession({ req });
  const leagueId = parseInt(req.body.id);

  if (!session?.user.id)
    return res.status(400).send("Cannot process request. User not found.");

  if (!leagueId || typeof leagueId !== "number" || leagueId < 1)
    return res.status(400).send("Cannot process request. League ID not valid.");

  const userId = session?.user.id;
  const league = await prisma.league.findUnique({
    where: {
      id: leagueId,
    },
    include: {
      users: true,
      applicants: true,
    },
  });

  if (!league)
    return res.status(400).send("Cannot process request. League not found.");

  if (isUserAlreadyBelongToLeague(league.users, userId)) {
    return res
      .status(400)
      .send("Cannot process request. User already belongs to league.");
  }

  if (isUserAppliedToLeague(league.applicants, userId)) {
    return res
      .status(400)
      .send(
        "Cannot process request. User already has an open application to league."
      );
  }

  await prisma.applicant.upsert({
    where: {
      userId_leagueId: { userId, leagueId },
    },
    create: {
      userId,
      leagueId,
      status: "applied",
    },
    update: {
      status: "applied",
    },
  });

  console.log(
    `Created application to league ${league.name} for user ${session?.user.email}`
  );

  return res.send(200);
};
