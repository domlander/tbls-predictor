import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";

import { PROCESS_JOIN_LEAGUE_REQUEST_MUTATION } from "apollo/mutations";
import Applicant from "src/types/Applicant";
import Button from "../Button";
import Heading from "../Heading";

interface Props {
  applicants: Applicant[];
  setApplicants: any;
  leagueId: number;
}

const LeagueApplicantsRequests = ({
  applicants,
  setApplicants,
  leagueId,
}: Props) => {
  const [userFeedback, setUserFeedback] = useState<string>("");
  const [processRequest] = useMutation(PROCESS_JOIN_LEAGUE_REQUEST_MUTATION);

  const handleAcceptOrReject = (applicantId: number, accept: boolean) => {
    processRequest({
      variables: {
        input: {
          leagueId,
          applicantId,
          isAccepted: accept,
        },
      },
    }).then((data) => {
      setApplicants(
        applicants.filter((applicant) => applicant.user.id !== applicantId)
      );
      const message = data?.data?.processJoinLeagueRequest
        ? "Successfully added user to the league!"
        : "Rejected user's application";

      setUserFeedback(message);
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
        validApplicants.map(({ user }) => {
          return (
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
          );
        })
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

export default LeagueApplicantsRequests;
