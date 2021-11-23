import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

import Leagues from "src/containers/Leagues";

interface Props {
  userId: number;
}
const LeaguesPage = ({ userId }: Props) => {
  return <Leagues userId={userId} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      userId: session?.user.id,
    },
  };
};

export default LeaguesPage;
