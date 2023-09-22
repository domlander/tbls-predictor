import PremierLeague from "src/containers/PremierLeague";
import type { PremierLeagueTeam } from "src/types/PremierLeagueTeam";

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
  username: string;
  table: PremierLeagueTeam[];
  predictedTable: PremierLeagueTeam[];
};

/**
 * Provides a league table to show the user what the league table would look like
 * if their own predictions were the true results
 */
const UsersPredictedTable = ({ username, table, predictedTable }: Props) => {
  // Adjust the name of the team to include position difference
  const predictedPositions = appendTeamNameWithPositionDiff(
    predictedTable,
    table
  );

  return (
    <PremierLeague
      teams={predictedPositions}
      heading={`${username}'s predicted league`}
      loading={false}
      isPredictedLeague
    />
  );
};

export default UsersPredictedTable;
