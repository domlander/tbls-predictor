import React from "react";
import { GetServerSideProps } from "next";
import UsersPredictedTable from "src/containers/UsersPredictedTable";
import User from "src/types/User";
import redirectInternal from "utils/redirects";
import prisma from "prisma/client";

type Props = {
  userId: User["id"];
  username: User["username"];
};

const Page = ({ userId, username }: Props) => {
  return <UsersPredictedTable userId={userId} username={username} />;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (typeof params?.userId !== "string") return redirectInternal("");

  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: {
      username: true,
    },
  });
  if (!user) return redirectInternal("");

  return {
    props: {
      userId: params.userId,
      username: user.username,
    },
  };
};

export default Page;
