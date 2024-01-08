import { FormEventHandler, Fragment } from "react";
import dayjs from "dayjs";

import Fixture from "src/types/Fixture";
import Button from "../Button";
import Heading from "../Heading";
import styles from "./ManageFixturesDb.module.css";

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
    <form className={styles.form} onSubmit={submitFixtures}>
      <Heading level="h2" variant="secondary">
        DB Fixtures
      </Heading>
      {!fixtures?.length ? (
        <div>No fixtures found.</div>
      ) : (
        <div className={styles.table}>
          <span className={styles.span}>Kickoff</span>
          <span className={styles.span}>Home team</span>
          <span className={styles.span}>Away team</span>
          {fixtures.map(({ id, kickoff, homeTeam, awayTeam }) => (
            <Fragment key={id}>
              <div>{dayjs(kickoff).format("DD/MM/YYYY HH:mm")}</div>
              <input
                type="text"
                id="homeTeam"
                name="homeTeam"
                className={styles.input}
                value={homeTeam}
                onChange={(e) => {
                  updateFixtures(id, true, e.target.value);
                }}
              />
              <input
                type="text"
                id="awayTeam"
                name="awayTeam"
                className={styles.input}
                value={awayTeam}
                onChange={(e) => {
                  updateFixtures(id, false, e.target.value);
                }}
              />
            </Fragment>
          ))}
        </div>
      )}
      <Button type="submit" variant="primary">
        Save Fixtures
      </Button>
    </form>
  );
};

export default ManageFixturesDb;
