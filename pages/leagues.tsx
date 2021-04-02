import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Link from "next/link";
import styled from "styled-components";
import prisma from "prisma/client";

import CreateNewLeagueForm from "@/components/CreateNewLeagueForm";
import JoinNewLeagueForm from "@/components/JoinNewLeagueForm";
import Header from "@/components/Header";
import { League } from "@/types";
import redirectInternal from "../utils/redirects";

interface Props {
  leagues: Array<League>;
}

const LeaguesPage = ({ leagues }: Props) => (
  <>
    <Title>League</Title>
    <Header />
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
    <CreateNewLeagueForm />
  </>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the current session
  const session = await getSession(context);
  if (!session?.user.email) return redirectInternal("/");

  const user = await prisma.user.findUnique({
    include: {
      leagues: true,
    },
    where: {
      email: session?.user.email,
    },
  });
  if (!user?.leagues) return redirectInternal("/");

  return {
    props: {
      leagues: JSON.parse(JSON.stringify(user.leagues)),
    },
  };
};

export default LeaguesPage;

const Title = styled.h1`
  color: green;
  font-size: 50px;
`;
