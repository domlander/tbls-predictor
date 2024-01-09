import UserLeague from "src/types/UserLeague";
import Heading from "src/components/Heading";
import LeaguesCardsList from "../LeaguesCardsList";
import styles from "./MyFinishedLeagues.module.css";

export interface Props {
  leagues: UserLeague[];
}

const MyFinishedLeagues = ({ leagues }: Props) => {
  return (
    <section className={styles.container}>
      <Heading level="h2">Finished leagues</Heading>
      <LeaguesCardsList leagues={leagues} />
    </section>
  );
};

export default MyFinishedLeagues;
