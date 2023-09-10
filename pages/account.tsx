import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import * as Sentry from "@sentry/nextjs";
import prisma from "prisma/client";
import Account from "src/containers/Account/Account";
import { generateDefaultUsername } from "utils/generateDefaultUsername";

type Props = {
  username: string;
};

const AccountPage = ({ username }: Props) => (
  <Account initialUsername={username} />
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

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id || "",
    },
  });

  // If error in user data, redirect to login.
  if (!user || user.email === null || user.email === "") {
    Sentry.captureMessage("Login failed. Page: /account");
    return {
      props: {},
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
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

  return {
    props: {
      username,
    },
  };
};

export default AccountPage;
