import { chivoMono } from "app/fonts";
import styles from "./LeagueWeekUserScore.module.css";

export type Props = {
  score: number;
};

const LeagueWeekUserScore = ({ score }: Props) => (
  <div className={[chivoMono.className, styles.total].join(" ")}>{score}</div>
);

export default LeagueWeekUserScore;
