import React from "react";
import { signOut } from "next-auth/react";
import styled from "styled-components";

import pageSizes from "src/styles/pageSizes";
import colours from "src/styles/colours";
import SidebarHeader from "../SidebarHeader";
import SidebarMenuItem from "../SidebarMenuItem";

export type Props = {
  username: string;
  isLoggedIn: boolean;
  handleClick: () => void; // TODO this closes the sidebar. Can we use global state for this?
};

const Sidebar = ({ username, isLoggedIn, handleClick }: Props) => {
  return (
    <Container>
      <SidebarHeader username={username} handleClick={handleClick} />
      <SidebarItemsContainer>
        <SidebarMenuItem
          onClick={handleClick}
          label="My Predictions"
          url="/predictions"
        />
        <SidebarMenuItem
          onClick={handleClick}
          label="My Leagues"
          url="/leagues"
        />
        {isLoggedIn ? (
          <>
            <SidebarMenuItem
              onClick={handleClick}
              label="Join League"
              url="/league/join"
            />
            <SidebarMenuItem
              onClick={handleClick}
              label="Create League"
              url="/league/create"
            />
            <SidebarMenuItem
              onClick={handleClick}
              label="Premier League Table"
              url="/premierleague"
            />
            <SidebarMenuItem
              onClick={handleClick}
              label="Account"
              url="/account"
            />
            <SidebarMenuItem onClick={signOut} label="Sign out" url="/signIn" />
          </>
        ) : (
          <SidebarMenuItem onClick={handleClick} label="Sign In" url="/" />
        )}
      </SidebarItemsContainer>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 70%;
  max-width: 400px;
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${colours.blackblue450};

  @media (max-width: ${pageSizes.mobileM}) {
    width: 100%;
  }
`;

const SidebarItemsContainer = styled.ul`
  margin-right: 1.6em;
`;

export default Sidebar;
