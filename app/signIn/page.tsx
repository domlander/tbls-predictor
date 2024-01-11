import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "app/api/auth/[...nextauth]/route";
import styles from "./page.module.css";
import SignInButton from "./SignInButton";

// TODO: We are wrapping all pages in _app.tsx with the Layout component, as every component needs the layout
// except for this page. For now we are covering it up so the user cannot see it.
// We can't use useSession in _app.js, which is why we're loading the header.
const Page = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user.id) {
    return redirect("/");
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>Predictor</h1>
      <p className={styles.text}>Premier League final score prediction game</p>
      <div className={styles.buttonContainer}>
        <SignInButton />
      </div>
    </section>
  );
};

export default Page;
