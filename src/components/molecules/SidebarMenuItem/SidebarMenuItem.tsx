import React from "react";
import styled from "styled-components";
import Link from "next/link";
import colours from "../../../styles/colours";

export interface Props {
  label: string;
  url: string;
  onClick: () => void;
}

const SidebarMenuItem = ({ label, url, onClick }: Props) => (
  <Container onClick={onClick}>
    <Link href={url}>
      <A>{label}</A>
    </Link>
  </Container>
);

const Container = styled.div`
  width: 100%;
  height: 4.4em;
  line-height: 4.4em;
  margin-right: 16px;
  text-align: right;
`;

const A = styled.a`
  color: ${colours.grey200};
  font-size: 1.6em;
  cursor: pointer;
  :hover,
  :hover,
  :focus {
    text-decoration: underline;
    color: ${colours.blue100};
  }
`;

export default SidebarMenuItem;
