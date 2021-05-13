import "reflect-metadata";

import React, { useEffect, useState } from "react";
import Router from "next/router";
import styled from "styled-components";
import { useSession } from "next-auth/client";

import HeaderBar from "@/components/molecules/HeaderBar";
import Sidebar from "@/components/molecules/Sidebar";
import Loading from "@/components/atoms/Loading";

interface Props {
  children: React.ReactNode;
}

const defaultUsername = "Me";

const Layout = ({ children }: Props) => {
  const [session, loading] = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const { pathname } = Router;
    if (!loading && !session && !pathname.includes("signIn")) {
      Router.push("/");
    }
  });

  return loading ? (
    <Loading />
  ) : (
    <Container>
      <MainContent isSidebarOpen={isSidebarOpen}>
        {session ? (
          <HeaderBar
            initial={
              (session.user?.name && session.user?.name[0]) ||
              defaultUsername[0]
            }
            handleClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
          />
        ) : null}
        <InnerContainer>{children}</InnerContainer>
      </MainContent>
      <SidebarContainer isSidebarOpen={isSidebarOpen}>
        <Sidebar
          username={session?.user.name || defaultUsername}
          handleClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
        />
      </SidebarContainer>
    </Container>
  );
};

export default Layout;

const Container = styled.div`
  display: grid;
  grid-template-columns: [stack] 1fr;
`;

const InnerContainer = styled.div`
  margin: 0 16px;
`;

const MainContent = styled.div<{ isSidebarOpen: boolean }>`
  grid-area: stack;
  opacity: ${({ isSidebarOpen }) => (isSidebarOpen ? "25%" : "100%")};
`;

const SidebarContainer = styled.div<{ isSidebarOpen: boolean }>`
  grid-area: stack;
  visibility: ${({ isSidebarOpen }) => (isSidebarOpen ? "visible" : "hidden")};
  /* transform: translateY(-110vw);
  will-change: transform;
  transition: transform 0.6s cubic-bezier(0.16, 0.1, 0.3, 1),
    visibility 0s linear 0.6s; */
`;
