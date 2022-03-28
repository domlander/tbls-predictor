import React from "react";
import styled from "styled-components";
import Link from "next/link";
import colours from "src/styles/colours";

export interface Props {
  label: string;
  url: string;
  onClick: () => void;
}

const SidebarMenuItem = ({ label, url, onClick }: Props) => (
  <Container onClick={onClick}>
    <Link passHref href={url}>
      <a>{label}</a>
    </Link>
  </Container>
);

const Container = styled.li`
  width: 100%;
  height: 4.4em;
  line-height: 4.4em;
  text-align: right;

  a {
    color: ${colours.grey200};
    font-size: 1.6em;
    cursor: pointer;
    :hover,
    :focus {
      color: ${colours.cyan100};
    }
  }
`;

export default SidebarMenuItem;
