import * as Sentry from "@sentry/nextjs";
import { auth } from "auth";
import { redirect } from "next/navigation";
import prisma from "prisma/client";
import Account from "src/containers/Account/Account";
import { generateDefaultUsername } from "utils/generateDefaultUsername";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/signIn");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id || "",
    },
  });

  // If error in user data, redirect to login.
  if (!user || user.email === null || user.email === "") {
    Sentry.captureMessage("Login failed. Page: /account");
    return redirect("/");
  }

  let username = user?.username;

  /**
   * Give the user a default username if he doesn't have one
   *
   * TODO move this out of here to somewhere more general. I'm thinking that after a user
   * signs in/up, then this code will run. We don't want user to be in a league without a username.
   * Maybe we run it on the /league/join and /league/create pages?
   */
  if (!username) {
    const defaultUsername = generateDefaultUsername(user.email);
    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        username: defaultUsername,
      },
    });
    username = defaultUsername;
  }

  return <Account username={username} />;
};

export default Page;
