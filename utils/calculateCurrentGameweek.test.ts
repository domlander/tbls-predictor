import { calculateCurrentGameweek } from "./calculateCurrentGameweek";

jest.useFakeTimers().setSystemTime(new Date("2024-01-06"));

const pastFixtures = [
  {
    id: 100,
    kickoff: new Date("2023-12-23"),
    gameweek: 17,
  },
  {
    id: 110,
    kickoff: new Date("2023-12-30"),
    gameweek: 18,
  },
];

const todayFixtures = [
  {
    id: 113,
    kickoff: new Date("2024-01-06"),
    gameweek: 19,
  },
  {
    id: 114,
    kickoff: new Date("2024-01-06"),
    gameweek: 19,
  },
];

const futureFixtures = [
  {
    id: 125,
    kickoff: new Date("2024-01-23"),
    gameweek: 21,
  },
  {
    id: 135,
    kickoff: new Date("2024-01-30"),
    gameweek: 22,
  },
];

describe("calculateCurrentGameweek", () => {
  it("returns 1 if no fixtures", () => {
    const result = calculateCurrentGameweek([]);

    expect(result).toBe(1);
  });

  describe("returns the gameweek of the fixture if there is one", () => {
    it("when the fixture is a past fixture", () => {
      const result = calculateCurrentGameweek([pastFixtures[0]]);
      expect(result).toBe(17);
    });
    it("when the fixture is today", () => {
      const result = calculateCurrentGameweek([todayFixtures[0]]);
      expect(result).toBe(19);
    });
    it("when the fixture is a future fixture", () => {
      const result = calculateCurrentGameweek([futureFixtures[0]]);
      expect(result).toBe(21);
    });
  });

  it("returns the correct gameweek when there's a range of fixtures", () => {
    const result = calculateCurrentGameweek([
      ...pastFixtures,
      ...todayFixtures,
      ...futureFixtures,
    ]);

    expect(result).toBe(19);
  });

  it("returns the correct gameweek when fixtures are today and in the future", () => {
    const result = calculateCurrentGameweek([
      ...todayFixtures,
      ...futureFixtures,
    ]);

    expect(result).toBe(19);
  });

  it("returns the correct gameweek when fixtures are today and in the past", () => {
    const result = calculateCurrentGameweek([
      ...pastFixtures,
      ...todayFixtures,
    ]);

    expect(result).toBe(19);
  });

  it("returns the correct gameweek when fixtures are in the past and future", () => {
    const result = calculateCurrentGameweek([
      ...pastFixtures,
      ...futureFixtures,
    ]);

    expect(result).toBe(21);
  });
});
