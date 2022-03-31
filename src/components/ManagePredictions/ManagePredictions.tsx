import React, { FormEvent, useState } from "react";
import styled from "styled-components";

import User from "src/types/User";
import Prediction from "src/types/Prediction";
import { useLazyQuery } from "@apollo/client";
import { PREDICTIONS_QUERY } from "apollo/queries";
import Button from "../Button";
import Heading from "../Heading";

interface Props {
  leagueId: number;
  gameweekStart: number;
  gameweekEnd: number;
  participants: User[];
}

const ManagePredictions = ({
  leagueId,
  gameweekStart,
  gameweekEnd,
  participants,
}: Props) => {
  const [userId, setUserId] = useState<string>(participants[0].id);
  const [gameweek, setGameweek] = useState<number>(gameweekStart);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  // Query for getting fixtures from the database
  const [fetchPredictions] = useLazyQuery(PREDICTIONS_QUERY, {
    variables: { weekId: gameweek, userId },
    onCompleted: (data) => {
      setPredictions(data?.predictions || []);
    },
    fetchPolicy: "network-only",
  });

  const gameweeksAvailable = [
    ...Array(gameweekEnd - gameweekStart + 1).keys(),
  ].map((x) => x + gameweekStart);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchPredictions();
  };

  return (
    <>
      <section>
        <Heading level="h2" variant="secondary">
          Manage Predictions
        </Heading>
        <Form onSubmit={handleSubmit}>
          <label htmlFor="user">
            User
            <select
              name="user"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            >
              {participants.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="week">
            Gameweek
            <select
              name="week"
              value={gameweek}
              onChange={(e) => setGameweek(parseInt(e.target.value))}
            >
              {gameweeksAvailable.map((week) => (
                <option key={week} value={week}>
                  {week}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" variant="primary">
            Search
          </Button>
        </Form>
      </section>
      <div>
        {predictions?.length
          ? predictions.map((p) => (
              <p key={p.fixtureId}>
                {p.homeGoals}-{p.awayGoals}
              </p>
            ))
          : null}
      </div>
    </>
  );
};

const Form = styled.form`
  display: flex;
  gap: 4em;
  margin-top: 2em;
  font-size: 1rem;

  label {
    display: flex;
    gap: 0.5em;
  }
`;

// interface Props {
//   label: string;
//   value: string;
//   options: any;
//   onChange: () => {};
// }

// const Dropdown = ({ label, value, options, onChange }) => {
//   return (
//     <label>
//       {label}
//       <select value={value} onChange={onChange}>
//         {options.map((option) => (
//           <option value={option.value}>{option.label}</option>
//         ))}
//       </select>
//     </label>
//   );
// };

export default ManagePredictions;
