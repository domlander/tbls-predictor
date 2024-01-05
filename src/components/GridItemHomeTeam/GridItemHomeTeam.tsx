import Chip from "../Chip";
import styles from "./GridItemHomeTeam.module.css";

export type Props = {
  isBbb?: boolean;
  label: string;
  predictionScore?: number;
  locked?: boolean;
  topRow?: boolean;
};

const GridItemHomeTeam = ({
  isBbb = false,
  label,
  predictionScore,
  topRow = false,
  locked = false,
}: Props) => {
  return (
    <div
      className={[
        styles.container,
        topRow && styles.topRow,
        locked && styles.locked,
      ].join(" ")}
    >
      <span className={styles.label}>{label}</span>
      {(isBbb || predictionScore) && (
        <div className={styles.chips}>
          {predictionScore && predictionScore >= 1 && (
            <Chip variant={predictionScore >= 3 ? "perfect" : "correct"} />
          )}
          {isBbb && <Chip variant="bigBoyBonus" />}
        </div>
      )}
    </div>
  );
};

export default GridItemHomeTeam;
