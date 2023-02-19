import { UserInputError, ApolloError } from "apollo-server-micro";
import prisma from "prisma/client";
import * as Sentry from "@sentry/nextjs";

import { isUserAlreadyBelongToLeague } from "utils/isUserAlreadyBelongToLeague";
import isUserAppliedToLeague from "utils/isUserAppliedToLeague";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import calculatePredictionScore from "utils/calculatePredictionScore";
import isPastDeadline from "utils/isPastDeadline";
import sortFixtures from "utils/sortFixtures";
import League from "src/types/League";
import Fixture from "src/types/Fixture";
import UserLeague from "src/types/UserLeague";
import User from "src/types/User";
import type { PremierLeagueTeam } from "src/types/PremierLeagueTeam";
import createPremierLeagueTableFromFixtures from "utils/createPremierLeagueTableFromFixtures";
import calculateWeeksUntilStart from "utils/calculateWeeksUntilStart";
import calculateWeeksToGo from "utils/calculateWeeksToGo";
import generateRecentFixturesByTeam from "utils/generateRecentFixturesByTeam";
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
    premierLeagueTable: async () => {
      const fixtures = await prisma.fixture.findMany({
        select: {
          homeTeam: true,
          awayTeam: true,
          homeGoals: true,
          awayGoals: true,
        },
      });

      const premierLeagueTable: PremierLeagueTeam[] =
        createPremierLeagueTableFromFixtures(fixtures);

      return premierLeagueTable;
    },
    allFixtures: async () => {
      const fixtures = await prisma.fixture.findMany();

      const currentGameweek = calculateCurrentGameweek(fixtures);

      return { fixtures, currentGameweek };
    },
    fixturesWithPredictions: async (_, { leagueId, weekId }) => {
      if (weekId < 1 || weekId > 38)
        throw new UserInputError("Gameweek start week is not valid", {
          argumentName: "gameweekStart",
        });

      /**
       * TODO
       * Change from:
       * - Fetch users, their predictions and the fixtures those predictions belong to
       * To:
       * - Fetch fixtures, fetch users predictions, then match up.
       */
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
                  homeGoals: true,
                  awayGoals: true,
                  bigBoyBonus: true,
                  fixture: {
                    select: {
                      gameweek: true,
                      homeGoals: true,
                      awayGoals: true,
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
      if (!fixtures?.length) {
        throw new ApolloError("No fixtures found for this gameweek.");
      }

      // Add missed predictions as 0-0
      const usersWithAppendedPredictions = league.users.map((user) => {
        const missingPredictions = [];
        fixtures.forEach((fixture) => {
          const isMissingPrediction =
            user.predictions.findIndex((p) => p.fixtureId === fixture.id) ===
            -1;

          if (isMissingPrediction) {
            missingPredictions.push({
              fixtureId: fixture.id,
              homeGoals: 0,
              awayGoals: 0,
              bigBoyBonus: false,
              fixture: {
                gameweek: weekId,
                homeGoals: fixture.homeGoals,
                awayGoals: fixture.awayGoals,
              },
            });
          }
        });

        return {
          ...user,
          predictions: [...user.predictions, ...missingPredictions],
        };
      });

      // Sort users
      const users = usersWithAppendedPredictions.sort((a, b) => {
        const totalPointsA = a.predictions.reduce((acc, cur) => {
          const score = calculatePredictionScore(
            [cur.homeGoals ?? 0, cur.awayGoals ?? 0, cur.bigBoyBonus ?? false],
            [cur.fixture.homeGoals, cur.fixture.awayGoals]
          );

          return acc + score;
        }, 0);

        const totalPointsB = b.predictions.reduce((acc, cur) => {
          const score = calculatePredictionScore(
            [cur.homeGoals ?? 0, cur.awayGoals ?? 0, cur.bigBoyBonus ?? false],
            [cur.fixture.homeGoals, cur.fixture.awayGoals]
          );

          return acc + score;
        }, 0);

        return totalPointsB - totalPointsA || (b.id > a.id ? 1 : -1);
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
            const score = calculatePredictionScore(
              [
                userPrediction.homeGoals ?? 0,
                userPrediction.awayGoals ?? 0,
                userPrediction.bigBoyBonus ?? false,
              ],
              [
                userPrediction.fixture.homeGoals,
                userPrediction.fixture.awayGoals,
              ]
            );

            fixture.predictions?.push({
              user: {
                id: user.id,
              },
              fixtureId: fixture.id,
              homeGoals: userPrediction.homeGoals,
              awayGoals: userPrediction.awayGoals,
              bigBoyBonus: userPrediction.bigBoyBonus,
              score,
            });
          } else {
            fixture.predictions?.push({
              user: {
                id: user.id,
              },
              fixtureId: fixture.id,
              homeGoals: null,
              awayGoals: null,
              bigBoyBonus: false,
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
    recentFixturesByTeam: async (_, { weekId }) => {
      const fixtures = await prisma.fixture.findMany();

      const recentFixturesByTeam = generateRecentFixturesByTeam(
        fixtures,
        weekId
      );

      return recentFixturesByTeam;
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
          ({ userId, fixtureId, homeGoals, awayGoals, bigBoyBonus }) => ({
            fixtureId,
            homeGoals,
            awayGoals,
            bigBoyBonus,
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

      const userLeagues = await prisma.user.findUnique({
        include: {
          leagues: true,
        },
        where: {
          id: user.id,
        },
      });
      if (!userLeagues?.leagues.length) return [];

      return userLeagues.leagues.map((league) => ({
        leagueId: league.id,
        leagueName: league.name,
        gameweekStart: league.gameweekStart,
        gameweekEnd: league.gameweekEnd,
      }));
    },
    activeLeagues: async (_, __, { user }) => {
      if (!user?.id) return [];

      const userLeagues = await prisma.user.findUnique({
        include: {
          leagues: true,
        },
        where: {
          id: user.id,
        },
      });
      if (!userLeagues?.leagues.length) return [];

      const fixtures = await prisma.fixture.findMany({
        select: {
          id: true,
          gameweek: true,
          kickoff: true,
        },
      });
      const currentGameweek = calculateCurrentGameweek(fixtures);

      return userLeagues.leagues
        .map((league) => ({
          leagueId: league.id,
          leagueName: league.name,
          gameweekStart: league.gameweekStart,
          gameweekEnd: league.gameweekEnd,
          weeksUntilStart: calculateWeeksUntilStart(
            currentGameweek,
            league.gameweekStart
          ),
          weeksToGo: calculateWeeksToGo(currentGameweek, league.gameweekEnd),
        }))
        .filter((league) => league.gameweekEnd >= currentGameweek)
        .sort((a, b) => a.gameweekStart - b.gameweekStart);
    },
    finishedLeagues: async (_, __, { user }) => {
      if (!user?.id) return [];

      const userLeagues = await prisma.user.findUnique({
        include: {
          leagues: {
            select: {
              id: true,
              name: true,
              gameweekStart: true,
              gameweekEnd: true,
              users: true,
            },
          },
        },
        where: {
          id: user.id,
        },
      });
      if (!userLeagues?.leagues.length) return [];

      // Cannot start in a past gameweek
      const fixtures = await prisma.fixture.findMany({
        select: {
          id: true,
          gameweek: true,
          kickoff: true,
        },
      });
      const currentGameweek = calculateCurrentGameweek(fixtures);

      return userLeagues.leagues
        .map((league) => ({
          leagueId: league.id,
          leagueName: league.name,
          gameweekStart: league.gameweekStart,
          gameweekEnd: league.gameweekEnd,
        }))
        .filter((league) => league.gameweekEnd < currentGameweek)
        .sort((a, b) => b.gameweekEnd - a.gameweekEnd);
    },
  },
  UserLeague: {
    users: async ({ leagueId }: UserLeague) => {
      const league = await prisma.league.findUnique({
        where: {
          id: leagueId,
        },
        include: {
          users: {
            select: {
              id: true,
              predictions: {
                select: {
                  homeGoals: true,
                  awayGoals: true,
                  bigBoyBonus: true,
                  fixture: {
                    select: {
                      gameweek: true,
                      homeGoals: true,
                      awayGoals: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!league) throw new ApolloError("Cannot find league.");

      const users = league.users
        .map((user) => ({
          id: user.id,
          totalPoints: user.predictions
            .filter(
              ({ fixture }) =>
                fixture.gameweek >= league.gameweekStart &&
                fixture.gameweek <= league.gameweekEnd
            )
            .reduce((totalPoints, prediction) => {
              const score = calculatePredictionScore(
                [
                  prediction.homeGoals ?? 0,
                  prediction.awayGoals ?? 0,
                  prediction.bigBoyBonus ?? false,
                ],
                [
                  prediction.fixture.homeGoals || 0,
                  prediction.fixture.homeGoals || 0,
                ]
              );
              return totalPoints + score;
            }, 0),
        }))
        .sort((a, b) => b.totalPoints - a.totalPoints);

      return users;
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
                  fixtureId: true,
                  homeGoals: true,
                  awayGoals: true,
                  bigBoyBonus: true,
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

      const fixtures = await prisma.fixture.findMany({
        select: {
          id: true,
          homeGoals: true,
          awayGoals: true,
          gameweek: true,
          kickoff: true,
        },
      });

      const users = league.users.map((user) => {
        const predictions = user.predictions.filter(
          (prediction) =>
            prediction.fixture.gameweek >= league.gameweekStart &&
            prediction.fixture.gameweek <= league.gameweekEnd
        );

        /**
           The accumulator is an array of the form:
           [{ week: 1, points: 0 }, { week: 2, points: 0 }, ... , { week: n, points: 0 }]

           The callback function iterates through the fixtures, compares predictions against
           each fixture to obtain the points for that fixture, then adds the points to the 
           correct array index in the accumulator
         */
        const weeklyPoints = fixtures
          .filter(
            (fixture) =>
              fixture.gameweek >= league.gameweekStart &&
              fixture.gameweek <= league.gameweekEnd
          )
          .reduce(
            (acc, cur) => {
              const prediction = predictions.find(
                (p) => p.fixtureId === cur.id
              );
              const score = calculatePredictionScore(
                [
                  prediction?.homeGoals ?? 0,
                  prediction?.awayGoals ?? 0,
                  prediction?.bigBoyBonus ?? false,
                ],
                [cur.homeGoals, cur.awayGoals]
              );

              const arrayIndex = cur.gameweek - league.gameweekStart;
              acc[arrayIndex] = {
                week: cur.gameweek,
                points: (acc[arrayIndex].points += score),
              };

              return acc;
            },
            new Array(league.gameweekEnd - league.gameweekStart + 1)
              .fill(0)
              .map((_, i) => ({ week: i + league.gameweekStart, points: 0 }))
          );

        const totalPoints = weeklyPoints.reduce(
          (acc, cur) => acc + (cur.points || 0),
          0
        );

        return {
          ...user,
          weeklyPoints,
          totalPoints,
        };
      });

      const currentGameweek = calculateCurrentGameweek(fixtures);
      const sortedUsers = users
        .sort((a, b) => b.totalPoints - a.totalPoints || (b.id > a.id ? 1 : -1))
        .map((user) => ({
          ...user,
          weeklyPoints: [
            ...user.weeklyPoints.filter(
              (weeklyPoints) =>
                weeklyPoints.week >= league.gameweekStart &&
                weeklyPoints.week <=
                  Math.min(league.gameweekEnd, currentGameweek)
            ),
          ].reverse(),
        }));

      return sortedUsers;
    },
  },
  DateTime: dateScalar,
};

export default resolvers;
