import styles from "./Chip.module.css";

const variants = {
  perfect: {
    label: "PERFECT",
  },
  correct: {
    label: "CORRECT",
  },
  bigBoyBonus: {
    label: "2X",
  },
};

export interface Props {
  variant: "perfect" | "correct" | "bigBoyBonus";
}

const Chip = ({ variant }: Props) => {
  return (
    <div className={[styles.container, styles[variant]].join(" ")}>
      <div className={styles.label}>{variants[variant].label}</div>
    </div>
  );
};

export default Chip;
