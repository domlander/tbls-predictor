import React, { ReactNode } from "react";
import styled from "styled-components";
import colours from "../../../styles/colours";

export type Props = {
  id?: string;
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  children: ReactNode;
};

const Heading = ({ id, level, children }: Props) => (
  <StyledHeading as={level} id={id}>
    {children}
  </StyledHeading>
);

const StyledHeading = styled.div`
  color: ${colours.grey200};
  align-self: center;
`;

export default Heading;
