import React from "react";
import styled from "styled-components";

import Button from "../../atoms/Button";
import FormInput from "../../atoms/FormInput";

export interface Props {
  username: string;
  setUsername: any;
  isFormDisabled: boolean;
  userFeedback?: string;
  handleSubmit: any;
}

const ChangeUsernameForm = ({
  username,
  setUsername,
  isFormDisabled,
  userFeedback,
  handleSubmit,
}: Props) => (
  <Container>
    <h2>Change username</h2>
    <form onSubmit={handleSubmit}>
      <Label>
        <LabelText>Username:</LabelText>
        <FormInput
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
        />
      </Label>
      <ButtonContainer>
        <Button type="submit" disabled={isFormDisabled} variant="primary">
          Change
        </Button>
      </ButtonContainer>
      {userFeedback && <Feedback>{userFeedback}</Feedback>}
    </form>
  </Container>
);

const Container = styled.div`
  max-width: 450px;
`;

const Label = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LabelText = styled.p`
  font-size: 1.6em;
  margin-right: 1em;
`;

const ButtonContainer = styled.div`
  margin: 3.2em 0;
`;

const Feedback = styled.p`
  font-size: 1.6em;
  font-style: italic;
`;

export default ChangeUsernameForm;
