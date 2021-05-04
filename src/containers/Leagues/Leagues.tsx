import React, { useState } from "react";
import Link from "next/link";
import styled from "styled-components";

import { League } from "@prisma/client";
import { useQuery } from "@apollo/client";
import { USER_LEAGUES } from "apollo/queries";
import Heading from "@/components/atoms/Heading";
import Loading from "@/components/atoms/Loading";
import colours from "@/styles/colours";

interface Props {
  userId: number;
}

const LeaguesContainer = ({ userId }: Props) => {
  const [leagues, setLeagues] = useState([]);

  const { loading, error } = useQuery(USER_LEAGUES, {
    variables: { id: userId },
    onCompleted: (data) => setLeagues(data?.userLeagues || []),
  });

  if (loading) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  return (
    <>
      <Heading level="h1">Leagues</Heading>
      {leagues?.length ? (
        <>
          <div>
            {leagues.map(({ id, name }: League) => (
              <div key={id}>
                <LeagueContainer>
                  <Link href={`/league/${id}`}>
                    <A>{name}</A>
                  </Link>
                </LeagueContainer>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No Leagues!</p>
      )}
    </>
  );
};

const LeagueContainer = styled.div`
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
  cursor: pointer;
`;

export default LeaguesContainer;
