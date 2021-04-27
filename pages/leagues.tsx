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
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  if (!session?.user.email) return redirectInternal("/");

  const user = await prisma.user.findUnique({
    include: {
      leagues: true,
    },
    where: {
      email: session?.user.email,
    },
  });

  // If the user does not belong to any leagues, get them to join a league
  if (!user?.leagues) return redirectInternal("/league/join");

  return {
    props: {
      leagues: JSON.parse(JSON.stringify(user.leagues)),
    },
  };
};

export default LeaguesPage;
