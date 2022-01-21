import { UserInputError, ApolloError } from "apollo-server-micro";
import prisma from "prisma/client";
import * as Sentry from "@sentry/nextjs";

import { isUserAlreadyBelongToLeague } from "utils/isUserAlreadyBelongToLeague";
import isUserAppliedToLeague from "utils/isUserAppliedToLeague";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import isPastDeadline from "utils/isPastDeadline";
import sortFixtures from "utils/sortFixtures";
import { League } from "src/types/League";
import { Fixture } from "src/types/Fixture";
import { UserLeague } from "src/types/UserLeague";
import { User } from "src/types/User";
import dateScalar from "./scalars";

const resolvers = {
  Query: {
    user: async (_, __, { user }) => {
      if (!user) throw new ApolloError("User not logged in.");

      const me = await prisma.user.findUnique({
        where: { id: user.id },
      });

      return me;
    },
    fixtures: async (_, { weekId }) => {
      const unsortedFixtures = await prisma.fixture.findMany({
        where: {
          gameweek: weekId,
        },
      });
      const fixtures = sortFixtures(unsortedFixtures);
      return fixtures;
    },
    allFixtures: async () => {
      const fixtures = await prisma.fixture.findMany();
      return fixtures;
    },
    fixturesWithPredictions: async (_, { leagueId, weekId }) => {
      const league = await prisma.league.findUnique({
        where: {
          id: leagueId,
        },
        include: {
          users: {
            select: {
              id: true,
              username: true,
              predictions: {
                select: {
                  fixtureId: true,
                  score: true,
                  homeGoals: true,
                  awayGoals: true,
                  big_boy_bonus: true,
                  fixture: {
                    select: {
                      gameweek: true,
                    },
                  },
                },
                where: {
                  fixture: {
                    gameweek: weekId,
                  },
                },
              },
            },
          },
        },
      });
      if (!league) throw new ApolloError("Cannot find league.");

      const fixtures = await prisma.fixture.findMany({
        where: {
          gameweek: weekId,
        },
      });

      const users = league.users.sort((a, b) => {
        const totalPointsA = a.predictions.reduce(
          (acc, cur) => acc + (cur.score || 0),
          0
        );
        const totalPointsB = b.predictions.reduce(
          (acc, cur) => acc + (cur.score || 0),
          0
        );

        return totalPointsB - totalPointsA || a.id - b.id;
      });

      const fixturesWithPredictions: Fixture[] = fixtures.map((fixture) => ({
        ...fixture,
        predictions: [],
      }));

      fixturesWithPredictions.forEach((fixture) => {
        users.forEach((user) => {
          const userPrediction = user.predictions.find(
            (p) => p.fixtureId === fixture.id
          );
          if (userPrediction) {
            fixture.predictions?.push({
              user: {
                id: user.id,
              },
              fixtureId: fixture.id,
              homeGoals: userPrediction.homeGoals,
              awayGoals: userPrediction.awayGoals,
              big_boy_bonus: userPrediction.big_boy_bonus,
              score: userPrediction.score,
            });
          } else {
            fixture.predictions?.push({
              user: {
                id: user.id,
              },
              fixtureId: fixture.id,
              homeGoals: null,
              awayGoals: null,
              big_boy_bonus: false,
              score: null,
            });
          }
        });
      });

      return {
        fixtures: fixturesWithPredictions,
      };
    },
    predictions: async (_, { weekId }, { user }) => {
      const userId = user.id;

      const predictions = await prisma.prediction.findMany({
        where: {
          AND: [
            { userId },
            {
              fixture: {
                gameweek: weekId,
              },
            },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      });

      return predictions;
    },
    allLeagues: async () => {
      const leagues = await prisma.league.findMany({
        select: {
          id: true,
          name: true,
        },
        take: 10, // TODO: introduce pagination
      });

      return { leagues };
    },
    leagueAdmin: async (_, { leagueId }, { user }) => {
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

      if (league.administratorId !== user?.id)
        throw new ApolloError(
          "Cannot process request. User is not an administrator of the league."
        );

      return { league };
    },
    league: async (_, { leagueId }) => {
      const league = await prisma.league.findUnique({
        where: {
          id: leagueId,
        },
      });
      if (!league) throw new ApolloError("Cannot find league.");

      return league;
    },
  },
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
      if (gameweekStart < currentGameweek)
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
          ({ userId, fixtureId, homeGoals, awayGoals, big_boy_bonus }) => {
            // Don't let the user submit predictions after the match has finished! We cannot trust the client
            if (!updateableFixtures.includes(fixtureId)) return;

            const data = {
              userId,
              fixtureId,
              homeGoals,
              awayGoals,
              big_boy_bonus,
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
          ({ userId, fixtureId, homeGoals, awayGoals, big_boy_bonus }) => ({
            fixtureId,
            homeGoals,
            awayGoals,
            big_boy_bonus,
            user: {
              id: userId,
            },
          })
        ),
      };
    },
  },
  User: {
    username: async (parent: User) => {
      const me = await prisma.user.findUnique({
        where: { id: parent.id },
      });

      return me?.username || "";
    },
    leagues: async (_, __, { user }) => {
      if (!user?.id) return [];

      let leagues: UserLeague[] | null = [];
      const userLeagues = await prisma.user.findUnique({
        include: {
          leagues: true,
        },
        where: {
          id: user.id,
        },
      });

      if (!userLeagues?.leagues.length) return [];

      leagues = userLeagues.leagues.map((league) => ({
        leagueId: league.id,
        leagueName: league.name,
        // position: null, // TODO
        // weeksToGo: null, // TODO
      }));

      return leagues;
    },
  },
  League: {
    applicants: ({ applicants }: League) => {
      const currentApplicants =
        applicants?.filter((applicant) => applicant.status === "applied") || [];

      return currentApplicants;
    },
    users: async ({ id }: League) => {
      const league = await prisma.league.findUnique({
        where: {
          id,
        },
        include: {
          users: {
            select: {
              id: true,
              predictions: {
                select: {
                  score: true,
                  fixture: {
                    select: {
                      gameweek: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!league) throw new ApolloError("Cannot find league.");

      const users = league.users.map((user) => {
        const predictions = user.predictions.filter(
          (prediction) =>
            prediction.fixture.gameweek >= league.gameweekStart &&
            prediction.fixture.gameweek <= league.gameweekEnd
        );

        const weeklyPoints = predictions.reduce(
          (acc, cur) => {
            acc[cur.fixture.gameweek - league.gameweekStart] = {
              week: cur.fixture.gameweek,
              points: (acc[
                cur.fixture.gameweek - league.gameweekStart
              ].points += cur.score || 0),
            };
            return acc;
          },
          new Array(league.gameweekEnd - league.gameweekStart + 1)
            .fill(0)
            .map((_, i) => ({ week: i + league.gameweekStart, points: 0 }))
        );

        const totalPoints = predictions
          .filter(
            (prediction) =>
              prediction.fixture.gameweek >= league.gameweekStart &&
              prediction.fixture.gameweek <= league.gameweekEnd
          )
          .reduce((acc, cur) => acc + (cur.score || 0), 0);

        return {
          ...user,
          weeklyPoints,
          totalPoints,
        };
      });

      return users;
    },
  },
  DateTime: dateScalar,
};

export default resolvers;
