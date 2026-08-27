import { redirect } from "next/navigation";
import prisma from "prisma/client";
import { auth } from "auth";
import { headers } from "next/headers";
import AdminManageFixtures from "src/containers/AdminManageFixtures";
import Fixture from "src/types/Fixture";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  if (!session) {
    return redirect("/signIn");
  }

  // TODO Replace with roles
  if (session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect("/");
  }

  const allFixtures: Fixture[] = await prisma.fixture.findMany();
  const currentGameweek = calculateCurrentGameweek(allFixtures);

  return <AdminManageFixtures gameweek={currentGameweek} />;
};

export default Page;
