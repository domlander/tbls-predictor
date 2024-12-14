import prisma from "prisma/client";
import { redirect } from "next/navigation";
import { auth } from "auth";
import UpdateResults from "src/containers/AdminUpdateResults";
import sortFixtures from "utils/sortFixtures";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await auth();
  if (!session) {
    return redirect("/signIn");
  }

  // TODO Replace with roles https://github.com/nextauthjs/next-auth/discussions/805
  if (session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect("/");
  }

  // Show all past fixtures. We may want to filter this to recent fixtures or fixtures without scores.
  const fixtures = await prisma.fixture.findMany({
    where: {
      kickoff: {
        lte: new Date(),
      },
    },
  });

  const sortedFixtures = sortFixtures(fixtures);

  return <UpdateResults fixtures={sortedFixtures} />;
};

export default Page;
