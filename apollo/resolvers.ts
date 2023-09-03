import { UserInputError, ApolloError } from "apollo-server-micro";
import prisma from "prisma/client";
import * as Sentry from "@sentry/nextjs";

import { isUserAlreadyBelongToLeague } from "utils/isUserAlreadyBelongToLeague";
import isUserAppliedToLeague from "utils/isUserAppliedToLeague";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import isPastDeadline from "utils/isPastDeadline";
import dateScalar from "./scalars";

const resolvers = {
  Mutation: {
    updateUsername: async (_, { username }, { user: { id } }) => {
      if (username.length < 3 || username.length > 20)
        throw new UserInputError(
          "Select a username between 3 and 20 characters",
          {
            argumentName: "username",
          }
        );

      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          username,
        },
      });

      if (user) {
        return user;
      }
    },
    requestToJoinLeague: async (_, { leagueId }, { user }) => {
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

      if (isUserAlreadyBelongToLeague(league.users, user.id))
        throw new ApolloError("You are already a member of this league.");

      if (isUserAppliedToLeague(league.applicants, user.id))
        throw new ApolloError(
          "You already have an application to join this league. Please remind the league admin to accept you in to the league."
        );

      const applicant = await prisma.applicant.upsert({
        where: {
          userId_leagueId: { userId: user.id, leagueId },
        },
        create: {
          userId: user.id,
          leagueId,
          status: "applied",
        },
        update: {
          status: "applied",
        },
      });

      return {
        user: { id: applicant.userId },
        league: { id: applicant.leagueId },
        status: applicant.status,
        createdAt: applicant.createdAt,
      };
    },
    processJoinLeagueRequest: async (
      _,
      { input: { leagueId, applicantId, isAccepted } },
      { user }
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
        throw new ApolloError(
          "Cannot process request. League not found. Try again later."
        );

      if (user.id !== league.administratorId)
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

      return isAccepted;
    },
    createLeague: async (
      _,
      { input: { name, gameweekStart, gameweekEnd } },
      { user }
    ) => {
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

      // Cannot start in a past gameweek
      const fixtures = await prisma.fixture.findMany({
        select: {
          id: true,
          gameweek: true,
          kickoff: true,
        },
      });

      const currentGameweek = calculateCurrentGameweek(fixtures);
      if (gameweekStart <= currentGameweek)
        throw new UserInputError(
          "Enter a future gameweek in which to begin the league",
          {
            argumentName: "gameweekStart",
          }
        );

      const league = await prisma.league.create({
        data: {
          name,
          status: "open",
          administratorId: user.id,
          season: "2020/2021", // TODO
          gameweekStart,
          gameweekEnd: Math.min(gameweekEnd, 38),
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      if (league) {
        return league;
      }
    },
    updateFixtures: async (_, { input: fixtures }) => {
      try {
        const fixtureUpdates = fixtures.map(({ id, homeTeam, awayTeam }) => {
          // eslint-disable-next-line consistent-return
          return prisma.fixture.update({
            where: {
              id,
            },
            data: {
              homeTeam,
              awayTeam,
            },
          });
        });

        await Promise.all(fixtureUpdates);
      } catch (e) {
        Sentry.captureException(e);
        return false;
      }

      return true;
    },
    updatePredictions: async (_, { input: predictions }) => {
      const fixtures = await prisma.fixture.findMany({
        select: {
          id: true,
          kickoff: true,
        },
        where: {
          id: {
            in: predictions.map(({ fixtureId }) => fixtureId),
          },
        },
      });
      const updateableFixtures = fixtures
        .filter(({ kickoff }) => !isPastDeadline(kickoff))
        .map(({ id }) => id);

      try {
        const predictionsUpsert = predictions.map(
          ({ userId, fixtureId, homeGoals, awayGoals, bigBoyBonus }) => {
            // Don't let the user submit predictions after the match has finished! We cannot trust the client
            if (!updateableFixtures.includes(fixtureId)) return;

            const data = {
              userId,
              fixtureId,
              homeGoals,
              awayGoals,
              bigBoyBonus,
            };

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

        await Promise.all(predictionsUpsert);
      } catch (e) {
        Sentry.captureException(e);
        return null;
      }

      return {
        predictions: predictions.map(
          ({
            userId,
            fixtureId,
            homeGoals,
            awayGoals,
            score,
            bigBoyBonus,
          }) => ({
            fixtureId,
            homeGoals,
            awayGoals,
            score,
            bigBoyBonus,
            user: {
              id: userId,
            },
          })
        ),
      };
    },
  },
  DateTime: dateScalar,
};

export default resolvers;
