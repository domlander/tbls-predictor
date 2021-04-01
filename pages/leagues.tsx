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
    <h2>My Leagues</h2>
    {leagues?.length ? (
      leagues.map((league) => (
        <div key={league.id}>
          <Link href={`/league/${league.id}`}>
            <a>{league.name}</a>
          </Link>
        </div>
      ))
    ) : (
      <p>No leagues found.</p>
    )}
    <CreateNewLeagueForm />
    <JoinNewLeagueForm />
  </>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the current session
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: "/" });
    context.res.end();
  }

  if (!session?.user.email) {
    return redirectInternal("/leagues");
  }

  const user = await prisma.user.findUnique({
    include: {
      leagues: true,
    },
    where: {
      email: session?.user.email,
    },
  });

  console.log("user", user);

  // Create empty leagues array if one doesn't exist
  if (!user?.leagues) {
    console.log("User does not belong to any leagues.");
  }

  return {
    props: {
      leagues: user?.leagues ? JSON.parse(JSON.stringify(user.leagues)) : null,
    },
  };
};

export default LeaguesPage;

const Title = styled.h1`
  color: green;
  font-size: 50px;
`;
