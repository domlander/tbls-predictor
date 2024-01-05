import styles from "./UserIcon.module.css";

export interface Props {
  initial: string;
  handleClick?: () => void;
}

const UserIcon = ({ initial, handleClick }: Props) => {
  return handleClick ? (
    <button
      className={styles.clickableCircle}
      onClick={handleClick}
      tabIndex={0}
    >
      <p className={styles.name}>{initial}</p>
    </button>
  ) : (
    <div className={styles.circle}>
      <p className={styles.name}>{initial}</p>
    </div>
  );
};

export default UserIcon;
