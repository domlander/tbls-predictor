import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import JoinLeague from "@/containers/JoinLeague";

const JoinLeaguePage = () => <JoinLeague />;

export default JoinLeaguePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user.id) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
