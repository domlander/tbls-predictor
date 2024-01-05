import styles from "./GridItemKickoff.module.css";

export type Props = {
  label: string;
  locked: boolean;
  topRow: boolean;
};

const GridItemKickoff = ({ label, locked, topRow }: Props) => (
  <span
    className={[
      styles.kickoff,
      locked && styles.locked,
      topRow && styles.topRow,
    ].join(" ")}
  >
    {label}
  </span>
);

export default GridItemKickoff;
