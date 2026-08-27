import { auth } from "auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

  return (
    <section className={styles.container}>
      <Heading level="h1">Join League</Heading>
      <Form />
    </section>
  );
};

export default Page;
