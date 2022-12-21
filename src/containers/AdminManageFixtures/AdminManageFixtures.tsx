import React, { FormEvent, useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";

import arrowLeft from "public/images/ArrowLeft.svg";
import arrowRight from "public/images/ArrowRight.svg";
import arrowLeftDisabled from "public/images/ArrowLeftDisabled.svg";
import arrowRightDisabled from "public/images/ArrowRightDisabled.svg";
import { FIXTURES_QUERY } from "apollo/queries";
import { UPDATE_FIXTURES_MUTATION } from "apollo/mutations";
import sortFixtures from "utils/sortFixtures";
import Heading from "src/components/Heading";
import Button from "src/components/Button";
import Fixture from "src/types/Fixture";
import colours from "src/styles/colours";
import pageSizes from "src/styles/pageSizes";

interface Props {
  fixtures: Fixture[];
  gameweek: number;
}

const AdminManageFixtures = ({
  gameweek: initialGameweek,
  fixtures: initialFixtures = [],
}: Props) => {
  const [gameweek, setGameweek] = useState(initialGameweek);
  const [fetchingData, setFetchingData] = useState(false);
  const [savingApiDataToDB, setSavingApiDataToDB] = useState(false);
  const [fixtures, setFixtures] = useState(initialFixtures);
  const [fixturesAPI, setFixturesAPI] = useState([]);

  // Query for getting fixtures from the database
  const { loading, error } = useQuery(FIXTURES_QUERY, {
    variables: { weekId: gameweek },
    onCompleted: (data) => {
      setFixtures(data?.fixtures || []);
    },
    fetchPolicy: "network-only",
  });

  // Mutation to update fixtures
  const [
    processRequest,
    // { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_FIXTURES_MUTATION);

  // Updates fixtures in local state when a field is edited.
  const updateFixtures = (
    fixtureId: number,
    isHomeTeam: boolean,
    text: string
  ): void => {
    // Make a copy of current state
    const fixturesCopy: Props["fixtures"] = JSON.parse(
      JSON.stringify(fixtures)
    );

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
  // TODO: Save existing fixtures in state, rather than refetching data.
  const saveApiFixturesToDatabase = async () => {
    setSavingApiDataToDB(true);
    const data = await fetch(
      `/api/populateFixtures?gameweek=${gameweek}&persist=true`
    ).then((res) => res.json());
    setSavingApiDataToDB(false);

    setFixtures(data.fixtures);
  };

  // Saves fixtures to database via mutation
  const submitFixtures = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fixturesWithoutKickoff = fixtures.map(
      ({ id, homeTeam, awayTeam }) => ({
        id,
        homeTeam,
        awayTeam,
      })
    );

    await processRequest({
      variables: { input: fixturesWithoutKickoff },
    });
  };

  // Prompts our serverless function to fetch data from the FPL API
  const fetchFplData = async () => {
    setFetchingData(true);
    const response = await fetch(
      `/api/populateFixtures?gameweek=${gameweek}&persist=false`
    ).then((res) => res.json());
    setFetchingData(false);

    setFixturesAPI(response.fixtures);
  };

  const sortedDbFixtures = sortFixtures(fixtures);
  const sortedApiFixtures = sortFixtures(fixturesAPI);

  return (
    <Container>
      <StyledWeekNavigator>
        {gameweek !== 1 ? (
          <Image
            onClick={() => {
              setFixturesAPI([]);
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
              setFixturesAPI([]);
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
        <Form onSubmit={submitFixtures}>
          <Heading level="h2" variant="secondary">
            DB Fixtures
          </Heading>
          {loading ? (
            <div>Loading fixtures...</div>
          ) : error ? (
            <div>An error occured: {error.message}</div>
          ) : !fixtures?.length ? (
            <div>No fixtures found.</div>
          ) : (
            <FixturesTable>
              <span>Kickoff</span>
              <span>Home team</span>
              <span>Away team</span>
              {sortedDbFixtures.map(({ id, kickoff, homeTeam, awayTeam }) => (
                <React.Fragment key={id}>
                  <div>{dayjs(kickoff).format("DD/MM/YYYY HH:mm")}</div>
                  <input
                    type="text"
                    id="homeTeam"
                    name="homeTeam"
                    value={homeTeam}
                    onChange={(e) => {
                      updateFixtures(id!, true, e.target.value);
                    }}
                  />
                  <input
                    type="text"
                    id="awayTeam"
                    name="awayTeam"
                    value={awayTeam}
                    onChange={(e) => {
                      updateFixtures(id!, false, e.target.value);
                    }}
                  />
                </React.Fragment>
              ))}
            </FixturesTable>
          )}
          <Button type="submit" variant="primary">
            Save Fixtures
          </Button>
        </Form>
      </DbFixturesPanel>

      <FplFixturesPanel>
        <Heading level="h2" variant="secondary">
          API Fixtures
        </Heading>
        {fixturesAPI?.length ? (
          <FixturesTable>
            <span>Kickoff</span>
            <span>Home team</span>
            <span>Away team</span>
            {sortedApiFixtures.map(({ kickoff, homeTeam, awayTeam }) => (
              <React.Fragment key={`${homeTeam}-${awayTeam}`}>
                <div>{dayjs(kickoff).format("DD/MM/YYYY HH:mm")}</div>
                <div>{homeTeam}</div>
                <div>{awayTeam}</div>
              </React.Fragment>
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
        {fixturesAPI?.length ? (
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

  img:hover {
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2em;
`;

export default AdminManageFixtures;
