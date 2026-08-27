import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "auth";
import prisma from "prisma/client";
import { Prisma } from "prisma/generated/client";
import LeagueAdmin from "src/containers/LeagueAdmin";
import Participant from "src/types/Participant";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";

// We get the users session, so don't use caching
export const dynamic = "force-dynamic";

type Params = { leagueId: string };

const Page = async (props: { params: Promise<Params> }) => {
  const params = await props.params;
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
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
    } satisfies Prisma.LeagueInclude,
  });

  if (league?.administratorId !== userId) {
    return redirect("/signIn");
  }

  const participants: Participant[] = league.users.map(({ id, name }) => ({
    id: id.toLocaleString(),
    username: name,
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
