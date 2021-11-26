import React, { useState } from "react";

import LeagueApplicants from "@/components/LeagueApplicants";
import LeagueParticipants from "@/components/LeagueParticipants";
import Heading from "@/components/atoms/Heading";
import { LEAGUE_ADMIN_QUERY } from "apollo/queries";
import { useQuery } from "@apollo/client";
import Loading from "@/components/atoms/Loading";

interface Props {
  userId: number;
  leagueId: number;
}

const LeagueAdminContainer = ({ userId, leagueId }: Props) => {
  const [leagueName, setLeagueName] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [participants, setParticipants] = useState([]);

  const { loading, error } = useQuery(LEAGUE_ADMIN_QUERY, {
    variables: { input: { userId, leagueId } },
    onCompleted: ({ leagueAdmin }) => {
      setLeagueName(leagueAdmin.name);
      setApplicants(leagueAdmin.applicants);
      setParticipants(leagueAdmin.participants);
    },
  });

  if (loading) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  return (
    <>
      <Heading level="h1">{leagueName} - Admin</Heading>
      <LeagueApplicants
        applicants={applicants}
        setApplicants={setApplicants}
        leagueId={leagueId}
      />
      <LeagueParticipants participants={participants} />
    </>
  );
};

export default LeagueAdminContainer;
