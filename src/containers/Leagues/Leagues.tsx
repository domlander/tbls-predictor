import Heading from "src/components/Heading";
import UserLeague from "src/types/UserLeague";
import styles from "./Leagues.module.css";
import LeaguesCardsList from "src/components/LeaguesCardsList";

type Props = {
  activeLeagues: UserLeague[];
};

const Leagues = ({ activeLeagues }: Props) => {
  return (
    <section className={styles.container}>
      <Heading level="h1" variant="secondary">
        My Leagues
      </Heading>
      <LeaguesCardsList leagues={activeLeagues} />
    </section>
  );
};

export default Leagues;
