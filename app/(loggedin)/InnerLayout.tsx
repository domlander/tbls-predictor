"use client";

import { ReactNode, useState } from "react";
import { authClient } from "auth-client";

import HeaderBar from "src/components/HeaderBar";
import Sidebar from "src/components/Sidebar";
import styles from "./InnerLayout.module.css";

const DEFAULT_USERNAME = "Me";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const username = (isLoggedIn && session?.user?.name) || DEFAULT_USERNAME;

  return (
    <div className={styles.container}>
      <div className={[styles.mainContent].join(" ")}>
        <HeaderBar
          initial={username[0].toUpperCase()}
          isLoading={isPending}
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
          isLoggedIn={isLoggedIn}
          isLoading={isPending}
          handleClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
        />
      </div>
    </div>
  );
};

export default Layout;
