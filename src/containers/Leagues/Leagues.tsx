import React from "react";
import { League } from "@prisma/client";
import Loading from "@/components/atoms/Loading";
import LeaguesList from "@/components/molecules/LeagueList";
import PublicLeaguesList from "@/components/molecules/PublicLeaguesList";
import useLeagues from "src/hooks/useLeagues";

interface Props {
  userId: number | null;
}

const Leagues = ({ userId }: Props) => {
  const [userLeagues, publicLeagues, loading, error] = useLeagues(userId);

  if (loading) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  return (
    <>
      <LeaguesList leagues={userLeagues as Partial<League>[]} />
      <PublicLeaguesList leagues={publicLeagues as Partial<League>[]} />
    </>
  );
};

export default Leagues;
