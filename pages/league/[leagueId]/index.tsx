import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

import LeagueHome from "@/containers/League";
import { convertUrlParamToNumber } from "@/utils";
import redirectInternal from "utils/redirects";

interface Props {
  userId: number;
  leagueId: number;
}

const LeaguePage = ({ userId, leagueId }: Props) => (
  <LeagueHome userId={userId} leagueId={leagueId} />
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }
  if (!session?.user.id) return redirectInternal("/");

  // Get the leagueId from the URL
  const leagueId = convertUrlParamToNumber(context.params?.leagueId);
  if (!leagueId || leagueId <= 0) return redirectInternal("/leagues");

  return {
    props: {
      userId: session.user.id,
      leagueId,
    },
  };
};

export default LeaguePage;
