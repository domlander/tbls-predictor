import { getSession } from "next-auth/client";
import prisma from "prisma/client";

export default async (req, res) => {
  const session = await getSession({ req });

  const { applicantId, leagueId, accept: acceptApplicant } = req.body;

  if (
    !session.user ||
    !applicantId ||
    !leagueId ||
    typeof acceptApplicant !== "boolean"
  ) {
    return res.status(400).send("Cannot process request. Details missing.");
  }

  const league = await prisma.league.findUnique({
    where: {
      id: leagueId,
    },
    include: {
      users: true,
      applicants: true,
    },
  });

  if (session.user.id !== league.administratorId) {
    return res
      .status(400)
      .send(
        "Cannot process request. Current user is not an administrator of this league."
      );
  }

  if (
    !league.applicants.some(
      (applicant) =>
        applicant.userId === applicantId && applicant.status === "applied"
    )
  ) {
    return res
      .status(400)
      .send(
        "Cannot process request. Trying to accept a user in to the league that is not an applicant."
      );
  }

  if (acceptApplicant) {
    // Add user to the league and update their application status
    await prisma.league.update({
      where: {
        id: leagueId,
      },
      data: {
        users: {
          connect: {
            id: applicantId,
          },
        },
        applicants: {
          update: {
            where: {
              userId_leagueId: { userId: applicantId, leagueId },
            },
            data: {
              status: "accepted",
            },
          },
        },
      },
    });
  } else {
    // Reject league join application
    await prisma.applicant.update({
      where: {
        userId_leagueId: { userId: applicantId, leagueId },
      },
      data: {
        status: "rejected",
      },
    });
  }

  return res.send(200);
};
