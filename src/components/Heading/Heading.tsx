import React, { ReactNode } from "react";
import styled from "styled-components";
import colours from "src/styles/colours";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

interface StyleProps {
  level: HeadingLevel;
}

export type Props = StyleProps & {
  id?: string;
  as?: HeadingLevel;
  children: ReactNode;
  className?: string;
};

const Heading = ({ id, level, as, children, className }: Props) => (
  <StyledHeading level={level} as={as || level} id={id} className={className}>
    {children}
  </StyledHeading>
);

const StyledHeading = styled.div<StyleProps>`
  color: ${colours.grey200};
  text-align: ${({ level }) => (level === "h1" ? "center" : "left")};
`;

export default Heading;
