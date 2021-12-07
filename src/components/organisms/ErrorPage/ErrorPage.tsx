import React from "react";
import Link from "next/link";
import styled from "styled-components";

import pageSizes from "@/styles/pageSizes";
import Button from "@/components/Button";

export interface Props {
  type: "404" | "500";
}

const ErrorPage = ({ type }: Props) => (
  <Container>
    <Title>{type}</Title>
    <Subtitle>
      {type === "404" ? "Ooooooooooooooops!" : "Something went wrong"}
    </Subtitle>
    <ButtonContainer>
      <Link href="/">
        <a>
          <Button variant="primary">Go Back</Button>
        </a>
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

const Subtitle = styled.h2`
  font-size: 2rem;
`;

const ButtonContainer = styled.div`
  width: 50%;
  margin-top: 4em;

  @media (max-width: ${pageSizes.mobileL}) {
    width: 100%;
  }
`;

export default ErrorPage;
