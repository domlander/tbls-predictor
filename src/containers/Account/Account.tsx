import React, { FormEvent, useState } from "react";
import { useSession } from "next-auth/client";
import styled from "styled-components";

import { UPDATE_USERNAME } from "apollo/mutations";
import { useMutation } from "@apollo/client";
import Button from "@/components/atoms/Button";
import FormInput from "@/components/atoms/FormInput";
import Heading from "@/components/atoms/Heading";
import colours from "@/styles/colours";

interface Props {
  username: string;
}

const AccountContainer = ({ username }: Props) => {
  const [session] = useSession();
  const [currentUsername, setCurrentUsername] = useState(username);
  const [formUsername, setFormUsername] = useState(username);
  const [userFeedback, setUserFeedback] = useState("");
  const [processRequest] = useMutation(UPDATE_USERNAME);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formUsername.length < 3)
      setUserFeedback("Username must be at least 3 characters");
    else
      processRequest({
        variables: {
          userId: session?.user.id,
          username: formUsername,
        },
      }).then(({ data }) => {
        setUserFeedback(`Success! Username changed to ${data.updateUsername}`);
        setCurrentUsername(data.updateUsername);
      });
  };

  return (
    <Container>
      <Heading level="h1">Account</Heading>
      <form onSubmit={handleSubmit}>
        <h2>Change username</h2>
        <Label>
          <LabelText>Username:</LabelText>
          <FormInput
            type="text"
            value={formUsername}
            onChange={(e) => setFormUsername(e.target.value)}
            maxLength={20}
            width="12em" // TODO: Should be variable width. Standardise this
            height="2.4em"
          />
        </Label>
        <ButtonContainer>
          <Button
            type="submit"
            disabled={currentUsername === formUsername}
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
};

const Container = styled.div`
  margin: auto 16px;
  max-width: 400px;
`;

const Label = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LabelText = styled.p`
  font-size: 16px;
`;

const ButtonContainer = styled.div`
  margin: 32px 0;
`;

const Feedback = styled.p`
  font-size: 1.6em;
  font-style: italic;
`;

export default AccountContainer;
