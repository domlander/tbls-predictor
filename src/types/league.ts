import { LeagueStatus, User } from "@prisma/client"

export type League = {
  id: string,
  leagueId: number,
  name: string,
  admin: string,
  participants: Array<Participant>,
  applicants: Array<User>,
  status: LeagueStatus,
  season: number,
  gameweekStart: GameweekNumber,
  gameweekEnd: GameweekNumber
}

export type Participant = {
  id: number,
  participantId: number,
  leagueId: number,
  name: string,
}

type GameweekNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38