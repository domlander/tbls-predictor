import prisma from "prisma/client";
import { redirect } from "next/navigation";
import { auth } from "auth";
import { headers } from "next/headers";

import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import Heading from "src/components/Heading";
import Form from "./Form";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
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
      <Heading level="h1">Create League</Heading>
      <Form currentGameweek={currentGameweek} userId={session.user.id} />
    </section>
  );
};

export default Page;
