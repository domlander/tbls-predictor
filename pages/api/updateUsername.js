import { getSession } from "next-auth/client";
import prisma from "prisma/client";

export default async (req, res) => {
  const session = await getSession({ req });
  const { email } = session.user;
  let { username } = req.body;

  if (!username) {
    return res.status(400).send("Username not provided");
  }

  // Limit username to 20 characters
  username = username.substring(0, 20);

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      username,
    },
  });

  return res.send(200);
};
