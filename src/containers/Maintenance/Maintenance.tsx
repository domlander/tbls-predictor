"use client";

import styled from "styled-components";
import Heading from "src/components/Heading";

export default function Maintenance() {
  return (
    <Container>
      <Heading level="h2" variant="secondary">
        Come back later...
      </Heading>
      <Message>The site is currently under maintenance</Message>
    </Container>
  );
}

const Container = styled.div``;

const Message = styled.p`
  font-size: 1rem;
`;
