"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import Button from "src/components/Button";
import Heading from "src/components/Heading";
import FormInput from "src/components/FormInput";
import createLeague from "src/actions/createLeague";

interface Props {
  currentGameweek: number;
}

const CreateLeague = ({ currentGameweek }: Props) => {
  const { data: session } = useSession();
  const [leagueName, setLeagueName] = useState("");
  const [gameweekStart, setGameweekStart] = useState(
    // TODO. If season hasn't started, impossible to start in GW 1
    (currentGameweek + 1).toString()
  );
  const [weeksToRun, setWeeksToRun] = useState("10");

  const initialState = { message: "" };
  const [state, formAction] = useFormState(createLeague, initialState);
  const { pending } = useFormStatus();

  return (
    <Container>
      <Heading level="h1" variant="secondary">
        Create League
      </Heading>
      <form action={formAction}>
        <Label>
          <LabelText>Name:</LabelText>
          <FormInput
            name="name"
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
          />
        </Label>
        <Label>
          <LabelText>Gameweek start:</LabelText>
          <input
            name="start"
            type="number"
            value={gameweekStart}
            onChange={(e) => setGameweekStart(e.target.value.replace(/\D/, ""))}
          />
        </Label>
        <Info>(Select a week between {currentGameweek + 1} and 38)</Info>
        <Label>
          <LabelText>Weeks to run:</LabelText>
          <input
            name="weeksToRun"
            type="number"
            value={weeksToRun}
            onChange={(e) => setWeeksToRun(e.target.value.replace(/\D/, ""))}
          />
        </Label>
        <input type="hidden" name="userId" value={session?.user.id || ""} />
        {state?.message && !pending && <Feedback>{state.message}</Feedback>}
        <ButtonContainer>
          <Button type="submit" disabled={pending} variant="primary">
            {pending ? "Loading..." : "Create"}
          </Button>
        </ButtonContainer>
      </form>
    </Container>
  );
};

export default CreateLeague;

const Container = styled.section`
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const ButtonContainer = styled.div`
  margin: 6em 0;
`;

const Label = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4em;

  &:first-child {
    margin-top: 0;
  }

  input {
    height: 2.4em;
    padding-left: 1em;
    border: 0;
    color: var(--grey100);
    background-color: var(--blackblue600);
  }
`;

const LabelText = styled.p`
  font-size: 1.2rem;
  margin: 0 0 0.2em;
`;

const Feedback = styled.p`
  font-size: 1rem;
  font-style: italic;
  padding: 1em;
  border-radius: 1em;
  margin-top: 2em;
  background: var(--grey700);
`;

const Info = styled.p`
  margin-top: 0.5em;
  font-size: 0.9rem;
  font-style: italic;
  color: var(--grey300);
`;
