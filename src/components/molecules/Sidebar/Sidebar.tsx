import React from "react";
import styled from "styled-components";
import SidebarHeader from "../SidebarHeader";
import SidebarMenuItem from "../SidebarMenuItem";

export type Props = {
  username: string;
  handleClick: (e: React.MouseEvent) => void;
};

const Sidebar = ({ username, handleClick }: Props) => (
  <Container>
    <SidebarHeader username={username} handleClick={handleClick} />
    <SidebarMenuItem label="Predictions" url="/leagues" />
    <SidebarMenuItem label="My leagues" url="/leagues" />
    <SidebarMenuItem label="Join league" url="/league/join" />
    <SidebarMenuItem label="Create league" url="/league/create" />
    <SidebarMenuItem label="Change username" url="/account" />
    <SidebarMenuItem label="Sign out" url="/leagues" />
  </Container>
);

const Container = styled.div`
  height: 100vh;
`;

export default Sidebar;
