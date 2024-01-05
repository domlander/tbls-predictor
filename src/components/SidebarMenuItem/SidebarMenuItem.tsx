"use client";

import Link from "next/link";
import styles from "./SidebarMenuItem.module.css";

export interface Props {
  label: string;
  url: string;
  onClick: () => void;
}

const SidebarMenuItem = ({ label, url, onClick }: Props) => (
  <li className={styles.listItem} onClick={onClick}>
    <Link className={styles.link} href={url}>
      {label}
    </Link>
  </li>
);

export default SidebarMenuItem;
