import React, { FormEvent, useState } from "react";
import styled from "styled-components";

import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";
import colours from "@/styles/colours";
import { useMutation } from "@apollo/client";
import { CREATE_LEAGUE } from "apollo/mutations";
import { useSession } from "next-auth/client";
import FormInput from "../../components/atoms/FormInput";

const CreateLeague = () => {
  const [session] = useSession();
  const [leagueName, setLeagueName] = useState("");
  const [userFeedback, setUserFeedback] = useState<string>("");
  const [gameweekStart, setGameweekStart] = useState<string>("1");
  const [weeksToRun, setWeeksToRun] = useState<string>("17");

  const [createLeague, { loading }] = useMutation(CREATE_LEAGUE, {
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
            userId: session?.user.id,
            name: leagueName,
            gameweekStart: startWeek,
            gameweekEnd: endWeek,
          },
        },
      }).then(({ data: { createLeague: { id, name } } }) =>
        setUserFeedback(
          `Success! League "${name}" was created! Ask friends to join using ID: ${id}`
        )
      );
      setLeagueName("");
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
              width="12em" // TODO: Should be variable width. Standardise this
              height="2.4em"
            />
          </Label>
          {/* TODO: Find components for these when decided on a design */}
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
          <Label>
            <LabelText>Weeks to run:</LabelText>
            <input
              type="number"
              value={weeksToRun}
              onChange={(e) => setWeeksToRun(e.target.value.replace(/\D/, ""))}
            />
          </Label>
          {/* TODO: end */}
          {userFeedback && !loading && <Feedback>{userFeedback}</Feedback>}
          <ButtonContainer>
            <Button
              type="submit"
              disabled={loading}
              colour={colours.blackblue500}
              backgroundColour={colours.blue100}
              hoverColour={colours.cyan500}
            >
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

const Feedback = styled.p`
  font-size: 1.6em;
  font-style: italic;
`;
