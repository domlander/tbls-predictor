import { ReactNode } from "react";
import styled from "styled-components";
import colours from "src/styles/colours";

type HeadingLevel = "h1" | "h2" | "h3" | "p";

const variants = {
  primary: {
    colour: colours.cyan500,
  },
  secondary: {
    colour: colours.grey300,
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
  text-align: ${({ level }) => (level === "h1" ? "center" : "left")};
  margin: ${({ level }) => (level === "h1" ? "1em 0" : "0")};
`;

export default Heading;
