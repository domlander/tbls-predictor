import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "prisma/client";
import CreateLeague from "src/containers/CreateLeague";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";

interface Props {
  currentGameweek: number;
}

const CreateLeaguePage = ({ currentGameweek }: Props) => (
  <CreateLeague currentGameweek={currentGameweek} />
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user?.id) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  const fixtures = await prisma.fixture.findMany({
    select: {
      id: true,
      gameweek: true,
      kickoff: true,
    },
  });

  const currentGameweek = calculateCurrentGameweek(fixtures);

  return {
    props: {
      currentGameweek,
    },
  };
};

export default CreateLeaguePage;
