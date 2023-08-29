import { GetStaticProps, GetStaticPaths } from "next";
import prisma from "prisma/client";

import { initializeApollo } from "apollo/client";
import { LEAGUE_QUERY } from "apollo/queries";
import LeagueHome from "src/containers/League";
import User from "src/types/User";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import redirectInternal from "utils/redirects";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";

interface Props {
  id: number;
  name: string;
  gameweekStart: number;
  gameweekEnd: number;
  users: User[];
  administratorId: string;
  fixtureWeeksAvailable: number[];
}

const LeaguePage = ({
  id,
  name,
  gameweekStart,
  gameweekEnd,
  administratorId,
  users,
  fixtureWeeksAvailable,
}: Props) => (
  <LeagueHome
    id={id}
    name={name}
    gameweekStart={gameweekStart}
    gameweekEnd={gameweekEnd}
    administratorId={administratorId}
    users={users}
    fixtureWeeksAvailable={fixtureWeeksAvailable}
  />
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Get the leagueId from the URL
  const leagueId = convertUrlParamToNumber(params?.leagueId);
  if (!leagueId || leagueId <= 0) return redirectInternal("/leagues");

  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: LEAGUE_QUERY,
    variables: { leagueId },
    errorPolicy: "ignore",
  });
  if (!data) return { notFound: true };

  const {
    league,
    league: { gameweekStart, gameweekEnd, users },
  } = data;

  const fixtures = await prisma.fixture.findMany({
    select: {
      id: true,
      gameweek: true,
      kickoff: true,
    },
  });

  const currentGameweek = calculateCurrentGameweek(fixtures);

  const gameweeksPlayed =
    Math.min(currentGameweek, gameweekEnd) - gameweekStart + 1;

  const fixtureWeeksAvailable =
    gameweeksPlayed > 0
      ? [...Array(gameweeksPlayed).keys()]
          .map((x) => x + gameweekStart)
          .reverse()
      : null;

  return {
    props: {
      id: leagueId,
      name: league.name,
      gameweekStart,
      gameweekEnd,
      users,
      administratorId: league.administratorId,
      fixtureWeeksAvailable,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const leagues = await prisma.league.findMany();
  const paths = leagues.map((x) => ({
    params: { leagueId: x.id.toString() },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export default LeaguePage;
