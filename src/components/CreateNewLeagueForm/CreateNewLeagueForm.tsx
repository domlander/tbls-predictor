import React, { FC, FormEvent, useState } from "react";
import styled from "styled-components";

const Label = styled.label`
  display: block;
`

const CreateNewLeagueForm: FC = () => {
  const [leagueName, setLeagueName] = useState('')
  const [gameweekStart, setGameweekStart] = useState<number>(1)
  const [weeksToRun, setWeeksToRun] = useState<number>(17)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("e", e);
    console.log("Posting data to API", leagueName, gameweekStart, gameweekStart)

    fetch('../api/createLeague', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: leagueName, start: gameweekStart, end: gameweekStart + weeksToRun - 1 })
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Create League</h2>
        <Label>
          League name:
          <input type="text" value={leagueName} onChange={e => setLeagueName(e.target.value)} />
        </Label>
        <Label>
          Gameweek start:
          <input type="number" value={gameweekStart} onChange={e => setGameweekStart(parseInt(e.target.value))} />
        </Label>
        <Label>
          Weeks to run:
          <input type="number" value={weeksToRun} onChange={e => setWeeksToRun(parseInt(e.target.value))} />
        </Label>
        <input type="submit" value="Create new league" />
      </form>
    </>
  )
}

export default CreateNewLeagueForm