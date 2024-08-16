import Link from "next/link";

import { chivoMono } from "app/fonts";
import Fixture from "src/types/Fixture";
import KickoffTime from "src/components/LeagueWeekKickoff";
import LeagueWeekPrediction from "src/components/LeagueWeekPrediction";
import calculatePredictionScore from "utils/calculatePredictionScore";
import isPastDeadline from "utils/isPastDeadline";
import styles from "./LeagueWeekFixtures.module.css";

export type Props = {
  weekId: number;
  fixtures: Fixture[];
};

const LeagueWeekFixtures = ({ weekId, fixtures }: Props) => {
  return (
    <>
      {fixtures.map(
        ({
          id,
          kickoff,
          homeTeam,
          awayTeam,
          homeGoals,
          awayGoals,
          predictions,
        }) => (
          <section className={styles.container} key={id}>
            <div className={styles.fixtureRow}>
              <KickoffTime
                kickoff={kickoff}
                firstFixtureInWeek={fixtures[0].kickoff}
              />
              {isPastDeadline(kickoff) ? (
                <span className={styles.unclickableFixture}>
                  <span className={styles.homeTeam}>{homeTeam}</span>
                  <span className={chivoMono.className}>
                    {homeGoals}-{awayGoals}
                  </span>
                  <span className={styles.awayTeam}>{awayTeam}</span>
                </span>
              ) : (
                <Link
                  className={styles.fixtureRowLink}
                  href={`/predictions/${weekId}`}
                >
                  <span className={styles.clickableFixture}>
                    <span className={styles.homeTeam}>{homeTeam}</span>
                    <span>&nbsp;&nbsp;vs&nbsp;&nbsp;</span>
                    <span className={styles.awayTeam}>{awayTeam}</span>
                  </span>
                </Link>
              )}
            </div>
            {isPastDeadline(kickoff) ? (
              <div className={styles.predictionRow}>
                {predictions?.map((prediction) => {
                  const predictedHomeGoals = prediction.homeGoals ?? 0;
                  const predictedAwayGoals = prediction.awayGoals ?? 0;
                  const bigBoyBonus = prediction.bigBoyBonus ?? false;
                  const score = calculatePredictionScore(
                    [predictedHomeGoals, predictedAwayGoals, bigBoyBonus],
                    [homeGoals, awayGoals]
                  );

                  return (
                    <LeagueWeekPrediction
                      homeGoals={predictedHomeGoals}
                      awayGoals={predictedAwayGoals}
                      score={score}
                      isBigBoyBonus={bigBoyBonus}
                      key={`${prediction.fixtureId}-${prediction.user.id}`}
                    />
                  );
                })}
              </div>
            ) : null}
          </section>
        )
      )}
    </>
  );
};

export default LeagueWeekFixtures;
