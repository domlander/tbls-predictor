import styled from "styled-components";

import User from "src/types/User";
import Heading from "../Heading";

interface Props {
  participants: User[];
}

const LeagueParticipants = ({ participants }: Props) => (
  <div>
    <Heading level="h2" variant="secondary">
      Participants
    </Heading>
    {participants?.map((participant) => (
      <UserLabel key={participant.id}>{participant.username}</UserLabel>
    ))}
  </div>
);

const UserLabel = styled.p`
  font-size: 2em;
  margin-right: 1em;
`;

export default LeagueParticipants;
