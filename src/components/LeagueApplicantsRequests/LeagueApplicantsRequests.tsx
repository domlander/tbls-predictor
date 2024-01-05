"use client";

import { useState } from "react";
import Applicant from "src/types/Applicant";
import Button from "../Button";
import Heading from "../Heading";
import processJoinLeagueRequest from "src/actions/processJoinLeagueRequest";
import styles from "./LeagueApplicantsRequests.module.css";

interface Props {
  applicants: Applicant[];
  leagueId: number;
}

const LeagueApplicantsRequests = ({
  applicants: initialApplicants,
  leagueId,
}: Props) => {
  const [userFeedback, setUserFeedback] = useState<string>("");
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);

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
        <p className={styles.label}>No valid applicants</p>
      ) : (
        validApplicants.map(({ user }) => {
          return (
            <div className={styles.requestsContainer} key={user.id}>
              <p className={styles.label}>{user.username}</p>
              <div className={styles.buttonContainer}>
                <Button
                  variant="primary"
                  handleClick={() => handleAcceptOrReject(user.id, true)}
                >
                  Accept
                </Button>
              </div>
              <div className={styles.buttonContainer}>
                <Button
                  variant="primary"
                  handleClick={() => handleAcceptOrReject(user.id, false)}
                >
                  Reject
                </Button>
              </div>
            </div>
          );
        })
      )}
      {userFeedback && <p className={styles.feedback}>{userFeedback}</p>}
    </div>
  );
};

export default LeagueApplicantsRequests;
