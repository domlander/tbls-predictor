import { isGameLiveOrRecentlyFinished } from "pages/api/fetchLatestScores";

describe("isGameLiveOrRecentlyFinished", () => {
  it.each([
    [24 * 60, false],
    [30, false],
    [-30, true],
    [-120, true],
    [-180, false],
    [-24 * 60, false],
  ])("when the minutes until kickoff is '%s'", (minutes, expected) => {
    const now = new Date();
    const kickoff = new Date();
    kickoff.setMinutes(now.getMinutes() + minutes);

    const result = isGameLiveOrRecentlyFinished(kickoff);

    expect(result).toBe(expected);
  });
});
