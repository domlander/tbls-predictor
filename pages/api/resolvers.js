import prisma from "prisma/client";

const resolvers = {
  Query: {
    userById: (root, { id }, ctx) =>
      prisma.user.findUnique({
        where: {
          id,
        },
      }),
  },
  Mutation: {
    createLeague: (
      root,
      { league: { name, administratorId, gameweekStart, gameweekEnd, userId } },
      ctx
    ) =>
      prisma.league.create({
        data: {
          name,
          status: "open",
          administratorId,
          season: "2020/2021",
          gameweekStart,
          gameweekEnd: gameweekEnd > 38 ? 38 : gameweekEnd,
          users: {
            connect: {
              id: userId,
            },
          },
        },
      }),
  },
};

export default resolvers;
