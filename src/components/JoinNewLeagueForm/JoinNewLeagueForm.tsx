import React, { FC, FormEvent, useState } from "react";
import styled from "styled-components";
import Heading from "../atoms/Heading";

const Label = styled.label`
  display: block;
`;

const JoinNewLeagueForm: FC = () => {
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
    <>
      <form onSubmit={handleSubmit}>
        <Heading level="h2">Join league</Heading>
        <Label>
          League ID:
          <input
            type="number"
            onChange={(e) => setLeagueId(parseInt(e.target.value))}
          />
        </Label>
        <input type="submit" value="Request to join league" />
      </form>
    </>
  );
};

export default JoinNewLeagueForm;
