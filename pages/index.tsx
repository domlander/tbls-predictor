import React from "react";
import Home from "@/containers/Home";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

export default function HomePage() {
  return <Home />;
}

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
