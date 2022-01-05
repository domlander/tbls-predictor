import { UserInputError, ApolloError } from "apollo-server-micro";
import prisma from "prisma/client";

import { isUserAlreadyBelongToLeague } from "utils/isUserAlreadyBelongToLeague";
import isUserAppliedToLeague from "utils/isUserAppliedToLeague";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import isPastDeadline from "utils/isPastDeadline";
import { UserLeagueInfo } from "src/types/UserLeagueInfo";
import sortFixtures from "utils/sortFixtures";
import { FixtureWithUsersPredictions, UserTotalPoints } from "@/types";
import dateScalar from "./scalars";

const resolvers = {
  Query: {
    user: async (root, args, ctx) => {
      // TODO: think about whether we want to return null here instead and handle the case that the user
      // is not logged in later on. Feels like an error shouldn't be thrown here as not being logged in is normal behaviour.
      if (!ctx.session) throw new ApolloError("User not logged in.");

      const user = await prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });
      return user;
    },
    allFixtures: async () => {
      const fixtures = await prisma.fixture.findMany();
      return fixtures;
    },
    fixtures: async (root, { input: { gameweek } }, ctx) => {
      const fixtures = await prisma.fixture.findMany({
        where: {
          gameweek,
        },
      });

      const sortedFixtures = sortFixtures(fixtures);

      return sortedFixtures;
    },
    leagues: async (root, { input: { userId } }) => {
      // Get all public leagues
      const publicLeagues = await prisma.league.findMany({
        select: {
          id: true,
          name: true,
        },
        take: 10, // TODO: introduce pagination
      });

      // Get user's leagues
      let userLeagues: UserLeagueInfo[] = [];
      if (userId) {
        const user = await prisma.user.findUnique({
          include: {
            leagues: true,
          },
          where: {
            id: userId,
          },
        });

        if (user?.leagues.length) {
          userLeagues = user?.leagues.map((league) => ({
            id: league.id,
            name: league.name,
            position: null, // TODO
            weeksToGo: null, // TODO
          }));
        }
      }

      return {
        userLeagues,
        publicLeagues,
      };
    },
    leagueAdmin: async (root, { input: { userId, leagueId } }) => {
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
    predictions: async (root, { input: { userId, weekId } }) => {
      // Find all my predictions
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
      });

      return {
        predictions,
      };
    },
    leagueDetails: async (root, { input: { leagueId } }) => {
      // Get the league details
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

      const numGameweeks = league.gameweekEnd - league.gameweekStart + 1;
      const usersWeeklyPoints: number[][] = league.users.map(
        ({ predictions }) =>
          predictions
            .filter(
              (prediction) =>
                prediction.fixture.gameweek <= league.gameweekEnd &&
                prediction.fixture.gameweek >= league.gameweekStart
            )
            .reduce((acc, cur) => {
              if (!cur.score) return acc; // if score is null or 0
              acc[cur.fixture.gameweek - league.gameweekStart] += cur.score;
              return acc;
            }, new Array(numGameweeks).fill(0))
      );

      const users: UserTotalPoints[] = league.users.map(
        ({ id, username }, i) => ({
          userId: id,
          username: username || "",
          totalPoints: usersWeeklyPoints[i].reduce((acc, cur) => acc + cur, 0),
        })
      );

      // The fill(0) is required because we can't iterate through an array of undefined pointers: https://stackoverflow.com/a/5501711
      const pointsByWeek = new Array(numGameweeks).fill(0).map((_, i) => ({
        week: league.gameweekStart + i,
        points: usersWeeklyPoints.map((points) => points[i]),
      }));

      return {
        leagueName: league.name,
        administratorId: league.administratorId,
        users,
        pointsByWeek,
      };
    },
    leagueWeek: async (root, { input: { leagueId, weekId } }) => {
      // Get the fixtures
      const fixtures = await prisma.fixture.findMany({
        select: {
          id: true,
          gameweek: true,
          kickoff: true,
          homeTeam: true,
          awayTeam: true,
          homeGoals: true,
          awayGoals: true,
        },
      });

      // Get the league details
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
              },
            },
          },
        },
      });
      if (!league) throw new ApolloError("Cannot find league.");

      const fixturesWithPredictions: FixtureWithUsersPredictions[] = fixtures
        .filter(
          (fixture) =>
            fixture.gameweek <= league.gameweekEnd &&
            fixture.gameweek >= league.gameweekStart
        )
        .map((fixture) => ({
          ...fixture,
          predictions: [],
        }));

      league.users.forEach((user) => {
        fixturesWithPredictions.forEach((fixture) => {
          const userPrediction = user.predictions.find(
            (p) => p.fixtureId === fixture.id
          );
          if (userPrediction) {
            fixture.predictions.push({
              homeGoals: userPrediction.homeGoals,
              awayGoals: userPrediction.awayGoals,
              big_boy_bonus: userPrediction.big_boy_bonus,
              score: userPrediction.score,
            });
          } else {
            fixture.predictions.push({
              homeGoals: null,
              awayGoals: null,
              big_boy_bonus: false,
              score: null,
            });
          }
        });
      });

      const thisWeeksFixtures = sortFixtures(
        fixturesWithPredictions.filter((fixture) => fixture.gameweek === weekId)
      );

      const numGameweeks = league.gameweekEnd - league.gameweekStart + 1;
      const usersWeeklyPoints = league.users.map(({ predictions }) =>
        predictions
          .filter((x) => x.fixture.gameweek === weekId)
          .reduce((acc, cur) => {
            if (!cur.score) return acc; // if score is null or 0
            acc[cur.fixture.gameweek - 1] += cur.score;
            return acc;
          }, new Array(numGameweeks).fill(0))
      );

      const users = league.users.map(({ id, username }, i) => ({
        userId: id,
        username: username || "",
        week: weekId,
        totalPoints: usersWeeklyPoints[i].reduce(
          (acc, cur) => acc + (cur || 0),
          0
        ),
      }));

      return {
        leagueName: league.name,
        firstGameweek: league.gameweekStart,
        lastGameweek: league.gameweekEnd,
        users,
        fixtures: thisWeeksFixtures,
      };
    },
  },
  Mutation: {
    updateUsername: async (root, { input: { userId, username } }) => {
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
    updateFixtures: async (root, { input: fixtures }) => {
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
        console.log("Error:", e);
        return false;
      }

      return true;
    },
    updatePredictions: async (root, { input: predictions }) => {
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
        console.log("Error:", e);
        return false;
      }

      return true;
    },
    createLeague: async (
      root,
      { input: { userId, name, gameweekStart, gameweekEnd } }
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
      { userId, leagueId, applicantId, isAccepted }
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
    requestToJoinLeague: async (root, { leagueId, userId }) => {
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
  DateTime: dateScalar,
  User: {
    // TODO: https://www.apollographql.com/docs/apollo-server/data/resolvers/
    // If the graphql query is `user { predictions }`, it will resolve here.
    predictions: async ({ id: userId }, { weekId }) => {
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
      });

      return predictions;
    },
  },
};

export default resolvers;
