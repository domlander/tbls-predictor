import prisma from "prisma/client";

/*
  Populates the Fixture table in the DB with dummy fixtures.
  Clears the entire table first before repopulating with data.
*/
export default async (req, res) => {
  await prisma.fixture.deleteMany({});

  await prisma.fixture.createMany({
    data: [
      {
        gameweek: 1,
        kickoff: new Date("2021-04-03T12:30:00Z"),
        homeTeam: "Chelsea",
        awayTeam: "West Brom",
      },
      {
        gameweek: 1,
        kickoff: new Date("2021-04-03T15:00:00Z"),
        homeTeam: "Leeds",
        awayTeam: "Sheffield Utd",
      },
      {
        gameweek: 1,
        kickoff: new Date("2021-04-03T17:30:00Z"),
        homeTeam: "Leicester",
        awayTeam: "Man City",
      },
      {
        gameweek: 1,
        kickoff: new Date("2021-04-03T20:00:00Z"),
        homeTeam: "Arsenal",
        awayTeam: "Liverpool",
      },
      {
        gameweek: 1,
        kickoff: new Date("2021-04-04T12:00:00Z"),
        homeTeam: "Southampton",
        awayTeam: "Burnley",
      },
      {
        gameweek: 1,
        kickoff: new Date("2021-04-04T14:05:00Z"),
        homeTeam: "Newcastle",
        awayTeam: "Spurs",
      },
      {
        gameweek: 1,
        kickoff: new Date("2021-04-04T16:30:00Z"),
        homeTeam: "Aston Villa",
        awayTeam: "Fulham",
      },
      {
        gameweek: 1,
        kickoff: new Date("2021-04-04T19:30:00Z"),
        homeTeam: "Man Utd",
        awayTeam: "Brighton",
      },
      {
        gameweek: 1,
        kickoff: new Date("2021-04-05T18:00:00Z"),
        homeTeam: "Everton",
        awayTeam: "Crystal Palace",
      },
      {
        gameweek: 1,
        kickoff: new Date("2021-04-05T20:15:00Z"),
        homeTeam: "Wolves",
        awayTeam: "West Ham",
      },

      {
        gameweek: 2,
        kickoff: new Date("2021-04-09T20:00:00Z"),
        homeTeam: "Fulham",
        awayTeam: "Wolves",
      },
      {
        gameweek: 2,
        kickoff: new Date("2021-04-10T12:30:00Z"),
        homeTeam: "Man City",
        awayTeam: "Leeds",
      },
      {
        gameweek: 2,
        kickoff: new Date("2021-04-10T15:00:00Z"),
        homeTeam: "Liverpool",
        awayTeam: "Aston Villa",
      },
      {
        gameweek: 2,
        kickoff: new Date("2021-04-10T17:30:00Z"),
        homeTeam: "Crystal Palace",
        awayTeam: "Chelsea",
      },
      {
        gameweek: 2,
        kickoff: new Date("2021-04-11T12:00:00Z"),
        homeTeam: "Burnley",
        awayTeam: "Newcastle",
      },
      {
        gameweek: 2,
        kickoff: new Date("2021-04-11T14:05:00Z"),
        homeTeam: "West Ham",
        awayTeam: "Leicester",
      },
      {
        gameweek: 2,
        kickoff: new Date("2021-04-11T16:30:00Z"),
        homeTeam: "Spurs",
        awayTeam: "Man Utd",
      },
      {
        gameweek: 2,
        kickoff: new Date("2021-04-11T19:00:00Z"),
        homeTeam: "Sheffield Utd",
        awayTeam: "Arsenal",
      },
      {
        gameweek: 2,
        kickoff: new Date("2021-04-12T18:00:00Z"),
        homeTeam: "West Brom",
        awayTeam: "Southampton",
      },
      {
        gameweek: 2,
        kickoff: new Date("2021-04-12T20:15:00Z"),
        homeTeam: "Brighton",
        awayTeam: "Everton",
      },

      {
        gameweek: 3,
        kickoff: new Date("2021-04-16T20:00:00Z"),
        homeTeam: "Everton",
        awayTeam: "Spurs",
      },
      {
        gameweek: 3,
        kickoff: new Date("2021-04-17T12:30:00Z"),
        homeTeam: "Newcastle",
        awayTeam: "West Ham",
      },
      {
        gameweek: 3,
        kickoff: new Date("2021-04-17T15:00:00Z"),
        homeTeam: "Wolves",
        awayTeam: "Sheffield Utd",
      },
      {
        gameweek: 3,
        kickoff: new Date("2021-04-18T13:30:00Z"),
        homeTeam: "Arsenal",
        awayTeam: "Fulham",
      },
      {
        gameweek: 3,
        kickoff: new Date("2021-04-18T16:00:00Z"),
        homeTeam: "Man Utd",
        awayTeam: "Burnley",
      },
      {
        gameweek: 3,
        kickoff: new Date("2021-04-19T20:00:00Z"),
        homeTeam: "Leeds",
        awayTeam: "Liverpool",
      },
      {
        gameweek: 3,
        kickoff: new Date("2021-04-20T20:00:00Z"),
        homeTeam: "Chelsea",
        awayTeam: "Brighton",
      },
      {
        gameweek: 3,
        kickoff: new Date("2021-04-21T18:00:00Z"),
        homeTeam: "Spurs",
        awayTeam: "Southampton",
      },
      {
        gameweek: 3,
        kickoff: new Date("2021-04-21T20:15:00Z"),
        homeTeam: "Aston Villa",
        awayTeam: "Man City",
      },
      {
        gameweek: 3,
        kickoff: new Date("2021-04-22T20:00:00Z"),
        homeTeam: "Leicester",
        awayTeam: "West Brom",
      },
    ],
    skipDuplicates: true,
  });

  return res.status(200).send("Fixture data repopulated");
};
