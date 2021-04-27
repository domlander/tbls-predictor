import React, { FormEvent, useState } from "react";
import styled from "styled-components";
import Heading from "@/components/atoms/Heading";
import colours from "@/styles/colours";
import Button from "@/components/atoms/Button";
import FormInput from "@/components/atoms/FormInput";

const JoinLeague = () => {
  const [leagueId, setLeagueId] = useState<number>();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Posting data to API", leagueId);

    fetch("../api/requestToJoinLeague", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: leagueId }),
    });
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Heading level="h1">Join league</Heading>
        <Label>
          <LabelText>League ID:</LabelText>
          <FormInput
            type="number"
            onChange={(e) => setLeagueId(parseInt(e.target.value))}
            width="10em"
            height="2.4em"
          />
        </Label>
        <ButtonContainer>
          <Button
            type="submit"
            colour={colours.blackblue500}
            backgroundColour={colours.blue100}
            hoverColour={colours.blue200}
          >
            Join
          </Button>
        </ButtonContainer>
      </form>
    </Container>
  );
};

export default JoinLeague;

const Container = styled.div`
  width: calc(100% - 32px);
  max-width: 400px;
  margin: 0 auto;
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
