import React from "react";
import Link from "next/link";
import styled from "styled-components";

import { League } from "@prisma/client";
import { useQuery } from "@apollo/client";
import { USER_LEAGUES } from "apollo/queries";
import Heading from "@/components/atoms/Heading";
import Loading from "@/components/atoms/Loading";
import colours from "@/styles/colours";
import { useSession } from "next-auth/client";

const LeaguesContainer = () => {
  const [session] = useSession();
  if (!session?.user.email) return null;

  const { data, loading, error } = useQuery(USER_LEAGUES, {
    variables: { email: session.user.email },
  });

  if (loading) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  const leagues = data?.userLeagues || [];

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
