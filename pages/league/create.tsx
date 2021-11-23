import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import CreateLeague from "@/containers/CreateLeague";

const CreateLeaguePage = () => <CreateLeague />;

export default CreateLeaguePage;

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
