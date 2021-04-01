import React from "react";
import styled from "styled-components";
import { User } from ".prisma/client";

interface Props {
  applicants: User[];
  leagueId: number;
}

const Button = styled.button`
  margin: 0 1em;
`;

const LeagueApplicants = ({ applicants, leagueId }: Props) => {
  const handleAcceptOrReject = (applicantId: number, accept: boolean) => {
    fetch("/api/processJoinLeagueRequest", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leagueId,
        applicantId,
        accept,
      }),
    });
  };

  console.log(applicants);

  // eslint-disable-next-line react/jsx-filename-extension
  if (!applicants?.length) return <p>No Applicants</p>;

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
    </div>
  );
};

export default LeagueApplicants;
