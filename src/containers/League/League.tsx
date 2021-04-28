import React from "react";
import styled from "styled-components";

import { League } from "@prisma/client";
import { Participant, UserWeeklyScore, WeeklyScores } from "@/types";
import WeeklyScoresTable from "@/components/WeeklyScoresTable";
import LeagueTable from "@/components/LeagueTable";
import Heading from "@/components/atoms/Heading";

interface Props {
  leagueName: League["name"];
  weeklyScores: WeeklyScores[];
}

const LeagueContainer = ({ leagueName, weeklyScores }: Props) => {
  const participants: Participant[] = weeklyScores[0].users.map((user) => ({
    id: user.id,
    username: user.username || "unknown",
  }));

  const totalScores: UserWeeklyScore[] = participants.map((p) => ({
    id: p.id,
    username: p.username,
    score: weeklyScores.reduce((acc, cur) => {
      const user = cur.users.find((u) => u.id === p.id);
      return acc + (user?.score || 0);
    }, 0),
  }));

  const totalScoresOrdered: UserWeeklyScore[] = [...totalScores].sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  return (
    <Container>
      <Heading level="h1">{leagueName}</Heading>
      <LeagueTable totalScores={totalScoresOrdered} />
      <WeeklyScoresTable
        participants={participants}
        weeklyScores={weeklyScores}
        totalScores={totalScores}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export default LeagueContainer;
