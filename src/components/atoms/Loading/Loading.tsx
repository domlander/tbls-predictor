import React from "react";
import styled from "styled-components";
import Heading from "../Heading";

const Loading = () => (
  <>
    <Container>
      <Heading level="h3">Loading...</Heading>
    </Container>
  </>
);

const Container = styled.div`
  margin-left: 32px;
`;

export default Loading;
