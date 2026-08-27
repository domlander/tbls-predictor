import { Suspense } from "react";
import { auth } from "auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import MyLeaguesLoading from "src/components/MyLeagues/MyLeaguesLoading";
import MyLeagues from "src/components/MyLeagues";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const userId = session?.user?.id;
  if (!userId) {
    return redirect("/signIn");
  }

  return (
    <section className={styles.container}>
      <Suspense fallback={<MyLeaguesLoading />}>
        <MyLeagues userId={userId} />
      </Suspense>
    </section>
  );
};

export default Page;
