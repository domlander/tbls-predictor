import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import prisma from "prisma/client";
import { Fixture } from "@prisma/client";
import UpdateResults from "@/containers/UpdateResults";

interface Props {
  fixtures: Fixture[];
}

const UpdateResultsPage = ({ fixtures }: Props) => (
  <UpdateResults fixtures={fixtures} />
);

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

  // TODO Replace with roles https://github.com/nextauthjs/next-auth/discussions/805
  if (session.user.email !== process.env.ADMIN_EMAIL) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  // Show all past fixtures. We may want to filter this to recent fixtures or fixtures without scores.
  const fixtures = await prisma.fixture.findMany({
    where: {
      kickoff: {
        lte: new Date(),
      },
    },
  });

  fixtures.sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
  );

  return {
    props: {
      fixtures: JSON.parse(JSON.stringify(fixtures)),
    },
  };
};

export default UpdateResultsPage;
