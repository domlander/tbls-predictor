import prisma from "prisma/client";

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

    userLeagues: async (root, { email }, ctx) => {
      const user = await prisma.user.findUnique({
        include: {
          leagues: true,
        },
        where: {
          email,
        },
      });

      return user.leagues;
    },
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
