import React from "react";
import Link from "next/link";
import styled from "styled-components";

import JoinNewLeagueForm from "@/components/JoinNewLeagueForm";
import { League } from "@prisma/client";
import HeaderBar from "@/components/molecules/HeaderBar";

interface Props {
  leagues: Array<League>;
}

const LeaguesContainer = ({ leagues }: Props) => (
  <>
    <HeaderBar initial="D" />
    <Title>Leagues</Title>
    {leagues?.length ? (
      <>
        <h2>My Leagues</h2>
        <div>
          {leagues.map((league) => (
            <div key={league.id}>
              <Link href={`/league/${league.id}`}>
                <a>{league.name}</a>
              </Link>
            </div>
          ))}
        </div>
      </>
    ) : null}
    <JoinNewLeagueForm />
  </>
);

export default LeaguesContainer;

const Title = styled.h1`
  color: green;
  font-size: 50px;
`;
