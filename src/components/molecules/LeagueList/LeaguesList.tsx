import { League } from "@prisma/client";
import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";

import pageSizes from "@/styles/pageSizes";
import Heading from "../../atoms/Heading";
import colours from "../../../styles/colours";

export interface Props {
  leagues: Partial<League>[];
}

const LeaguesList = ({ leagues }: Props) => {
  const router = useRouter();
  if (!leagues?.length)
    return (
      <NoLeagues>
        <p>No Leagues!</p>
        <Link href="/league/join">
          <a>Join</a>
        </Link>
      </NoLeagues>
    );

  return (
    <Leagues>
      {leagues.map(({ id, name }) => (
        <LeagueCard
          tabIndex={0}
          key={id}
          onClick={() => router.push(`/league/${id}`)}
        >
          <LeagueCardHeading level="h2">{name}</LeagueCardHeading>
          <LeagueCardInfo>
            Current position: <span style={{ fontWeight: 700 }}>Unknown</span>
          </LeagueCardInfo>
          <LeagueCardInfo>
            Finish: <span style={{ fontWeight: 700 }}>Unknown</span>
          </LeagueCardInfo>
        </LeagueCard>
      ))}
    </Leagues>
  );
};

const NoLeagues = styled.div`
  font-size: 2em;
  display: flex;

  p {
    margin: 0;
  }

  a {
    margin-left: 1em;
    text-decoration: underline;
    text-underline-offset: 0.2em;

    :hover,
    :focus {
      color: ${colours.blue100};
    }
  }
`;

const Leagues = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 400px);
  grid-gap: 2em;

  @media (max-width: ${pageSizes.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const LeagueCard = styled.div`
  border: 1px solid ${colours.grey300};
  padding: 3.2em;
  cursor: pointer;

  :hover,
  :focus {
    background-color: #ffffff10;
  }
`;

const LeagueCardHeading = styled(Heading)`
  margin: 0;
`;

const LeagueCardInfo = styled.div`
  font-size: 2em;
  margin-top: 1em;
`;

export default LeaguesList;
