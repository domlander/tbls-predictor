import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import Predictions from "src/containers/Predictions";
import redirectInternal from "utils/redirects";

interface Props {
  userId: number;
  weekId: number;
}

const PredictionsPage = ({ userId, weekId }: Props) => (
  <>
    {/* <Head>
      <meta
        name="description"
        content="Leicester host Arsenal, whilst Man Utd and Everton travel to Spurs and Wolves respectively, hoping to bounce back from large home defeats."
      />
      <meta
        property="og:description"
        content="Leicester host Arsenal, whilst Man Utd and Everton travel to Spurs and Wolves respectively, hoping to bounce back from large home defeats."
      />
    </Head> */}
    <Predictions userId={userId} weekId={weekId} showWeekNavigation />
  </>
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
