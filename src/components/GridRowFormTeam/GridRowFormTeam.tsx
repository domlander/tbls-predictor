import type Fixture from "src/types/Fixture";
import getMatchResultText from "utils/getMatchResultText";
import styles from "./GridRowFormTeam.module.css";
import GridRowKickoff from "../GridRowKickoff";

export type Props = {
  team: Fixture["homeTeam"];
  recentFixtures: Fixture[];
  isHome?: boolean;
};

const GridRowFormTeam = ({ team, recentFixtures, isHome = false }: Props) => {
  if (!recentFixtures.length) {
    return (
      <div
        className={[styles.noForm, isHome ? styles.home : styles.away].join(
          " "
        )}
      >
        No previous matches
      </div>
    );
  }

  return (
    <div
      className={[styles.container, isHome ? styles.home : styles.away].join(
        " "
      )}
    >
      {recentFixtures.map(
        ({ id, homeTeam, awayTeam, homeGoals, awayGoals, kickoff }) => {
          const teamGoals = team === homeTeam ? homeGoals : awayGoals;
          const oppoGoals = team === homeTeam ? awayGoals : homeGoals;

          const result = getMatchResultText(teamGoals, oppoGoals);
          const oppo = homeTeam === team ? `vs ${awayTeam}` : `at ${homeTeam}`;

          return (
            <div
              key={id}
              className={[
                styles.match,
                isHome ? styles.home : styles.away,
              ].join(" ")}
            >
              <div
                className={[
                  styles.result,
                  result === "Won" && styles.won,
                  result === "Lost" && styles.lost,
                ].join(" ")}
              >
                {result} {homeGoals}-{awayGoals} {oppo}
              </div>
              <GridRowKickoff kickoff={kickoff} isHome={isHome} />
            </div>
          );
        }
      )}
    </div>
  );
};

export default GridRowFormTeam;
