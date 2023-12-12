"use client";

import { ReactNode } from "react";
import styled from "styled-components";
import cx from "classnames";
import colours from "src/styles/colours";
import styles from "./Heading.module.css";

type HeadingLevel = "h1" | "h2" | "h3" | "p";

const variants = {
  primary: {
    colour: colours.cyan500,
  },
  secondary: {
    colour: colours.grey300,
  },
};

export type Props = {
  as?: HeadingLevel;
  children: ReactNode;
  className?: string;
  id?: string;
  level: HeadingLevel;
  variant: "primary" | "secondary";
};

const Heading = ({
  id,
  level,
  as,
  children,
  className,
  variant = "secondary",
}: Props) => (
  <StyledHeading
    $level={level}
    as={as || level}
    id={id}
    $variant={variant}
    className={cx(styles.heading, styles[variant], styles[level], className)}
  >
    {children}
  </StyledHeading>
);

const StyledHeading = styled.div<{
  $level: HeadingLevel;
  $variant: "primary" | "secondary";
}>`
  color: ${({ $variant }) => variants[$variant].colour};
  text-align: ${({ $level }) => ($level === "h1" ? "center" : "left")};
  margin: ${({ $level }) => ($level === "h1" ? "1em 0" : "0")};
`;

export default Heading;
