import { UserInputError, ApolloError } from "apollo-server-micro";
import prisma from "prisma/client";
import {
  isUserAlreadyBelongToLeague,
  isUserAppliedToLeague,
} from "utils/userLeagueApplication";

const resolvers = {
  Query: {
    userById: async (root, { id }, ctx) => {
      const user = await prisma.user.findUnique({ where: { id } });
      return user;
    },

    userByEmail: async (root, { email }, ctx) => {
      const user = await prisma.user.findUnique({ where: { email } });
      return user;
    },

    leagues: async (root, { email }, ctx) => {
      const user = await prisma.user.findUnique({
        include: {
          leagues: true,
        },
        where: {
          email,
        },
      });

      return user?.leagues || [];
    },
  },
  Mutation: {
    // createLeague: async (
    //   root,
    //   { league: { name, administratorId, gameweekStart, gameweekEnd, userId } },
    //   ctx
    // ) => {
    //   await prisma.league.create({
    //     data: {
    //       name,
    //       status: "open",
    //       administratorId,
    //       season: "2020/2021",
    //       gameweekStart,
    //       gameweekEnd: gameweekEnd > 38 ? 38 : gameweekEnd,
    //       users: {
    //         connect: {
    //           id: userId,
    //         },
    //       },
    //     },
    //   });
    // },
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
