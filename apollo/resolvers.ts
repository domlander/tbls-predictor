import { UserInputError, ApolloError } from "apollo-server-micro";
import prisma from "prisma/client";
import {
  isUserAlreadyBelongToLeague,
  isUserAppliedToLeague,
} from "utils/userLeagueApplication";

const resolvers = {
  Query: {
    user: async (root, { id }, ctx) => {
      const user = await prisma.user.findUnique({ where: { id } });
      return user;
    },
    userLeagues: async (root, { id }, ctx) => {
      const user = await prisma.user.findUnique({
        include: {
          leagues: true,
        },
        where: {
          id,
        },
      });

      return user?.leagues || [];
    },
    leagueAdmin: async (root, { input: { userId, leagueId } }, ctx) => {
      const league = await prisma.league.findUnique({
        where: {
          id: leagueId,
        },
        include: {
          users: true,
          applicants: {
            include: {
              user: true,
            },
          },
        },
      });
      if (!league) throw new ApolloError("Cannot find league.");

      if (league.administratorId !== userId)
        throw new ApolloError(
          "Cannot process request. User is not an administrator of the league."
        );

      const applicants = league.applicants
        .filter((applicant) => applicant.status === "applied")
        .map((applicant) => ({
          user: {
            id: applicant.userId,
            username: applicant.user.username,
          },
          status: applicant.status,
        }));

      const participants = league.users.map((participant) => ({
        id: participant.id,
        username: participant.username || "",
      }));

      return {
        id: league.id,
        name: league.name,
        applicants,
        participants,
      };
    },
  },
  Mutation: {
    updateUsername: async (root, { userId, username }, ctx) => {
      // TODO: Should not be able to start in a past gameweek
      if (username.length < 3 || username.length > 20)
        throw new UserInputError(
          "Select a username between 3 and 20 characters",
          {
            argumentName: "username",
          }
        );

      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          username,
        },
      });

      return user.username;
    },
    updatePredictions: async (root, { input: predictions }, ctx) => {
      const predictionsUpsert = predictions.map(
        ({ userId, fixtureId, homeGoals, awayGoals, big_boy_bonus }) => {
          const data = {
            userId,
            fixtureId,
            homeGoals,
            awayGoals,
            big_boy_bonus,
          };

          // TODO: We can't trust the client. We need to run a find on the fixture table to get the bonafide kick off time.
          // We need to get all the fixures by the id's in the predictions object. Consider the n+1 problem when doing this
          // if (isPastDeadline(prediction.kickoff)) return;

          // eslint-disable-next-line consistent-return
          return prisma.prediction.upsert({
            where: {
              fixtureId_userId: { fixtureId, userId },
            },
            create: data,
            update: data,
          });
        }
      );

      Promise.all(predictionsUpsert);

      return true;
    },
    createLeague: async (
      root,
      { input: { userId, name, gameweekStart, gameweekEnd } },
      ctx
    ) => {
      // TODO: Should not be able to start in a past gameweek
      if (gameweekStart < 1 || gameweekStart > 38)
        throw new UserInputError("Gameweek start week is not valid", {
          argumentName: "gameweekStart",
        });

      if (gameweekEnd < 1)
        throw new UserInputError("Gameweek end week is not valid", {
          argumentName: "gameweekEnd",
        });

      if (gameweekStart > gameweekEnd)
        throw new UserInputError(
          "The final gameweek must be the same or after the first."
        );

      const league = await prisma.league.create({
        data: {
          name,
          status: "open",
          administratorId: userId,
          season: "2020/2021",
          gameweekStart,
          gameweekEnd: Math.min(gameweekEnd, 38),
          users: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return {
        id: league.id,
        name: league.name,
      };
    },
    processJoinLeagueRequest: async (
      root,
      { userId, leagueId, applicantId, isAccepted },
      ctx
    ) => {
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
        throw new ApolloError("Cannot process request. Try again later.");

      if (userId !== league?.administratorId)
        throw new ApolloError(
          "Cannot process request. Current user is not an administrator of this league."
        );

      if (
        !league.applicants.some(
          (applicant) =>
            applicant.userId === applicantId && applicant.status === "applied"
        )
      ) {
        throw new ApolloError(
          "Cannot process request. Trying to accept a user in to the league that is not an applicant."
        );
      }

      if (isAccepted) {
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

      return true;
    },
    requestToJoinLeague: async (root, { leagueId, userId }, ctx) => {
      if (leagueId < 1)
        throw new UserInputError("League ID not valid", {
          argumentName: "id",
        });

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
        throw new ApolloError(
          "League not found. Please ensure you have the correct League ID."
        );

      if (isUserAlreadyBelongToLeague(league.users, userId))
        throw new ApolloError("You are already a member of this league.");

      if (isUserAppliedToLeague(league.applicants, userId))
        throw new ApolloError(
          "You already have an application to join this league. Please remind the league admin to accept you in to the league."
        );

      const applicant = await prisma.applicant.upsert({
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

      return {
        status: applicant.status,
        user: {
          id: applicant.userId,
        },
        league: {
          id: applicant.leagueId,
        },
      };
    },
  },
};

export default resolvers;
