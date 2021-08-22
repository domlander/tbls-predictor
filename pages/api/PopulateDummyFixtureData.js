// import prisma from "prisma/client";
import { getSession } from "next-auth/client";

/*
  Populates the Fixture table in the DB with dummy fixtures.
  Clears the entire table first before repopulating with data.
*/
export default async (req, res) => {
  const session = await getSession({ req });
  if (session.user.email !== process.env.ADMIN_EMAIL) {
    res.status(401).send("You are not authorised to perform this action.");
  }

  // await prisma.fixture.deleteMany({});

  // await prisma.fixture.createMany({
  //   data: [
  //     {
  //       gameweek: 1,
  //       kickoff: new Date("2021-08-13T19:00:00Z"),
  //       homeTeam: "Brentford",
  //       awayTeam: "Arsenal",
  //     },
  //     {
  //       gameweek: 1,
  //       kickoff: new Date("2021-08-14T11:30:00Z"),
  //       homeTeam: "Man Utd",
  //       awayTeam: "Leeds",
  //     },
  //     {
  //       gameweek: 1,
  //       kickoff: new Date("2021-08-14T14:00:00Z"),
  //       homeTeam: "Burnley",
  //       awayTeam: "Brighton",
  //     },
  //     {
  //       gameweek: 1,
  //       kickoff: new Date("2021-08-14T14:00:00Z"),
  //       homeTeam: "Chelsea",
  //       awayTeam: "Crystal Palace",
  //     },
  //     {
  //       gameweek: 1,
  //       kickoff: new Date("2021-08-14T14:00:00Z"),
  //       homeTeam: "Everton",
  //       awayTeam: "Southampton",
  //     },
  //     {
  //       gameweek: 1,
  //       kickoff: new Date("2021-08-14T14:00:00Z"),
  //       homeTeam: "Leicester",
  //       awayTeam: "Wolves",
  //     },
  //     {
  //       gameweek: 1,
  //       kickoff: new Date("2021-08-14T14:00:00Z"),
  //       homeTeam: "Watford",
  //       awayTeam: "Aston Villa",
  //     },
  //     {
  //       gameweek: 1,
  //       kickoff: new Date("2021-08-14T16:30:00Z"),
  //       homeTeam: "Norwich",
  //       awayTeam: "Liverpool",
  //     },
  //     {
  //       gameweek: 1,
  //       kickoff: new Date("2021-08-15T13:00:00Z"),
  //       homeTeam: "Newcastle",
  //       awayTeam: "West Ham",
  //     },
  //     {
  //       gameweek: 1,
  //       kickoff: new Date("2021-08-15T15:30:00Z"),
  //       homeTeam: "Spurs",
  //       awayTeam: "Man City",
  //     },
  //     // - - - Gameweek 2
  //     {
  //       gameweek: 2,
  //       kickoff: new Date("2021-08-21T11:30:00Z"),
  //       homeTeam: "Liverpool",
  //       awayTeam: "Burnley",
  //     },
  //     {
  //       gameweek: 2,
  //       kickoff: new Date("2021-08-21T14:00:00Z"),
  //       homeTeam: "Aston Villa",
  //       awayTeam: "Newcastle",
  //     },
  //     {
  //       gameweek: 2,
  //       kickoff: new Date("2021-08-21T14:00:00Z"),
  //       homeTeam: "Crystal Palace",
  //       awayTeam: "Brentford",
  //     },
  //     {
  //       gameweek: 2,
  //       kickoff: new Date("2021-08-21T14:00:00Z"),
  //       homeTeam: "Leeds",
  //       awayTeam: "Everton",
  //     },
  //     {
  //       gameweek: 2,
  //       kickoff: new Date("2021-08-21T14:00:00Z"),
  //       homeTeam: "Man City",
  //       awayTeam: "Norwich",
  //     },
  //     {
  //       gameweek: 2,
  //       kickoff: new Date("2021-08-21T16:30:00Z"),
  //       homeTeam: "Brighton",
  //       awayTeam: "Watford",
  //     },
  //     {
  //       gameweek: 2,
  //       kickoff: new Date("2021-08-22T13:00:00Z"),
  //       homeTeam: "Southampton",
  //       awayTeam: "Man Utd",
  //     },
  //     {
  //       gameweek: 2,
  //       kickoff: new Date("2021-08-22T13:00:00Z"),
  //       homeTeam: "Wolves",
  //       awayTeam: "Spurs",
  //     },
  //     {
  //       gameweek: 2,
  //       kickoff: new Date("2021-08-22T15:30:00Z"),
  //       homeTeam: "Arsenal",
  //       awayTeam: "Chelsea",
  //     },
  //     {
  //       gameweek: 2,
  //       kickoff: new Date("2021-08-23T19:00:00Z"),
  //       homeTeam: "West Ham",
  //       awayTeam: "Leicester",
  //     },
  //   ],
  //   skipDuplicates: true,
  // });

  // return res.status(200).send("Fixture data repopulated");
};
