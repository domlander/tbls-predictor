import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import prisma from "prisma/client";
import { authOptions } from "pages/api/auth/[...nextauth]";
import AdminManageFixtures from "src/containers/AdminManageFixtures";
import Fixture from "src/types/Fixture";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/signIn");
  }

  // TODO Replace with roles https://github.com/nextauthjs/next-auth/discussions/805
  if (session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect("/");
  }

  const allFixtures: Fixture[] = await prisma.fixture.findMany();
  const currentGameweek = calculateCurrentGameweek(allFixtures);

  return <AdminManageFixtures gameweek={currentGameweek} />;
};

export default Page;
