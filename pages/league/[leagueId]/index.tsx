import React from "react";
import { GetServerSideProps } from "next";

import LeagueHome from "@/containers/League";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import redirectInternal from "utils/redirects";

interface Props {
  leagueId: number;
}

const LeaguePage = ({ leagueId }: Props) => <LeagueHome leagueId={leagueId} />;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the leagueId from the URL
  const leagueId = convertUrlParamToNumber(context.params?.leagueId);
  if (!leagueId || leagueId <= 0) return redirectInternal("/leagues");

  return {
    props: {
      leagueId,
    },
  };
};

export default LeaguePage;
