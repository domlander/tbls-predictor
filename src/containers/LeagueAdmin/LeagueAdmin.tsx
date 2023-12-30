import User from "src/types/User";
import Applicant from "src/types/Applicant";
import LeagueApplicantsRequests from "src/components/LeagueApplicantsRequests";
import LeagueParticipants from "src/components/LeagueParticipants";
import Heading from "src/components/Heading";
import styles from "./LeagueAdmin.module.css";

interface Props {
  leagueId: number;
  leagueName: string;
  applicants: Applicant[];
  participants: Pick<User, "id" | "username">[];
}

const LeagueAdminContainer = ({
  leagueId,
  leagueName,
  applicants,
  participants,
}: Props) => {
  return (
    <div className={styles.container}>
      <Heading level="h1" variant="secondary">
        {leagueName} - Admin
      </Heading>
      <>
        <LeagueApplicantsRequests applicants={applicants} leagueId={leagueId} />
        <LeagueParticipants participants={participants} />
      </>
    </div>
  );
};

export default LeagueAdminContainer;
