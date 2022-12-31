import React from "react";
import styled from "styled-components";
import Link from "next/link";
import colours from "src/styles/colours";
import pageSizes from "src/styles/pageSizes";

export interface Props {
  label: string;
  url: string;
  onClick: () => void;
}

const SidebarMenuItem = ({ label, url, onClick }: Props) => (
  <Container onClick={onClick}>
    <Link passHref href={url}>
      {label}
    </Link>
  </Container>
);

const Container = styled.li`
  width: 100%;
  height: 4.4em;
  line-height: 4.4em;
  text-align: center;

  a {
    color: ${colours.grey300};
    font-size: 1.8rem;
    cursor: pointer;
    :hover,
    :focus {
      color: ${colours.cyan100};
    }

    @media (max-width: ${pageSizes.mobileL}) {
      font-size: 1.6rem;
    }
  }
`;

export default SidebarMenuItem;
