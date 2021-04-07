import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import prisma from "prisma/client";

import { League } from "@prisma/client";
import Leagues from "src/containers/Leagues";
import redirectInternal from "../utils/redirects";

interface Props {
  leagues: Array<League>;
}

const LeaguesPage = ({ leagues }: Props) => <Leagues leagues={leagues} />;

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
