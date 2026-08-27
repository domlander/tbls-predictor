import Participant from "src/types/Participant";
import Heading from "../Heading";
import styles from "./LeagueParticipants.module.css";

interface Props {
  participants: Participant[];
}

const LeagueParticipants = ({ participants }: Props) => (
  <div>
    <Heading level="h2">Participants</Heading>
    {participants?.map((participant) => (
      <p className={styles.label} key={participant.id}>
        {participant.username}
      </p>
    ))}
  </div>
);

export default LeagueParticipants;
