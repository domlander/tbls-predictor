import React from "react";
import Link from "next/link";
import { League } from "@prisma/client";
import Heading from "@/components/atoms/Heading";
import styled from "styled-components";
import colours from "@/styles/colours";

interface Props {
  leagues: Array<League>;
}

const LeaguesContainer = ({ leagues }: Props) => (
  <>
    <Heading level="h1">Leagues</Heading>
    {leagues?.length ? ( // TODO: Should we redirect the user to /league/join instead?
      <>
        <div>
          {leagues.map((league) => (
            <div key={league.id}>
              <LeagueNameContainer>
                <Link href={`/league/${league.id}`}>
                  <A>{league.name}</A>
                </Link>
              </LeagueNameContainer>
            </div>
          ))}
        </div>
      </>
    ) : (
      <p>No Leagues!</p>
    )}
  </>
);

const LeagueNameContainer = styled.div`
  background-color: ${colours.grey200};
  width: fit-content;
  font-size: 1.4em;
  margin: 32px;
  padding: 8px 16px;
  border-radius: 32px;
`;

const A = styled.a`
  color: ${colours.blackblue400};
  font-size: 1.4em;
`;

export default LeaguesContainer;
