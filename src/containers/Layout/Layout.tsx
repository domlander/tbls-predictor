import "reflect-metadata";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import styled, { css, keyframes } from "styled-components";
import { useSession } from "next-auth/react";

import HeaderBar from "src/components/HeaderBar";
import Sidebar from "src/components/Sidebar";
import pageSizes from "src/styles/pageSizes";
import colours from "src/styles/colours";

const DEFAULT_USERNAME = "Me";

export type BannerContextType = {
  setShowBanner: Dispatch<SetStateAction<boolean>>;
  setBannerText: Dispatch<SetStateAction<string>>;
};

export const BannerContext = createContext<BannerContextType>({
  setShowBanner: () => {},
  setBannerText: () => {},
});

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const username =
    (status === "authenticated" && session?.user?.username) || DEFAULT_USERNAME;
  const [showBanner, setShowBanner] = useState(false);
  const [bannerText, setBannerText] = useState("");

  return (
    <Container>
      {bannerText ? (
        <LoadingBanner show={showBanner}>
          <p>{bannerText}</p>
        </LoadingBanner>
      ) : null}
      <MainContent isSidebarOpen={isSidebarOpen}>
        <HeaderBar
          initial={username[0].toUpperCase()}
          isLoading={status === "loading"}
          handleClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
        />
        <BannerContext.Provider value={{ setShowBanner, setBannerText }}>
          <InnerContainer>{children}</InnerContainer>
        </BannerContext.Provider>
      </MainContent>
      <SidebarContainer isSidebarOpen={isSidebarOpen}>
        <Sidebar
          username={username}
          isLoggedIn={status === "authenticated"}
          isLoading={status === "loading"}
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

const InnerContainer = styled.main`
  max-width: 992px;
  margin: 0 auto;
  padding-bottom: 6em;

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

const slidein = keyframes`
  from { top: -3em; }
  to   { top: 0; }
`;

const slideout = keyframes`
  from { top: 0em; }
  to   { top: -3em; }
`;

const pulse = keyframes`
  from { color: ${colours.grey400} }
  to { color: ${colours.white} }
`;

const LoadingBanner = styled.div<{ show: boolean }>`
  background-color: ${colours.cyan500};
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  height: 3em;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${({ show }) =>
    show
      ? css`
          ${slidein} 0s linear forwards
        `
      : css`
          ${slideout} 0.5s 0.5s linear forwards
        `};

  p {
    font-size: 1rem;
    animation: ${pulse} 1s infinite alternate;
    color: ${colours.white};
    margin: 0;
    z-index: 2;
  }
`;
