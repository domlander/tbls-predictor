import React from "react";
import styled from "styled-components";
import Link from "next/link";

import Header from "@/components/Header";
import { League } from "@prisma/client";
import { Participant, UserWeeklyScore, WeeklyScores } from "@/types";
import WeeklyScoresTable from "@/components/WeeklyScoresTable";
import LeagueTable from "@/components/LeagueTable";

interface Props {
  leagueName: League["name"];
  weeklyScores: WeeklyScores[];
}

const LeagueTableContainer = ({ leagueName, weeklyScores }: Props) => {
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
      <Header />
      <div>
        <Link href="/league/9">
          <a>Predictions</a>
        </Link>
      </div>
      <Title>{leagueName}</Title>
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

const Title = styled.h1`
  align-self: center;
  color: orange;
  font-size: 30px;
  margin: 2em 0;
`;

export default LeagueTableContainer;
