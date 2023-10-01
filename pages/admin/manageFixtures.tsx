import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Fixture } from "@prisma/client";
import prisma from "prisma/client";
import AdminManageFixtures from "src/containers/AdminManageFixtures";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";

interface Props {
  currentGameweek: number;
}

const ManageFixturesPage = ({ currentGameweek }: Props) => (
  <AdminManageFixtures gameweek={currentGameweek} />
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
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return {
      props: {},
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const allFixtures: Fixture[] = await prisma.fixture.findMany();
  const currentGameweek = calculateCurrentGameweek(allFixtures);

  return {
    props: {
      currentGameweek,
    },
  };
};

export default ManageFixturesPage;
