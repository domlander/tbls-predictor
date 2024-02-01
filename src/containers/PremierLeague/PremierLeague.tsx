import { Fragment } from "react";
import Heading from "src/components/Heading";
import type { PremierLeagueTeam } from "src/types/PremierLeagueTeam";
import styles from "./PremierLeague.module.css";

type Props = {
  teams: PremierLeagueTeam[];
  heading?: string;
  loading?: boolean;
  isPredictedLeague?: boolean;
};

const getPositionColour = (position: number): string => {
  switch (position) {
    case 1:
      return "winner";

    case 2:
    case 3:
    case 4:
      return "championsLeague";

    case 18:
    case 19:
    case 20:
      return "relegation";

    default:
      return "none";
  }
};

const PremierLeague = ({
  teams,
  heading = "Premier League",
  loading = false,
  isPredictedLeague = false,
}: Props) => {
  return (
    <div className={styles.container}>
      <Heading level="h1">{heading}</Heading>
      {isPredictedLeague ? (
        <p className={styles.explainer}>
          The Premier League table if all of your predictions were perfect.
          Missed predictions use the actual result of the game.
        </p>
      ) : null}
      <div className={isPredictedLeague ? styles.predictedTable : styles.table}>
        <div className={styles.headerRow}>
          <div className={styles.headerData} />
          <div className={styles.headerData}>Club</div>
          <div className={styles.headerData}>P</div>
          <div className={styles.headerData}>W</div>
          <div className={styles.headerData}>D</div>
          <div className={styles.headerData}>L</div>
          {!isPredictedLeague && (
            <>
              <div className={styles.headerData}>GF</div>
              <div className={styles.headerData}>GA</div>
            </>
          )}
          <div className={styles.headerData}>GD</div>
          {isPredictedLeague ? (
            <>
              <div className={styles.headerData}>PTS</div>
              <div className={styles.headerData}>Act.</div>
            </>
          ) : (
            <div className={styles.headerDataPoints}>PTS</div>
          )}
        </div>
        {loading
          ? [...Array(20)].map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={i}>
                <div className={styles.position}>{i + 1}</div>
                <div className={styles.loadingRow} />
              </Fragment>
            ))
          : teams?.map(
              (
                {
                  name,
                  played,
                  wins,
                  draws,
                  losses,
                  goalsScored,
                  goalsConceded,
                  goalDifference,
                  predictedPoints,
                  points,
                },
                i
              ) => {
                const positionClass = getPositionColour(i + 1);
                return (
                  <div className={styles.row} key={name}>
                    <div
                      className={[styles.position, styles[positionClass]].join(
                        " "
                      )}
                    >
                      {i + 1}
                    </div>
                    <div className={styles.team}>{name}</div>
                    <div>{played}</div>
                    <div>{wins}</div>
                    <div>{draws}</div>
                    <div>{losses}</div>
                    {!isPredictedLeague && (
                      <>
                        <div>{goalsScored}</div>
                        <div>{goalsConceded}</div>
                      </>
                    )}
                    <div>{goalDifference}</div>
                    {isPredictedLeague ? (
                      <>
                        <div className={styles.points}>{predictedPoints}</div>
                        <div>{points}</div>
                      </>
                    ) : (
                      <div className={styles.points}>{points}</div>
                    )}
                  </div>
                );
              }
            )}
      </div>
    </div>
  );
};

export default PremierLeague;
