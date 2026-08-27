"use client";

import { authClient } from "auth-client";
import Link from "next/link";
import styles from "./LeagueAdminLink.module.css";

export interface Props {
  administratorId: string;
  leagueId: number;
}

const LeagueAdminLink = ({ administratorId, leagueId }: Props) => {
  const { data: session } = authClient.useSession();

  return session?.user?.id === administratorId ? (
    <Link className={styles.link} href={`/league/${leagueId}/admin`}>
      Admin
    </Link>
  ) : null;
};

export default LeagueAdminLink;
