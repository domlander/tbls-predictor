import { Fragment } from "react";

import {
  formatFixtureKickoffTime,
  whenIsTheFixture,
} from "utils/kickoffDateHelpers";
import Button from "src/components/Button";
import Fixture from "src/types/Fixture";
import styles from "./PredictionsTable.module.css";
import GridRowFixtureLoading from "../GridRowFixtureLoading";
import { chivoMono } from "app/fonts";

interface Props {
  fixtures: Fixture[];
}

const PredictionsTableLoading = ({ fixtures }: Props) => {
  const firstFixtureKickoffTiming = whenIsTheFixture(fixtures[0].kickoff);

  return (
    <article>
      <div className={styles.statsToggleContainer}>
        <Button variant="secondary" size="small" disabled>
          Show team form
        </Button>
      </div>
      <div className={[styles.table].join(" ")}>
        {fixtures.map(
          ({ id, kickoff, homeTeam, awayTeam, homeGoals, awayGoals }, i) => {
            return (
              <Fragment key={id}>
                <GridRowFixtureLoading
                  fixtureId={id}
                  kickoff={formatFixtureKickoffTime(
                    kickoff,
                    firstFixtureKickoffTiming
                  )}
                  homeTeam={homeTeam}
                  awayTeam={
                    homeGoals !== null && awayGoals !== null ? (
                      <div className={styles.awayTeam}>
                        <span>{awayTeam}</span>
                        <span
                          className={[
                            chivoMono.className,
                            styles.fullTimeResult,
                          ].join(" ")}
                        >
                          <span>FT</span>
                          <span>
                            {homeGoals}-{awayGoals}
                          </span>
                        </span>
                      </div>
                    ) : (
                      <span>{awayTeam}</span>
                    )
                  }
                  topRow={i === 0}
                />
              </Fragment>
            );
          }
        )}
      </div>
      <div className={styles.buttonsAndMessageContainer}>
        <div className={styles.buttonContainer}>
          <Button id="save" type="submit" variant="primary" disabled={true}>
            Save predictions
          </Button>
        </div>
        <p className={styles.userFeedback}>Loading predictions...</p>
      </div>
    </article>
  );
};

export default PredictionsTableLoading;
