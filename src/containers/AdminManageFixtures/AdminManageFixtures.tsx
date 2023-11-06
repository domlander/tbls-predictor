import { FormEvent, Fragment, useEffect, useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import dayjs from "dayjs";

import arrowLeft from "public/images/ArrowLeft.svg";
import arrowRight from "public/images/ArrowRight.svg";
import arrowLeftDisabled from "public/images/ArrowLeftDisabled.svg";
import arrowRightDisabled from "public/images/ArrowRightDisabled.svg";
import sortFixtures from "utils/sortFixtures";
import Heading from "src/components/Heading";
import Button from "src/components/Button";
import Fixture from "src/types/Fixture";
import colours from "src/styles/colours";
import pageSizes from "src/styles/pageSizes";
import ManageFixturesDb from "src/components/ManageFixturesDb/ManageFixturesDb";

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
    fetch("/api/fetchGameweekFixtures", {
      method: "POST",
      body: JSON.stringify({ gameweek }),
    })
      .then((res) => res.json())
      .then(({ fixtures: f }) => {
        setFixtures([...f]);
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
    await fetch(`/api/populateFixtures?gameweek=${gameweek}&persist=true`);
    setSavingApiDataToDB(false);

    // Fetch the updated fixtures from DB. An extra round trip, but it does not matter for admin.
    fetch("/api/fetchGameweekFixtures", {
      method: "POST",
      body: JSON.stringify({ gameweek }),
    })
      .then((res) => res.json())
      .then(({ fixtures: f }) => {
        setFixtures([...f]);
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

    fetch("/api/updateFixtures", {
      method: "POST",
      body: JSON.stringify({ fixtures: fixturesWithoutKickoff }),
    });
  };

  // Prompts our serverless function to fetch data from the FPL API
  const fetchFplData = async () => {
    setFetchingData(true);
    const response = await fetch(
      `/api/populateFixtures?gameweek=${gameweek}&persist=false`
    ).then((res) => res.json());
    setFetchingData(false);

    const apiFixtures: Fixture[] = response.fixtures;

    setFixturesFromApi(apiFixtures);
  };

  const sortedApiFixtures = sortFixtures(fixturesFromApi);

  return (
    <Container>
      <StyledWeekNavigator>
        {gameweek !== 1 ? (
          <Image
            onClick={() => {
              setFixturesFromApi([]);
              setGameweek((x) => x - 1);
            }}
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
            src={arrowRight}
            alt="Go to next week"
          />
        ) : (
          <Image src={arrowRightDisabled} alt="disabled navigation" />
        )}
      </StyledWeekNavigator>

      <DbFixturesPanel>
        <ManageFixturesDb
          fixtures={fixtures}
          updateFixtures={updateFixtures}
          submitFixtures={submitFixtures}
        />
      </DbFixturesPanel>

      <FplFixturesPanel>
        <Heading level="h2" variant="secondary">
          API Fixtures
        </Heading>
        {fixturesFromApi?.length ? (
          <FixturesTable>
            <span>Kickoff</span>
            <span>Home team</span>
            <span>Away team</span>
            {sortedApiFixtures.map(({ kickoff, homeTeam, awayTeam }) => (
              <Fragment key={`${homeTeam}-${awayTeam}`}>
                <div>{dayjs(kickoff).format("DD/MM/YYYY HH:mm")}</div>
                <div>{homeTeam}</div>
                <div>{awayTeam}</div>
              </Fragment>
            ))}
          </FixturesTable>
        ) : (
          <p>
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
      </FplFixturesPanel>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

const DbFixturesPanel = styled.div`
  grid-column: 1 / span 6;
  @media (max-width: ${pageSizes.laptop}) {
    grid-column: 1 / span 12;
  }
`;

const FplFixturesPanel = styled.div`
  grid-column: 8 / span 5;
  @media (max-width: ${pageSizes.laptop}) {
    grid-column: 1 / span 12;
  }

  display: flex;
  flex-direction: column;
  gap: 2em;

  p {
    font-size: 1rem;
    padding: 1em;
    background: #c9c9a8;
    color: ${colours.black100};
  }
`;

const StyledWeekNavigator = styled.div`
  grid-column: 1 / span 12;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  img&:hover {
    cursor: pointer;
  }
`;

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

export default AdminManageFixtures;
