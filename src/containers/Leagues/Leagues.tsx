import React from "react";
import Link from "next/link";
import styled from "styled-components";

import { League } from "@prisma/client";
import { useQuery } from "@apollo/client";
import { GET_USER_LEAGUES } from "pages/leagues";
import Heading from "@/components/atoms/Heading";
import Loading from "@/components/atoms/Loading";
import colours from "@/styles/colours";

const LeaguesContainer = () => {
  const { data, loading, error } = useQuery(GET_USER_LEAGUES, {
    variables: { email: "domtest722@mailinator.com" },
    fetchPolicy: "cache-first",
  });

  if (loading) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  const leagues = data?.leagues || [];

  return (
    <>
      <Heading level="h1">Leagues</Heading>
      {leagues?.length ? (
        <>
          <div>
            {leagues.map(({ id, name }: League) => (
              <div key={id}>
                <LeagueNameContainer>
                  <Link href={`/league/${id}`}>
                    <A>{name}</A>
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
};

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
  cursor: pointer;
`;

export default LeaguesContainer;
