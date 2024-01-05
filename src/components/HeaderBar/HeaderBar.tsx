import Link from "next/link";
import styles from "./HeaderBar.module.css";
import UserIcon from "../UserIcon";

export interface Props {
  initial: string;
  isLoading: boolean;
  handleClick?: () => void;
}

const HeaderBar = ({ initial, isLoading, handleClick }: Props) => (
  <div className={styles.container}>
    <nav className={styles.nav}>
      <ul className={styles.ul}>
        <li className={styles.li}>
          <Link href="/">Home</Link>
        </li>
        <li className={styles.li}>
          <Link href="/predictions">Predictions</Link>
        </li>
        <li className={styles.li}>
          <Link href="/leagues">Leagues</Link>
        </li>
        <li className={styles.li}>
          <Link href="/premierleague">Table</Link>
        </li>
      </ul>
    </nav>
    <div>
      {!isLoading ? (
        <UserIcon initial={initial} handleClick={handleClick} />
      ) : null}
    </div>
  </div>
);

export default HeaderBar;
