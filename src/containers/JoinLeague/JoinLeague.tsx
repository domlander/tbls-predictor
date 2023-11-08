"use client";

import { FormEvent, useState } from "react";
import styled from "styled-components";

import Heading from "src/components/Heading";
import Button from "src/components/Button";
import FormInput from "src/components/FormInput";
import colours from "src/styles/colours";

const JoinLeague = () => {
  const [leagueId, setLeagueId] = useState<string>("");
  const [userFeedback, setUserFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!leagueId) {
      setUserFeedback("Please enter a league code");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("leagueId", leagueId);

    setLoading(true);

    fetch("/api/requestToJoinLeague", {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      const message = await res.json();

      setLeagueId("");
      setLoading(false);
      setUserFeedback(message);
    });
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Heading level="h1" variant="secondary">
          Join league
        </Heading>
        <Label>
          <LabelText>League ID:</LabelText>
          <FormInput
            type="string"
            name="id"
            pattern="[0-9]*"
            onChange={(e) => setLeagueId(e.target.value.replace(/\D/, ""))}
            value={leagueId}
          />
        </Label>
        {userFeedback && !loading && <Feedback>{userFeedback}</Feedback>}
        <ButtonContainer>
          <Button type="submit" disabled={loading} variant="primary">
            {loading ? "Loading..." : "Join"}
          </Button>
        </ButtonContainer>
      </form>
    </Container>
  );
};

export default JoinLeague;

const Container = styled.section`
  max-width: 400px;
  margin: 0 auto;
`;

const Label = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;

  input {
    height: 2.4em;
    padding-left: 1em;
    border: 0;
    color: ${colours.grey100};
    background-color: ${colours.blackblue600};
  }
`;

const LabelText = styled.p`
  font-size: 1.2rem;
`;

const ButtonContainer = styled.div`
  margin: 3.2em 0;
`;

const Feedback = styled.p`
  font-size: 1rem;
  font-style: italic;
`;
