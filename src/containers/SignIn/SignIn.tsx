import React from "react";
import { signIn } from "next-auth/client";
import styled from "styled-components";

import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";

const SignInContainer = () => (
  <>
    <Heading level="h1">TBLS Predictor</Heading>
    <ButtonContainer>
      <Button handleClick={() => signIn()} type="button" variant="primary">
        Sign in
      </Button>
    </ButtonContainer>
  </>
);

const ButtonContainer = styled.div`
  margin: 5rem auto;
  max-width: 400px;
`;

export default SignInContainer;
