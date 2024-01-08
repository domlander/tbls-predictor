"use client";

import { FormEvent, Fragment, useEffect, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";

import arrowLeft from "public/images/ArrowLeft.svg";
import arrowRight from "public/images/ArrowRight.svg";
import arrowLeftDisabled from "public/images/ArrowLeftDisabled.svg";
import arrowRightDisabled from "public/images/ArrowRightDisabled.svg";
import Heading from "src/components/Heading";
import Button from "src/components/Button";
import Fixture from "src/types/Fixture";
import ManageFixturesDb from "src/components/ManageFixturesDb/ManageFixturesDb";
import fetchGameweekFixtures from "src/actions/fetchGameweekFixtures";
import updateFixturesDatabase from "src/actions/updateFixtures";
import styles from "./AdminManageFixtures.module.css";

interface Props {
  gameweek: number;
}

const AdminManageFixtures = ({ gameweek: initialGameweek }: Props) => {
  const [gameweek, setGameweek] = useState(initialGameweek);
  const [fetchingData, setFetchingData] = useState(false);
  const [savingApiDataToDB, setSavingApiDataToDB] = useState(false);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [fixturesFromApi, setFixturesFromApi] = useState<Fixture[]>([]);

  useEffect(() => {
    fetchGameweekFixtures(gameweek).then((fixtures) => {
      setFixtures([...fixtures]);
    });
  }, [gameweek]);

  // Updates fixtures in local state when a field is edited.
  const updateFixtures = (
    fixtureId: number,
    isHomeTeam: boolean,
    text: string
  ): void => {
    // Make a copy of current state
    const fixturesCopy: Fixture[] = [...fixtures];

    // Find the fixture we've changed
    const editedFixture = fixturesCopy.find(
      (fixture) => fixture.id === fixtureId
    );
    if (!editedFixture) return;

    if (isHomeTeam) {
      editedFixture.homeTeam = text;
    } else {
      editedFixture.awayTeam = text;
    }

    setFixtures(fixturesCopy);
  };

  // Takes all fixtures from the API for this gameweek and saves them to the database.
  const saveApiFixturesToDatabase = async () => {
    setSavingApiDataToDB(true);
    await fetch(`/api/populateFixtures?gameweek=${gameweek}&persist=true`, {
      method: "POST",
    });
    setSavingApiDataToDB(false);

    // Fetch the updated fixtures from DB. An extra round trip, but it does not matter for admin.
    fetchGameweekFixtures(gameweek).then((fixtures) => {
      setFixtures([...fixtures]);
    });
  };

  // Saves fixtures to database
  const submitFixtures = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fixturesWithoutKickoff = fixtures.map(
      ({ id, homeTeam, awayTeam }) => ({
        id,
        homeTeam,
        awayTeam,
      })
    );

    updateFixturesDatabase(fixturesWithoutKickoff);
  };

  // Prompts our serverless function to fetch data from the FPL API
  const fetchFplData = async () => {
    setFetchingData(true);
    await fetch(`/api/populateFixtures?gameweek=${gameweek}&persist=false`, {
      method: "POST",
    })
      .then((r) => r.json())
      .then(({ fixtures }) => {
        setFixturesFromApi(fixtures);
        setFetchingData(false);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.navigator}>
        {gameweek !== 1 ? (
          <Image
            onClick={() => {
              setFixturesFromApi([]);
              setGameweek((x) => x - 1);
            }}
            className={styles.navigatorButton}
            src={arrowLeft}
            alt="Go to previous week"
          />
        ) : (
          <Image src={arrowLeftDisabled} alt="disabled navigation" />
        )}
        <Heading level="h1" variant="secondary">
          Week {gameweek}
        </Heading>
        {gameweek !== 38 ? (
          <Image
            onClick={() => {
              setFixturesFromApi([]);
              setGameweek((x) => x + 1);
            }}
            className={styles.navigatorButton}
            src={arrowRight}
            alt="Go to next week"
          />
        ) : (
          <Image src={arrowRightDisabled} alt="disabled navigation" />
        )}
      </div>

      <div className={styles.dbFixturesPanel}>
        <ManageFixturesDb
          fixtures={fixtures}
          updateFixtures={updateFixtures}
          submitFixtures={submitFixtures}
        />
      </div>

      <div className={styles.fplFixturesPanel}>
        <Heading level="h2" variant="secondary">
          API Fixtures
        </Heading>
        {fixturesFromApi?.length ? (
          <div className={styles.fplFixtureTable}>
            <span className={styles.tableHeading}>Kickoff</span>
            <span className={styles.tableHeading}>Home team</span>
            <span className={styles.tableHeading}>Away team</span>
            {fixturesFromApi.map(({ kickoff, homeTeam, awayTeam }) => (
              <Fragment key={`${homeTeam}-${awayTeam}`}>
                <div>{dayjs(kickoff).format("DD/MM/YYYY HH:mm")}</div>
                <div>{homeTeam}</div>
                <div>{awayTeam}</div>
              </Fragment>
            ))}
          </div>
        ) : (
          <p className={styles.fetchMessage}>
            Fetch fresh fixture data for Gameweek {gameweek}. This will send a
            GET request to FPL Towers&rsquo; API.
          </p>
        )}
        <Button
          type="button"
          variant="secondary"
          disabled={fetchingData}
          handleClick={fetchFplData}
        >
          {fetchingData ? "Fetching fixtures..." : "Fetch fixtures from FPL"}
        </Button>
        {fixturesFromApi?.length ? (
          <Button
            type="button"
            variant="primary"
            disabled={savingApiDataToDB}
            handleClick={saveApiFixturesToDatabase}
          >
            {savingApiDataToDB ? "Saving..." : "Save to database"}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default AdminManageFixtures;
