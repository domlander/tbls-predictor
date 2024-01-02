import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "app/api/auth/[...nextauth]/route";
import MyLeaguesLoading from "src/components/MyLeagues/MyLeaguesLoading";
import MyLeagues from "src/components/MyLeagues";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await getServerSession(authOptions);
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
