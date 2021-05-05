import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import React from "react";

import { convertUrlParamToNumber } from "@/utils";
import LeagueAdmin from "src/containers/LeagueAdmin";
import redirectInternal from "../../../utils/redirects";

interface Props {
  userId: number;
  leagueId: number;
}

const LeagueAdminPage = ({ userId, leagueId }: Props) => (
  <LeagueAdmin userId={userId} leagueId={leagueId} />
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

  return {
    props: {
      userId: session.user.id,
      leagueId: convertUrlParamToNumber(context.params?.leagueId),
    },
  };
};

export default LeagueAdminPage;
