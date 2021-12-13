import React from "react";
import { League } from "@prisma/client";
import useLeagues from "src/hooks/useLeagues";
import Loading from "@/components/atoms/Loading";
import LeaguesList from "@/components/molecules/LeagueList";
import PublicLeaguesList from "@/components/molecules/PublicLeaguesList";

interface Props {
  userId: number | null;
}

const Leagues = ({ userId }: Props) => {
  const [data, loading, error] = useLeagues(userId);

  if (loading) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  return (
    <>
      <LeaguesList leagues={data?.userLeagues} />
      <PublicLeaguesList leagues={data?.publicLeagues as Partial<League>[]} />
    </>
  );
};

export default Leagues;
