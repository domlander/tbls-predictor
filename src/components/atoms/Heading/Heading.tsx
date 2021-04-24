import React, { ReactNode } from "react";
import styled from "styled-components";
import colours from "../../../styles/colours";

interface StyleProps {
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
}

export type Props = StyleProps & {
  id?: string;
  children: ReactNode;
};

const Heading = ({ id, level, children }: Props) => (
  <StyledHeading level={level} as={level} id={id}>
    {children}
  </StyledHeading>
);

const StyledHeading = styled.div<StyleProps>`
  color: ${colours.grey200};
  text-align: ${({ level }) => (level === "h1" ? "center" : "left")};
`;

export default Heading;
