import prisma from "prisma/client";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import Heading from "src/components/Heading";
import Form from "./Form";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return redirect("/signIn");
  }

  const fixtures = await prisma.fixture.findMany({
    select: {
      id: true,
      gameweek: true,
      kickoff: true,
    },
  });
  const currentGameweek = calculateCurrentGameweek(fixtures);

  return (
    <section className={styles.container}>
      <Heading level="h1" variant="secondary">
        Create League
      </Heading>
      <Form currentGameweek={currentGameweek} userId={session.user.id} />
    </section>
  );
};

export default Page;
