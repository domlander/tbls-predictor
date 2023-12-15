import { PremierLeagueTeam } from "src/types/PremierLeagueTeam";

export const appendTeamNameWithPositionDiff = (
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
