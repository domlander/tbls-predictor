"use client";

import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";

import Applicant from "src/types/Applicant";
import Button from "../Button";
import Heading from "../Heading";
import processJoinLeagueRequest from "src/actions/processJoinLeagueRequest";

interface Props {
  applicants: Applicant[];
  setApplicants: Dispatch<SetStateAction<Applicant[]>>;
  leagueId: number;
}

const LeagueApplicantsRequests = ({
  applicants,
  setApplicants,
  leagueId,
}: Props) => {
  const [userFeedback, setUserFeedback] = useState<string>("");

  const handleAcceptOrReject = (applicantId: string, shouldAccept: boolean) => {
    processJoinLeagueRequest(leagueId, applicantId, shouldAccept).then(
      ({ message }) => {
        setUserFeedback(message);
        setApplicants(
          applicants.filter((applicant) => applicant.user.id !== applicantId)
        );
      }
    );
  };

  const validApplicants = applicants.filter(
    (applicant) => applicant.user.username
  );

  return (
    <div>
      <Heading level="h2" variant="secondary">
        Requests
      </Heading>
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
