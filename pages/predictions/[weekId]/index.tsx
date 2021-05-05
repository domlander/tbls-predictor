import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

import { convertUrlParamToNumber } from "@/utils";
import Predictions from "src/containers/Predictions";
import redirectInternal from "utils/redirects";

interface Props {
  userId: number;
  weekId: number;
}

const PredictionsPage = ({ userId, weekId }: Props) => (
  <Predictions userId={userId} weekId={weekId} />
);

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

  const weekId = convertUrlParamToNumber(context.params?.weekId);
  if (!weekId || weekId <= 0) return redirectInternal("/");

  return {
    props: {
      userId: session.user.id,
      weekId,
    },
  };
};

export default PredictionsPage;
