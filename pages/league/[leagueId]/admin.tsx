import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "prisma/client";

import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import redirectInternal from "utils/redirects";
import LeagueAdmin from "src/containers/LeagueAdmin";
import Applicant from "src/types/Applicant";
import User from "src/types/User";

interface Props {
  leagueId: number;
  leagueName: string;
  applicants: Applicant[];
  participants: User[];
}

const LeagueAdminPage = ({
  leagueId,
  leagueName,
  applicants,
  participants,
}: Props) => (
  <LeagueAdmin
    leagueId={leagueId}
    leagueName={leagueName}
    applicants={applicants}
    participants={participants}
  />
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
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
  const leagueId = convertUrlParamToNumber(context.params?.leagueId);
  if (!leagueId || leagueId <= 0) return redirectInternal("/leagues");

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

  if (league?.administratorId !== userId)
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };

  return {
    props: {
      leagueId,
      leagueName: league.name,
      applicants: JSON.parse(JSON.stringify(league.applicants)),
      participants: JSON.parse(JSON.stringify(league.users)),
    },
  };
};

export default LeagueAdminPage;
