import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { PROCESS_JOIN_LEAGUE_REQUEST } from "apollo/mutations";
import { useSession } from "next-auth/client";
import { User } from ".prisma/client";

interface Props {
  applicants: User[];
  leagueId: number;
}

const LeagueApplicants = ({ applicants, leagueId }: Props) => {
  if (!applicants?.length) return <p>No Applicants</p>;

  const [session] = useSession();
  const [userFeedback, setUserFeedback] = useState<string>("");
  const [processRequest] = useMutation(PROCESS_JOIN_LEAGUE_REQUEST);

  const handleAcceptOrReject = (applicantId: number, accept: boolean) => {
    processRequest({
      variables: {
        userId: session?.user.id,
        leagueId,
        applicantId,
        isAccepted: accept,
      },
    }).then(() => setUserFeedback("Success!"));
  };

  return (
    <div>
      {applicants.map((applicant) => (
        // if each applicant details is not valid, don't display the applicant
        <div key={applicant.id}>
          {applicant.username}
          <Button onClick={() => handleAcceptOrReject(applicant.id, true)}>
            Accept
          </Button>
          <Button onClick={() => handleAcceptOrReject(applicant.id, false)}>
            Reject
          </Button>
        </div>
      ))}
      {userFeedback && <Feedback>{userFeedback}</Feedback>}
    </div>
  );
};

const Button = styled.button`
  margin: 0 1em;
`;

const Feedback = styled.p`
  font-size: 1.6em;
  font-style: italic;
`;

export default LeagueApplicants;
