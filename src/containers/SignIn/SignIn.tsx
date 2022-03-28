import React from "react";
import { signIn } from "next-auth/react";
import styled from "styled-components";

import Heading from "src/components/Heading";
import Button from "src/components/Button";

const SignInContainer = () => (
  <main>
    <Heading level="h1">Welcome!</Heading>
    <ButtonContainer>
      <Button handleClick={() => signIn()} type="button" variant="primary">
        Sign in
      </Button>
    </ButtonContainer>
  </main>
);

const ButtonContainer = styled.div`
  margin: 5rem auto;
  max-width: 400px;
`;

export default SignInContainer;
