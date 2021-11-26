import React, { useState } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/client";
import { useMutation } from "@apollo/client";

import { PROCESS_JOIN_LEAGUE_REQUEST_MUTATION } from "apollo/mutations";
import { Applicant } from "@/types";
import Button from "../Button";
import Heading from "../atoms/Heading";

interface Props {
  applicants: Applicant[];
  setApplicants: any;
  leagueId: number;
}

const LeagueApplicants = ({ applicants, setApplicants, leagueId }: Props) => {
  const [session] = useSession();
  const [userFeedback, setUserFeedback] = useState<string>("");
  const [processRequest] = useMutation(PROCESS_JOIN_LEAGUE_REQUEST_MUTATION);

  const handleAcceptOrReject = (applicantId: number, accept: boolean) => {
    processRequest({
      variables: {
        userId: session?.user.id,
        leagueId,
        applicantId,
        isAccepted: accept,
      },
    }).then(() => {
      setApplicants(
        applicants.filter((applicant) => applicant.user.id !== applicantId)
      );
      setUserFeedback("Success!");
    });
  };

  const validApplicants = applicants.filter(
    (applicant) => applicant.user.username
  );

  return (
    <div>
      <Heading level="h2">Requests</Heading>
      {!validApplicants?.length ? (
        <Label>No valid applicants</Label>
      ) : (
        validApplicants.map(({ user }) => (
          <RequestsContainer key={user.id}>
            <Label>{user.username}</Label>
            <ButtonContainer>
              <Button
                variant="primary"
                handleClick={() => handleAcceptOrReject(user.id, true)}
              >
                Accept
              </Button>
            </ButtonContainer>
            <ButtonContainer>
              <Button
                variant="primary"
                handleClick={() => handleAcceptOrReject(user.id, false)}
              >
                Reject
              </Button>
            </ButtonContainer>
          </RequestsContainer>
        ))
      )}
      {userFeedback && <Feedback>{userFeedback}</Feedback>}
    </div>
  );
};

const RequestsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonContainer = styled.div`
  width: 200px;
  margin: 1em;
`;

const Label = styled.p`
  font-size: 2em;
  margin-right: 1em;
`;

const Feedback = styled.p`
  font-size: 1.6em;
  font-style: italic;
`;

export default LeagueApplicants;
