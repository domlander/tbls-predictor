import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

import Leagues from "src/containers/Leagues";
import Heading from "@/components/atoms/Heading";

interface Props {
  userId: number | null;
}

const LeaguesPage = ({ userId }: Props) => {
  return (
    <>
      <Heading level="h1">Leagues</Heading>
      <Leagues userId={userId} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      userId: session?.user?.id || null,
    },
  };
};

export default LeaguesPage;
