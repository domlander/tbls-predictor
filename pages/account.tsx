import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import prisma from "prisma/client";
import { generateDefaultUsername } from "@/utils";
import Account from "src/containers/Account/Account";

interface Props {
  username: string;
}

const AccountPage = ({ username }: Props) => <Account username={username} />;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
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
      email: session.user.email || "",
    },
  });

  // If error in user data, redirect to login.
  if (!user || user.email === null || user.email === "") {
    // TODO: Add some logging here. If this fails, something weird has happened
    return {
      props: {},
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const defaultUsername = generateDefaultUsername(user.email);

  // Give the user a default username if he doesn't have one
  if (user && !user.username) {
    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        username: defaultUsername,
      },
    });
  }

  return { props: { session, username: user.username || defaultUsername } };
};

export default AccountPage;
