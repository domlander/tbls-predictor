import React, { FormEvent, useState } from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/client";

import { REQUEST_TO_JOIN_LEAGUE } from "apollo/mutations";
import Heading from "@/components/atoms/Heading";
import Button from "@/components/atoms/Button";
import FormInput from "@/components/atoms/FormInput";
import { useSession } from "next-auth/client";

const JoinLeague = () => {
  const [session] = useSession();
  const [leagueId, setLeagueId] = useState<string>("");
  const [userFeedback, setUserFeedback] = useState<string>("");
  const [requestToJoinLeague, { loading }] = useMutation(
    REQUEST_TO_JOIN_LEAGUE,
    {
      onError: (error) => setUserFeedback(error.message),
    }
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!leagueId) {
      setUserFeedback("Please enter a league code");
    } else {
      requestToJoinLeague({
        variables: { userId: session?.user.id, leagueId: parseInt(leagueId) },
      });
      setLeagueId("");
      setUserFeedback(
        "Success! Ask the league admin to accept your application"
      );
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Heading level="h1">Join league</Heading>
        <Label>
          <LabelText>League ID:</LabelText>
          <FormInput
            type="string"
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

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
`;

const Label = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
