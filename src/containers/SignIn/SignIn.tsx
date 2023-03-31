import { signIn } from "next-auth/react";
import styled from "styled-components";

import Heading from "src/components/Heading";
import Button from "src/components/Button";

const SignInContainer = () => (
  <section>
    <Heading level="h1" variant="secondary">
      Welcome!
    </Heading>
    <ButtonContainer>
      <Button handleClick={() => signIn()} type="button" variant="primary">
        Sign in
      </Button>
    </ButtonContainer>
  </section>
);

const ButtonContainer = styled.div`
  margin: 5rem auto;
  max-width: 400px;
`;

export default SignInContainer;
