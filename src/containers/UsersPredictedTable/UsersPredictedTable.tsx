import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";
import { PREDICTED_LEAGUE_QUERY } from "apollo/queries";
import PremierLeague from "src/containers/PremierLeague";
import type { PremierLeagueTeamDisplay } from "src/types/PremierLeagueTeam";

const appendTeamNameWithPositionDiff = (
  predictedTable: PremierLeagueTeamDisplay[],
  actualTable: PremierLeagueTeamDisplay[]
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

const UsersPredictedTable = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [predictedTable, setPredictedTable] = useState<
    PremierLeagueTeamDisplay[]
  >([]);
  const [table, setTable] = useState<PremierLeagueTeamDisplay[]>([]);

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
    />
  );
};

export default UsersPredictedTable;
