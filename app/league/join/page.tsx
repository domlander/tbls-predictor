import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "pages/api/auth/[...nextauth]";
import Heading from "src/components/Heading";
import Form from "./Form";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return redirect("/signIn");
  }

  return (
    <section className={styles.container}>
      <Heading level="h1" variant="secondary">
        Join League
      </Heading>
      <Form />
    </section>
  );
};

export default Page;
