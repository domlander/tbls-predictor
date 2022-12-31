import React from "react";
import { GetStaticProps } from "next";
import { initializeApollo } from "apollo/client";
import { PREMIER_LEAGUE_QUERY } from "apollo/queries";

import PremierLeague from "src/containers/PremierLeague";
import {
  PremierLeagueTeam,
  PremierLeagueTeamDisplay,
} from "src/types/PremierLeagueTeam";

interface Props {
  teams: PremierLeagueTeamDisplay[];
}

const PremierLeaguePage = ({ teams }: Props) => {
  return <PremierLeague teams={teams} />;
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();
  const {
    data: { premierLeagueTable },
  }: { data: { premierLeagueTable: PremierLeagueTeam[] } } =
    await apolloClient.query({
      query: PREMIER_LEAGUE_QUERY,
    });

  const teams: (PremierLeagueTeam & PremierLeagueTeamDisplay)[] =
    premierLeagueTable.map((team) => ({
      ...team,
      played: team.wins + team.draws + team.losses,
      goalsScored: team.homeGoals + team.awayGoals,
      goalsConceded: team.homeGoalsConceded + team.awayGoalsConceded,
      goalDifference:
        team.homeGoals +
        team.awayGoals -
        (team.homeGoalsConceded + team.awayGoalsConceded),
    }));

  return {
    props: {
      teams,
    },
    revalidate: 1,
  };
};

export default PremierLeaguePage;
