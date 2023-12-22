"use client";

import styled from "styled-components";
import { useFormState, useFormStatus } from "react-dom";

import updateUsername from "src/actions/updateUsername";
import { useState } from "react";
import Button from "../Button";
import FormInput from "../FormInput";
import Heading from "../Heading";

export interface Props {
  initialUsername: string;
}

const initialState = { message: "" };

const ChangeUsernameForm = ({ initialUsername }: Props) => {
  const [username, setUsername] = useState(initialUsername);
  const [state, formAction] = useFormState(updateUsername, initialState);
  const { pending } = useFormStatus();

  return (
    <Container>
      <Heading level="h2" variant="secondary">
        Update username
      </Heading>
      <form action={formAction}>
        <Label>
          Username:
          <FormInput
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={20}
          />
        </Label>
        <ButtonContainer>
          <Button type="submit" disabled={pending} variant="primary">
            Update
          </Button>
        </ButtonContainer>
        {state && <Feedback>{state?.message}</Feedback>}
      </form>
    </Container>
  );
};

const Container = styled.section`
  max-width: 450px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4em;
`;

const Label = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.6em;

  input {
    font-size: 1.2em;
  }
`;

const ButtonContainer = styled.div`
  margin: 3.2em 0;
`;

const Feedback = styled.p`
  font-size: 1.6em;
  font-style: italic;
`;

export default ChangeUsernameForm;
