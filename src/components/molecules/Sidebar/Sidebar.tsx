import React from "react";
import { signOut } from "next-auth/client";
import styled from "styled-components";

import SidebarHeader from "../SidebarHeader";
import SidebarMenuItem from "../SidebarMenuItem";
import pageSizes from "../../../styles/pageSizes";
import colours from "../../../styles/colours";

export type Props = {
  username: string;
  handleClick: () => void; // TODO this closes the sidebar. Can we use global state for this?
};

const Sidebar = ({ username, handleClick }: Props) => (
  <Container>
    <SidebarHeader username={username} handleClick={handleClick} />
    <SidebarItemsContainer>
      <SidebarMenuItem
        onClick={handleClick}
        label="Predictions"
        url="/predictions"
      />
      <SidebarMenuItem
        onClick={handleClick}
        label="My leagues"
        url="/leagues"
      />
      <SidebarMenuItem
        onClick={handleClick}
        label="Join league"
        url="/league/join"
      />
      <SidebarMenuItem
        onClick={handleClick}
        label="Create league"
        url="/league/create"
      />
      <SidebarMenuItem onClick={handleClick} label="Account" url="/account" />
      <SidebarMenuItem onClick={signOut} label="Sign out" url="/signIn" />
    </SidebarItemsContainer>
  </Container>
);

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

const SidebarItemsContainer = styled.div`
  margin-right: 1.6em;
`;

export default Sidebar;
