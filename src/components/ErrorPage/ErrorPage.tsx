"use client";

import Link from "next/link";
import styled from "styled-components";

import pageSizes from "src/styles/pageSizes";
import Button from "src/components/Button";
import Heading from "src/components/Heading";

export interface Props {
  type: "404" | "500";
}

const ErrorPage = ({ type }: Props) => (
  <Container>
    <Title>{type}</Title>
    <Heading level="h2" variant="secondary">
      {type === "404" ? "Ooooooooooooooops!" : "Something went wrong..."}
    </Heading>
    <ButtonContainer>
      <Link href="/">
        <Button variant="primary">Go Home</Button>
      </Link>
    </ButtonContainer>
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 4em;
`;

const Title = styled.h1`
  font-size: 7rem;
  margin-bottom: 0;

  @media (max-width: ${pageSizes.mobileL}) {
    font-size: 5rem;
  }
`;

const ButtonContainer = styled.div`
  width: 50%;
  margin-top: 4em;

  @media (max-width: ${pageSizes.mobileL}) {
    width: 100%;
  }
`;

export default ErrorPage;
