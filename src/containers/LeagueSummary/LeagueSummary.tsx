import React from "react";
import styled from "styled-components";
import Link from "next/link";

import Header from "@/components/Header";
import { League } from "@prisma/client";
import { WeeklyScores } from "@/types";
import WeeklyScoresTable from "@/components/WeeklyScoresTable";
import LeagueTable from "@/components/LeagueTable";

interface Props {
  leagueName: League["name"];
  weeklyScores: WeeklyScores[];
}

const LeagueTableContainer = ({ leagueName, weeklyScores }: Props) => {
  console.log("weeklyScores", JSON.stringify(weeklyScores, null, 2));

  const participants = weeklyScores[0].users.map((user) => ({
    id: user.id,
    username: user.username,
  }));
  console.log("participants", JSON.stringify(participants, null, 2));

  const totalScores = participants.map((p) => ({
    id: p.id,
    username: p.username,
    score: weeklyScores.reduce(
      (acc, cur) => acc + cur.users.find((u) => u.id === p.id).score || 0,
      0
    ),
  }));
  console.log("totalScores", JSON.stringify(totalScores, null, 2));

  return (
    <Container>
      <Header />
      <div>
        <Link href="/league/9">
          <a>Predictions</a>
        </Link>
      </div>
      <Title>{leagueName}</Title>
      <LeagueTable entries={totalScores} />
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
