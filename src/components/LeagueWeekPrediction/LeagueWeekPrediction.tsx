import { chivoMono } from "app/fonts";
import styles from "./LeagueWeekPrediction.module.css";

export type Props = {
  homeGoals: number;
  awayGoals: number;
  score: number;
  isBigBoyBonus: boolean;
};

const LeagueWeekPrediction = ({
  homeGoals,
  awayGoals,
  score,
  isBigBoyBonus,
}: Props) => {
  let chip = "";
  if (score >= 3) chip = "perfect";
  else if (score >= 1) chip = "correct";

  return (
    <div
      className={[chivoMono.className, styles.container, styles[chip]].join(
        " "
      )}
    >
      <div className={[styles.prediction, styles[chip]].join(" ")}>
        {homeGoals}-{awayGoals}
      </div>
      {isBigBoyBonus && (
        <div
          className={[styles.prediction, styles[chip], styles.bigBoyBonus].join(
            " "
          )}
        >
          {homeGoals}-{awayGoals}
        </div>
      )}
    </div>
  );
};

export default LeagueWeekPrediction;
