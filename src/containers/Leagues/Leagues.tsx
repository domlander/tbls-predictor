import Heading from "src/components/Heading";
import MyLeagues from "src/components/MyLeagues";
import UserLeague from "src/types/UserLeague";
import styles from "./Leagues.module.css";

type Props = {
  activeLeagues: UserLeague[];
};

const Leagues = ({ activeLeagues }: Props) => {
  return (
    <section className={styles.section}>
      <Heading level="h1" variant="secondary">
        Leagues
      </Heading>
      <MyLeagues leagues={activeLeagues} loading={false} />
    </section>
  );
};

export default Leagues;
