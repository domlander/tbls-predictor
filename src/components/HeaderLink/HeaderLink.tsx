import React from "react";
import Link from "next/link";
import styled from "styled-components";
import colours from "src/styles/colours";

export interface Props {
  link: string;
  children: React.ReactNode;
}

const HeaderLink = ({ link, children }: Props) => (
  <ListElement>
    <Link href={link} passHref>
      {children}
    </Link>
  </ListElement>
);

const ListElement = styled.li`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${colours.grey400};
  font-size: 1.2em;

  a {
    cursor: pointer;

    :hover,
    :focus {
      color: ${colours.cyan100};
    }
  }
`;

export default HeaderLink;
