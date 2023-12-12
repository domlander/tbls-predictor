"use client";

import { useState } from "react";
import styled from "styled-components";
import User from "src/types/User";
import Applicant from "src/types/Applicant";
import LeagueApplicants from "src/components/LeagueApplicantsRequests";
import LeagueParticipants from "src/components/LeagueParticipants";
import Heading from "src/components/Heading";

interface Props {
  leagueId: number;
  leagueName: string;
  applicants: Applicant[];
  participants: Pick<User, "id" | "username">[];
}

const LeagueAdminContainer = ({
  leagueId,
  leagueName,
  applicants: initialApplicants,
  participants,
}: Props) => {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);

  return (
    <Container>
      <Heading level="h1" variant="secondary">
        {leagueName} - Admin
      </Heading>
      <>
        <LeagueApplicants
          applicants={applicants}
          setApplicants={setApplicants}
          leagueId={leagueId}
        />
        <LeagueParticipants participants={participants} />
      </>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2em;
`;

export default LeagueAdminContainer;
