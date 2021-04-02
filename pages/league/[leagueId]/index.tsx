import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

import prisma from "prisma/client";
import { convertUrlParamToNumber } from "@/utils";
import redirectInternal from "../../../utils/redirects";

const RedirectURL = () => null;

/*
  - If the User hits this page they have gone to "/league/{their league ID}"
  - I think they will always want to go the their current weekly predictions, regardless of league
    state (not started, pre-GW, mid-GW), so we should redirect them to their current gameweek predictions.
    That means showing them their predictions if we're in a gameweek, or showing them next weeks predictions if
    we are post-GW
*/
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;

  const session = await getSession(context);
  if (!session) return redirectInternal("/");

  // Get the logged in user
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user.email || "",
    },
    include: {
      leagues: true,
    },
  });

  if (!params?.leagueId || !user?.leagues) return redirectInternal("/leagues");

  // Get the league ID
  const leagueId = convertUrlParamToNumber(params.leagueId);

  // If the user is not a member of this league, redirect them to leagues
  if (!user.leagues.some((league) => league.id === leagueId))
    return redirectInternal("/leagues");

  // TODO: Currently sending them to GW 1, but we should send them to the right GW
  return redirectInternal(`/league/${leagueId}/week/1`);
};

export default RedirectURL;
