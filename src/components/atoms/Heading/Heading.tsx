import React, { ReactNode } from "react";
import styled from "styled-components";

export type Props = {
  id?: string;
  headingLevel: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  children: ReactNode;
};

const Heading = ({ id, headingLevel, children }: Props) =>
  <StyledHeading as={headingLevel} id={id}>{children}</StyledHeading>

const StyledHeading = styled.div`
  margin: 0;
`;

export default Heading;
