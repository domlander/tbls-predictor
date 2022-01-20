import React from "react";
import styled from "styled-components";

import { User } from "src/types/NewTypes";
import Heading from "../atoms/Heading";

interface Props {
  participants: User[];
}

const LeagueParticipants = ({ participants }: Props) => (
  <div>
    <Heading level="h2">Participants</Heading>
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
