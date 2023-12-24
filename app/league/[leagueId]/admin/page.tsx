import { getServerSession } from "next-auth/next";
import prisma from "prisma/client";

import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import { authOptions } from "pages/api/auth/[...nextauth]";
import LeagueAdmin from "src/containers/LeagueAdmin";
import { redirect } from "next/navigation";

// We get the users session, so don't use caching
export const dynamic = "force-dynamic";

type Params = { leagueId: string };

const Page = async ({ params }: { params: Params }) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  // Get the leagueId from the URL
  const leagueId = convertUrlParamToNumber(params?.leagueId);
  if (!leagueId || leagueId <= 0) return redirect("/signIn");

  const league = await prisma.league.findUnique({
    where: {
      id: leagueId,
    },
    include: {
      users: true,
      applicants: {
        include: {
          user: true,
        },
        where: {
          status: "applied",
        },
      },
    },
  });

  if (league?.administratorId !== userId) {
    return redirect("/signIn");
  }

  const participants = league.users.map(({ id, username }) => ({
    id,
    username,
  }));

  return (
    <LeagueAdmin
      leagueId={leagueId}
      leagueName={league.name}
      applicants={JSON.parse(JSON.stringify(league.applicants))}
      participants={JSON.parse(JSON.stringify(participants))}
    />
  );
};

export default Page;
