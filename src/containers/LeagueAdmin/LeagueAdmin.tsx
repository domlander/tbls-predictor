import React, { useState } from "react";
import { useQuery } from "@apollo/client";

import { LEAGUE_ADMIN_QUERY } from "apollo/queries";
import styled from "styled-components";
import User from "src/types/User";
import Applicant from "src/types/Applicant";
import LeagueApplicants from "src/components/LeagueApplicantsRequests";
import LeagueParticipants from "src/components/LeagueParticipants";
import Heading from "src/components/Heading";
import Loading from "src/components/Loading";
import ManagePredictions from "src/components/ManagePredictions";

interface Props {
  leagueId: number;
}

const LeagueAdminContainer = ({ leagueId }: Props) => {
  const [leagueName, setLeagueName] = useState("League");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);
  const [gameweekStart, setGameweekStart] = useState<number | null>(null);
  const [gameweekEnd, setGameweekEnd] = useState<number | null>(null);

  const { loading, error } = useQuery(LEAGUE_ADMIN_QUERY, {
    variables: { leagueId },
    onCompleted: async ({ leagueAdmin: { league } }) => {
      setLeagueName(league.name);
      setApplicants(league.applicants);
      setParticipants(league.users);
      setGameweekStart(league.gameweekStart);
      setGameweekEnd(league.gameweekEnd);
    },
  });

  if (loading) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  return (
    <Container>
      <Heading level="h1" variant="secondary">
        {leagueName} - Admin
      </Heading>
      <LeagueApplicants
        applicants={applicants}
        setApplicants={setApplicants}
        leagueId={leagueId}
      />
      <LeagueParticipants participants={participants} />
      {/* We can remove this check when we have automatic batching in React 18 */}
      {gameweekStart && gameweekEnd && participants?.length && (
        <ManagePredictions
          leagueId={leagueId}
          gameweekStart={gameweekStart}
          gameweekEnd={gameweekEnd}
          participants={participants}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2em;
`;

export default LeagueAdminContainer;
