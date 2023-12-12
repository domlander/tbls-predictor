"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./LeagueAdminLink.module.css";

export interface Props {
  administratorId: string;
  leagueId: number;
}

const LeagueAdminLink = ({ administratorId, leagueId }: Props) => {
  const { data: session } = useSession();

  return session?.user?.id === administratorId ? (
    <Link className={styles.link} href={`/league/${leagueId}/admin`}>
      Admin
    </Link>
  ) : null;
};

export default LeagueAdminLink;
