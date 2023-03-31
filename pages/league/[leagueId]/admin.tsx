import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import LeagueAdmin from "src/containers/LeagueAdmin";
import redirectInternal from "../../../utils/redirects";

interface Props {
  leagueId: number;
}

const LeagueAdminPage = ({ leagueId }: Props) => (
  <LeagueAdmin leagueId={leagueId} />
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

  // Get the leagueId from the URL
  const leagueId = convertUrlParamToNumber(context.params?.leagueId);
  if (!leagueId || leagueId <= 0) return redirectInternal("/leagues");

  return {
    props: {
      leagueId,
    },
  };
};

export default LeagueAdminPage;
