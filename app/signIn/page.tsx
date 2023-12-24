import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "pages/api/auth/[...nextauth]";
import Heading from "src/components/Heading";
import styles from "./page.module.css";
import SignInButton from "./SignInButton";

export const dynamic = "force-dynamic";

// TODO: We are wrapping all pages in _app.tsx with the Layout component, as every component needs the layout
// except for this page. For now we are covering it up so the user cannot see it.
// We can't use useSession in _app.js, which is why we're loading the header.
const Page = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user.id) {
    return redirect("/");
  }

  return (
    <section>
      <Heading level="h1" variant="secondary">
        Welcome!
      </Heading>
      <div className={styles.buttonContainer}>
        <SignInButton />
      </div>
    </section>
  );
};

export default Page;
