import { FormEvent, useState } from "react";
import styled from "styled-components";

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
  const [gameweekStart, setGameweekStart] = useState(
    // TODO. If season hasn't started, impossible to start in GW 1
    (currentGameweek + 1).toString()
  );
  const [weeksToRun, setWeeksToRun] = useState("10");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const startWeek = parseInt(gameweekStart);
    const endWeek = startWeek + parseInt(weeksToRun) - 1;

    if (!leagueName) {
      setUserFeedback("Please enter a league name");
      return;
    }

    if (startWeek < 1 || startWeek > 38) {
      setUserFeedback("Please enter a valid start week");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("name", leagueName);
    formData.append("gameweekStart", startWeek.toString());
    formData.append("gameweekEnd", endWeek.toString());

    setLoading(true);

    fetch("/api/createLeague", {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      const message = await res.json();

      setLoading(false);
      setUserFeedback(message);
      setLeagueName("");
    });
  };

  return (
    <Container>
      <Heading level="h1" variant="secondary">
        Create League
      </Heading>
      <form onSubmit={handleSubmit}>
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
            type="number"
            value={gameweekStart}
            onChange={(e) => setGameweekStart(e.target.value.replace(/\D/, ""))}
          />
        </Label>
        <Info>(Select a week between {currentGameweek + 1} and 38)</Info>
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
