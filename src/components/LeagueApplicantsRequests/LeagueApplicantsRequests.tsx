import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";

import Applicant from "src/types/Applicant";
import Button from "../Button";
import Heading from "../Heading";

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

  const handleAcceptOrReject = (applicantId: string, accept: boolean) => {
    const formData = new URLSearchParams();
    formData.append("leagueId", leagueId.toString());
    formData.append("applicantId", applicantId);
    formData.append("isAccepted", accept.toString());

    fetch("/api/processJoinLeagueRequest", {
      method: "POST",
      body: formData,
    }).then(async (resp) => {
      const message = await resp.json();

      setApplicants(
        applicants.filter((applicant) => applicant.user.id !== applicantId)
      );

      setUserFeedback(message);
    });
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
