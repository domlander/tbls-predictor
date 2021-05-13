import React, { useState } from "react";
import styled from "styled-components";

import LeagueApplicants from "@/components/LeagueApplicants";
import LeagueParticipants from "@/components/LeagueParticipants";
import Heading from "@/components/atoms/Heading";
import { LEAGUE_ADMIN } from "apollo/queries";
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

  const { loading, error } = useQuery(LEAGUE_ADMIN, {
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
      <Heading level="h1">{leagueName}</Heading>
      <Heading level="h2">Admin</Heading>
      <Subtitle>Requests</Subtitle>
      <LeagueApplicants applicants={applicants} leagueId={leagueId} />
      <LeagueParticipants participants={participants} />
    </>
  );
};

const Subtitle = styled.h2`
  color: green;
`;

export default LeagueAdminContainer;
