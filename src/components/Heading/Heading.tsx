import React, { ReactNode } from "react";
import styled from "styled-components";
import colours from "src/styles/colours";

type HeadingLevel = "h1" | "h2" | "h3" | "p";

const variants = {
  primary: {
    colour: colours.cyan500,
    fontWeight: 700,
  },
  secondary: {
    colour: colours.grey200,
    fontWeight: 400,
  },
};

interface StyleProps {
  level: HeadingLevel;
  variant: "primary" | "secondary";
}

export type Props = StyleProps & {
  id?: string;
  as?: HeadingLevel;
  children: ReactNode;
  className?: string;
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
    level={level}
    as={as || level}
    id={id}
    variant={variant}
    className={className}
  >
    {children}
  </StyledHeading>
);

const StyledHeading = styled.div<StyleProps>`
  color: ${({ variant }) => variants[variant].colour};
  font-weight: ${({ variant }) => variants[variant].fontWeight};
  font-size: ${({ level }) => handleFontSize(level)};
  text-align: ${({ level }) => (level === "h1" ? "center" : "left")};
  margin: ${({ level }) => (level === "h1" ? "1em 0" : "0")};
`;

const handleFontSize = (level: string) => {
  switch (level) {
    case "h1":
      return "2.5rem";
    case "h2":
      return "2rem";
    case "h3":
      return "1.7rem";
    default:
      return "1rem";
  }
};

export default Heading;
