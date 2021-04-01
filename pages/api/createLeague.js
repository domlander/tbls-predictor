import { getSession } from "next-auth/client";
import prisma from "prisma/client";

export default async (req, res) => {
  const session = await getSession({ req });

  const { name, start, end } = req.body;

  if (!name || !start || !end) {
    res.status(400).send("League not created. Details missing.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  await prisma.league.create({
    data: {
      name,
      status: "open",
      administratorId: session.user.id,
      season: "2020/2021",
      gameweekStart: start,
      gameweekEnd: end > 38 ? 38 : end,
      users: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  res.send(200);
};
