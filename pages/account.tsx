import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import prisma from "prisma/client";
import { generateDefaultUsername } from "@/utils";
import Account from "src/containers/Account/Account";
import redirectInternal from "utils/redirects";

interface Props {
  userId: number;
}

const AccountPage = ({ userId }: Props) => <Account userId={userId} />;

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
  if (!session?.user.id) return redirectInternal("/");

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
  // TODO move this out of here to somewhere more general. I'm thinking that after a user
  // signs in/up, then this code will run. We don't want user to be in a league without a username.
  // Maybe we run it on the /league/join and /league/create pages?
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

  return {
    props: {
      userId: session?.user.id,
    },
  };
};

export default AccountPage;
