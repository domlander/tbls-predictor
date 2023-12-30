"use client";

import styled from "styled-components";
import Link from "next/link";

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
    color: var(--grey300);
    font-size: 1.8rem;
    cursor: pointer;

    &:hover,
    &:focus {
      color: var(--cyan100);
    }

    @media (max-width: 768px) {
      font-size: 1.6rem;
    }
    @media (max-width: 480px) {
      font-size: 1.4rem;
    }
  }
`;

export default SidebarMenuItem;
