import prisma from "prisma/client";

const myResolvers = {
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

const products = [
  {
    id: 1,
    name: "Cookie",
    price: 300,
  },
  {
    id: 2,
    name: "Brownie",
    price: 350,
  },
];

const resolvers = {
  Query: {
    products: (_parent, _args, _context, _info) => products,
  },
};

export default resolvers;
