import { FormEventHandler, Fragment } from "react";
import dayjs from "dayjs";
import styled from "styled-components";

import Fixture from "src/types/Fixture";
import colours from "src/styles/colours";
import Button from "../Button";
import Heading from "../Heading";

export interface Props {
  fixtures: Fixture[];
  updateFixtures: (
    fixtureId: number,
    isHomeTeam: boolean,
    text: string
  ) => void;
  submitFixtures: FormEventHandler<HTMLFormElement>;
}

const ManageFixturesDb = ({
  fixtures,
  updateFixtures,
  submitFixtures,
}: Props) => {
  return (
    <Form onSubmit={submitFixtures}>
      <Heading level="h2" variant="secondary">
        DB Fixtures
      </Heading>
      {!fixtures?.length ? (
        <div>No fixtures found.</div>
      ) : (
        <FixturesTable>
          <span>Kickoff</span>
          <span>Home team</span>
          <span>Away team</span>
          {fixtures.map(({ id, kickoff, homeTeam, awayTeam }) => (
            <Fragment key={id}>
              <div>{dayjs(kickoff).format("DD/MM/YYYY HH:mm")}</div>
              <input
                type="text"
                id="homeTeam"
                name="homeTeam"
                value={homeTeam}
                onChange={(e) => {
                  updateFixtures(id, true, e.target.value);
                }}
              />
              <input
                type="text"
                id="awayTeam"
                name="awayTeam"
                value={awayTeam}
                onChange={(e) => {
                  updateFixtures(id, false, e.target.value);
                }}
              />
            </Fragment>
          ))}
        </FixturesTable>
      )}
      <Button type="submit" variant="primary">
        Save Fixtures
      </Button>
    </Form>
  );
};

const FixturesTable = styled.div`
  display: grid;
  grid-template-columns: 11em 1fr 1fr;
  grid-auto-rows: 2.2em;
  align-items: center;
  font-size: 1rem;

  span {
    font-size: 1.2rem;
    color: ${colours.grey200};
  }

  input {
    background-color: ${colours.blackblue600};
    color: ${colours.grey100};
    font-size: 1rem;
    width: 9em;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2em;
`;

export default ManageFixturesDb;
