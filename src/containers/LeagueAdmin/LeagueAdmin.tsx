import { useState } from "react";
import { useQuery } from "@apollo/client";

import { LEAGUE_ADMIN_QUERY } from "apollo/queries";
import styled from "styled-components";
import User from "src/types/User";
import Applicant from "src/types/Applicant";
import LeagueApplicants from "src/components/LeagueApplicantsRequests";
import LeagueParticipants from "src/components/LeagueParticipants";
import Heading from "src/components/Heading";

interface Props {
  leagueId: number;
}

const LeagueAdminContainer = ({ leagueId }: Props) => {
  const [leagueName, setLeagueName] = useState("League");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);

  const { loading, error } = useQuery(LEAGUE_ADMIN_QUERY, {
    variables: { leagueId },
    onCompleted: ({ leagueAdmin: { league } }) => {
      setLeagueName(league.name);
      setApplicants(league.applicants);
      setParticipants(league.users);
    },
  });

  if (error) return <div>An error has occurred. Please try again later.</div>;

  return (
    <Container>
      <Heading level="h1" variant="secondary">
        {leagueName} - Admin
      </Heading>
      {loading ? (
        <LoadingMessage>Loading...</LoadingMessage>
      ) : (
        <>
          <LeagueApplicants
            applicants={applicants}
            setApplicants={setApplicants}
            leagueId={leagueId}
          />
          <LeagueParticipants participants={participants} />
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2em;
`;

const LoadingMessage = styled.p`
  font-size: 1rem;
`;

export default LeagueAdminContainer;
