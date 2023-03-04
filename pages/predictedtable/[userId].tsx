import React from "react";
import { GetServerSideProps } from "next";
import UsersPredictedTable from "src/containers/UsersPredictedTable";
import User from "src/types/User";
import redirectInternal from "utils/redirects";

type Props = {
  userId: User["id"];
};

const Page = ({ userId }: Props) => {
  return <UsersPredictedTable userId={userId} />;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // Get the user ID from the URL
  if (!params?.userId) return redirectInternal("");

  return {
    props: {
      userId: params.userId,
    },
  };
};

export default Page;
