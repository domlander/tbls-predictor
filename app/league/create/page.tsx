import prisma from "prisma/client";

import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import CreateLeague from "src/containers/CreateLeague";
import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  const fixtures = await prisma.fixture.findMany({
    select: {
      id: true,
      gameweek: true,
      kickoff: true,
    },
  });
  const currentGameweek = calculateCurrentGameweek(fixtures);

  return <CreateLeague currentGameweek={currentGameweek} />;
};

export default Page;
