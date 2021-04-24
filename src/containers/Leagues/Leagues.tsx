import React from "react";
import Link from "next/link";
import styled from "styled-components";

import JoinNewLeagueForm from "@/components/JoinNewLeagueForm";
import { League } from "@prisma/client";
import HeaderBar from "@/components/molecules/HeaderBar";
import Heading from "@/components/atoms/Heading";

interface Props {
  leagues: Array<League>;
}

const LeaguesContainer = ({ leagues }: Props) => (
  <>
    <HeaderBar initial="D" />
    <Heading level="h1">Leagues</Heading>
    {leagues?.length ? (
      <>
        <Heading level="h2">My leagues</Heading>
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
