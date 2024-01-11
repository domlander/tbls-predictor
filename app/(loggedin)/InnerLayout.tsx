"use client";

import React, { ReactNode, useState } from "react";
import { useSession } from "next-auth/react";

import HeaderBar from "src/components/HeaderBar";
import Sidebar from "src/components/Sidebar";
import styles from "./InnerLayout.module.css";

const DEFAULT_USERNAME = "Me";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const username =
    (status === "authenticated" && session?.user?.username) || DEFAULT_USERNAME;

  return (
    <div className={styles.container}>
      <div className={[styles.mainContent].join(" ")}>
        <HeaderBar
          initial={username[0].toUpperCase()}
          isLoading={status === "loading"}
          handleClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
        />
        <main className={styles.innerContainer}>{children}</main>
      </div>
      <div
        className={[
          styles.sidebarContainer,
          isSidebarOpen && styles.sidebar,
        ].join(" ")}
      >
        <Sidebar
          username={username}
          isLoggedIn={status === "authenticated"}
          isLoading={status === "loading"}
          handleClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
        />
      </div>
    </div>
  );
};

export default Layout;
