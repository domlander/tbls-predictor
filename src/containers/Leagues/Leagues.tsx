import React, { useState } from "react";

import { League } from "@prisma/client";
import { useQuery } from "@apollo/client";
import { USER_LEAGUES } from "apollo/queries";
import Heading from "@/components/atoms/Heading";
import Loading from "@/components/atoms/Loading";
import LeaguesList from "@/components/molecules/LeagueList";

interface Props {
  userId: number;
}

const LeaguesContainer = ({ userId }: Props) => {
  const [leagues, setLeagues] = useState<League[]>([]);

  const { loading, error } = useQuery(USER_LEAGUES, {
    variables: { id: userId },
    onCompleted: (data) => setLeagues(data?.userLeagues || []),
  });

  if (loading) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  return (
    <>
      <Heading level="h1">Leagues</Heading>
      <LeaguesList leagues={leagues} />
    </>
  );
};

export default LeaguesContainer;
