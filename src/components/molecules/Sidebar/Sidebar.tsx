import colours from "@/styles/colours";
import React from "react";
import styled from "styled-components";
import { signOut } from "next-auth/client";
import SidebarHeader from "../SidebarHeader";
import SidebarMenuItem from "../SidebarMenuItem";

export type Props = {
  username: string;
  handleClick: () => void; // TODO this closes the sidebar. Can we use global state for this?
};

const Sidebar = ({ username, handleClick }: Props) => (
  <Container>
    <SidebarHeader username={username} handleClick={handleClick} />
    <SidebarMenuItem onClick={handleClick} label="Predictions" url="/leagues" />
    <SidebarMenuItem onClick={handleClick} label="My leagues" url="/leagues" />
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
    <SidebarMenuItem
      onClick={handleClick}
      label="Change username"
      url="/account"
    />
    <SidebarMenuItem onClick={signOut} label="Sign out" url="/signIn" />
  </Container>
);

const Container = styled.div`
  height: 100vh;
  width: 70%;
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${colours.blackblue500};
  padding-right: 16px;
`;

export default Sidebar;
