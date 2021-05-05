import "reflect-metadata";

import React, { useState } from "react";
import styled from "styled-components";
import HeaderBar from "@/components/molecules/HeaderBar";
import Sidebar from "@/components/molecules/Sidebar";
import { useSession } from "next-auth/client";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [session] = useSession();

  return (
    <Container>
      <MainContent isSidebarOpen={isSidebarOpen}>
        {session ? (
          <HeaderBar
            initial="D"
            handleClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
          />
        ) : null}
        {children}
      </MainContent>
      <SidebarContainer isSidebarOpen={isSidebarOpen}>
        <Sidebar
          username={session?.user.name || ""}
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
  // TODO Add a 16px margin and remove margins from everywhere else
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
