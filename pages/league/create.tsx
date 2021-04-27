import CreateLeague from "@/containers/CreateLeague";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import React from "react";

const CreateLeaguePage = () => <CreateLeague />;

export default CreateLeaguePage;

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

  return { props: {} };
};
