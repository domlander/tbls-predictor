import React, { useState } from "react";

import { League } from "@prisma/client";
import { useQuery } from "@apollo/client";
import { LEAGUES_QUERY } from "apollo/queries";
import Heading from "@/components/atoms/Heading";
import Loading from "@/components/atoms/Loading";
import LeaguesList from "@/components/molecules/LeagueList";
import PublicLeaguesList from "@/components/molecules/PublicLeaguesList";

interface Props {
  userId: number | null;
}

const LeaguesContainer = ({ userId }: Props) => {
  const [userleagues, setUserLeagues] = useState<Partial<League>[]>([]);
  const [publicLeagues, setPublicLeagues] = useState<Partial<League>[]>([]);

  const { loading, error } = useQuery(LEAGUES_QUERY, {
    variables: { input: { userId } },
    onCompleted: (data) => {
      setUserLeagues(data?.leagues?.userLeagues || []);
      setPublicLeagues(data?.leagues?.publicLeagues || []);
    },
  });

  if (loading) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  return (
    <>
      <Heading level="h1">Leagues</Heading>
      <LeaguesList leagues={userleagues} />
      <PublicLeaguesList leagues={publicLeagues} />
    </>
  );
};

export default LeaguesContainer;
