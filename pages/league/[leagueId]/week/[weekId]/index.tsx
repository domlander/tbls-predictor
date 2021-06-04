import React from "react";
import { GetServerSideProps } from "next";

import LeagueWeek from "@/containers/LeagueWeek";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import redirectInternal from "utils/redirects";

interface Props {
  leagueId: number;
  weekId: number;
}

const LeagueWeekPage = ({ leagueId, weekId }: Props) => (
  <LeagueWeek leagueId={leagueId} weekId={weekId} />
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the league ID from the URL
  const leagueId = convertUrlParamToNumber(context.params?.leagueId);
  if (!leagueId || leagueId <= 0) return redirectInternal("/leagues");

  // Get the week from the URL
  const weekId = convertUrlParamToNumber(context.params?.weekId);
  if (!weekId || weekId <= 0) return redirectInternal(`/league/${leagueId}`);

  return {
    props: {
      leagueId,
      weekId,
    },
  };
};

export default LeagueWeekPage;
