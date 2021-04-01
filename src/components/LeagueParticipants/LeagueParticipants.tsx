import { User } from "@prisma/client";
import React from "react";

interface Props {
  participants: User[];
}

const LeagueParticipants = ({ participants }: Props) => (
  <>
    <h4>Participants</h4>
    {participants?.map((participant) => (
      <div key={participant.id}>{participant.username}</div>
    ))}
  </>
);

export default LeagueParticipants;
