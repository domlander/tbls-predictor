import React from "react";
import Link from "next/link";
import { League } from "@prisma/client";
import Heading from "@/components/atoms/Heading";

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
              <Link href={`/league/${league.id}`}>
                <a>{league.name}</a>
              </Link>
            </div>
          ))}
        </div>
      </>
    ) : (
      <p>No Leagues!</p>
    )}
  </>
);

export default LeaguesContainer;
