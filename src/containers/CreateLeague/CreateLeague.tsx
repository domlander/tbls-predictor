import React, { FormEvent, useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";

import { CREATE_LEAGUE_MUTATION } from "apollo/mutations";
import Button from "src/components/Button";
import colours from "src/styles/colours";
import Heading from "src/components/Heading";
import FormInput from "src/components/FormInput";

interface Props {
  currentGameweek: number;
}

const CreateLeague = ({ currentGameweek }: Props) => {
  const [leagueName, setLeagueName] = useState("");
  const [userFeedback, setUserFeedback] = useState("");
  const [gameweekStart, setGameweekStart] = useState("1");
  const [weeksToRun, setWeeksToRun] = useState("10");

  const [createLeague, { loading }] = useMutation(CREATE_LEAGUE_MUTATION, {
    onError: (error) => setUserFeedback(error.message),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const startWeek = parseInt(gameweekStart);
    const endWeek = startWeek + parseInt(weeksToRun) - 1;

    if (!leagueName) setUserFeedback("Please enter a league name");
    else if (startWeek < 1 || startWeek > 38)
      setUserFeedback("Please enter a valid start week");
    else {
      createLeague({
        variables: {
          input: {
            name: leagueName,
            gameweekStart: startWeek,
            gameweekEnd: endWeek,
          },
        },
      }).then(({ data, errors }) => {
        if (errors?.length) {
          setUserFeedback(errors[0].message);
        } else if (data?.createLeague) {
          setUserFeedback(
            `Success! League "${data.createLeague.name}" was created! Ask friends to join using ID: ${data.createLeague.id}`
          );
          setLeagueName("");
        }
      });
    }
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
            />
          </Label>
          <Label>
            <LabelText>Gameweek start:</LabelText>
            <input
              type="number"
              value={gameweekStart}
              onChange={(e) =>
                setGameweekStart(e.target.value.replace(/\D/, ""))
              }
            />
          </Label>
          <Info>(Select a week between {currentGameweek} and 38)</Info>
          <Label>
            <LabelText>Weeks to run:</LabelText>
            <input
              type="number"
              value={weeksToRun}
              onChange={(e) => setWeeksToRun(e.target.value.replace(/\D/, ""))}
            />
          </Label>
          {userFeedback && !loading && <Feedback>{userFeedback}</Feedback>}
          <ButtonContainer>
            <Button type="submit" disabled={loading} variant="primary">
              {loading ? "Loading..." : "Create"}
            </Button>
          </ButtonContainer>
        </form>
      </Container>
    </>
  );
};

export default CreateLeague;

const Container = styled.div`
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
  :first-child {
    margin-top: 0;
  }

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
  margin: 0 0 0.2em;
`;

const Feedback = styled.p`
  font-size: 1rem;
  font-style: italic;
  padding: 1em;
  border-radius: 1em;
  margin-top: 2em;
  background: ${colours.grey700};
`;

const Info = styled.p`
  margin-top: 0.5em;
  font-size: 0.9rem;
  font-style: italic;
  color: ${colours.grey300};
`;
