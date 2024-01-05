import User from "src/types/User";
import Heading from "../Heading";
import styles from "./LeagueParticipants.module.css";

interface Props {
  participants: Pick<User, "id" | "username">[];
}

const LeagueParticipants = ({ participants }: Props) => (
  <div>
    <Heading level="h2" variant="secondary">
      Participants
    </Heading>
    {participants?.map((participant) => (
      <p className={styles.label} key={participant.id}>
        {participant.username}
      </p>
    ))}
  </div>
);

export default LeagueParticipants;
