import React from "react";
import styled from "styled-components";

import colours from "../../../styles/colours";
import Button from "../../atoms/Button";
import FormInput from "../../atoms/FormInput";

export interface Props {
  username: string;
  setUsername: any;
  isFormDisabled: boolean;
  userFeedback?: string;
  handleSubmit: any;
}

const FixtureTable = ({
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
          width="12em" // TODO: Should be variable width. Standardise this
          height="2.4em"
        />
      </Label>
      <ButtonContainer>
        <Button
          type="submit"
          disabled={isFormDisabled}
          colour={colours.blackblue500}
          backgroundColour={colours.blue100}
          hoverColour={colours.cyan500}
        >
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
  font-size: 16px;
  margin-right: 10px;
`;

const ButtonContainer = styled.div`
  margin: 32px 0;
`;

const Feedback = styled.p`
  font-size: 1.6em;
  font-style: italic;
`;

export default FixtureTable;
