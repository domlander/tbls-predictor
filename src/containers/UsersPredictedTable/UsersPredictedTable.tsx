import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";
import { PREDICTED_LEAGUE_QUERY } from "apollo/queries";
import PremierLeague from "src/containers/PremierLeague";
import type { PremierLeagueTeam } from "src/types/PremierLeagueTeam";
import User from "src/types/User";

const appendTeamNameWithPositionDiff = (
  predictedTable: PremierLeagueTeam[],
  actualTable: PremierLeagueTeam[]
) => {
  return predictedTable.map((team, i) => {
    const position = i + 1;
    const actualPosition =
      actualTable.findIndex((t) => t.team === team.team) + 1;
    const difference = actualPosition - position;

    let text = "";
    if (difference === 0) {
      text = "(=)";
    } else if (difference > 0) {
      text = `(+${difference})`;
    } else {
      text = `(${difference})`;
    }

    return {
      ...team,
      team: `${team.team} ${text}`,
    };
  });
};

type Props = {
  userId: User["id"];
};

/**
 * Provides a league table to show the user what the league table would look like
 * if their own predictions were the true results
 */
const UsersPredictedTable = ({ userId }: Props) => {
  const [predictedTable, setPredictedTable] = useState<PremierLeagueTeam[]>([]);
  const [table, setTable] = useState<PremierLeagueTeam[]>([]);

  const { loading, error } = useQuery(PREDICTED_LEAGUE_QUERY, {
    variables: { userId },
    onCompleted: ({ predictedLeagueTable, premierLeagueTable }) => {
      setPredictedTable(predictedLeagueTable);
      setTable(premierLeagueTable);
    },
    skip: !userId,
  });

  if (error) {
    return <p>An error has occurred. Please try again later.</p>;
  }

  // Adjust the name of the team to include position difference
  const predictedPositions = appendTeamNameWithPositionDiff(
    predictedTable,
    table
  );

  return (
    <PremierLeague
      teams={predictedPositions}
      heading="My predicted league"
      loading={loading}
      isPredictedLeague
    />
  );
};

export default UsersPredictedTable;
