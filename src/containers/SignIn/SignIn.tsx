import React from "react";
import Image from "next/image";
import { signIn } from "next-auth/client";
import styled from "styled-components";

import colours from "@/styles/colours";
import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";

const SignInContainer = () => (
  <Container>
    <Heading level="h1">TBLS Predictor</Heading>
    <Image width={748} height={632} src="/images/kidsWithFootball.jpg" />
    <ButtonContainer>
      <Button handleClick={() => signIn()} type="button" variant="secondary">
        Sign in
      </Button>
    </ButtonContainer>
  </Container>
);

const Container = styled.div`
  background-color: ${colours.grey500};
  height: 100vh;
  width: 100vw;
  max-width: 400px;
  position: absolute;
`;

const ButtonContainer = styled.div`
  margin: 1.6em;
`;

export default SignInContainer;
