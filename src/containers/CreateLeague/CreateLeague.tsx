import React, { FormEvent, useState } from "react";
import styled from "styled-components";

import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";
import colours from "@/styles/colours";
import FormInput from "../../components/atoms/FormInput";

const CreateLeague = () => {
  const [leagueName, setLeagueName] = useState("");
  const [gameweekStart, setGameweekStart] = useState<number>(1);
  const [weeksToRun, setWeeksToRun] = useState<number>(17);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(
      "Posting data to API",
      leagueName,
      gameweekStart,
      gameweekStart
    );

    if (!leagueName) return;

    fetch("../api/createLeague", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: leagueName,
        start: gameweekStart,
        end: gameweekStart + weeksToRun - 1,
      }),
    });
  };

  return (
    <>
      <Container>
        <Heading level="h1">Create League</Heading>
        <form onSubmit={handleSubmit}>
          <Label>
            <LabelText>Name:</LabelText>
            <FormInput
              value={leagueName}
              onChange={(e) => setLeagueName(e.target.value)}
              width="12em"
              height="2.4em"
            />
          </Label>
          {/* TODO: Find components for these when decided on a design */}
          <Label>
            <LabelText>Gameweek start:</LabelText>
            <input
              type="number"
              value={gameweekStart}
              onChange={(e) => setGameweekStart(parseInt(e.target.value))}
            />
          </Label>
          <Label>
            <LabelText>Weeks to run:</LabelText>
            <input
              type="number"
              value={weeksToRun}
              onChange={(e) => setWeeksToRun(parseInt(e.target.value))}
            />
          </Label>
          {/* TODO: end */}
          <ButtonContainer>
            <Button
              type="submit"
              colour={colours.blackblue500}
              backgroundColour={colours.blue100}
              hoverColour={colours.blue200}
            >
              Create
            </Button>
          </ButtonContainer>
        </form>
      </Container>
    </>
  );
};

export default CreateLeague;

const Container = styled.div`
  width: calc(100% - 32px);
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const ButtonContainer = styled.div`
  margin: 32px 0;
`;

const Label = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LabelText = styled.p`
  font-size: 16px;
`;
