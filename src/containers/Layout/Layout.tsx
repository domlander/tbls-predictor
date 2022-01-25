import "reflect-metadata";

import React, { ReactNode, useState } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/client";

import HeaderBar from "src/components/HeaderBar";
import Sidebar from "src/components/Sidebar";
import Loading from "src/components/Loading";
import pageSizes from "src/styles/pageSizes";

const DEFAULT_USERNAME = "Me";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const [session, loading] = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const username = (!loading && session?.user.name) || DEFAULT_USERNAME;
  const initial = username[0].toUpperCase();

  return loading ? (
    <Loading />
  ) : (
    <Container>
      <MainContent isSidebarOpen={isSidebarOpen}>
        <HeaderBar
          initial={initial}
          handleClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
        />
        <InnerContainer>{children}</InnerContainer>
      </MainContent>
      <SidebarContainer isSidebarOpen={isSidebarOpen}>
        <Sidebar
          username={username}
          initial={initial}
          isLoggedIn={!!session?.user.id}
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
  max-width: 992px;
  margin: 0 auto;

  @media (max-width: ${pageSizes.laptop}) {
    margin: 0 1.6em;
  }
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
