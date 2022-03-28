import { isGameLiveOrRecentlyFinished } from "pages/api/fetchLatestScores";

describe("isGameLiveOrRecentlyFinished", () => {
  it("returns false if kickoff is tomorrow", () => {
    const now = new Date();
    const kickoff = new Date();
    kickoff.setHours(now.getHours() + 24);

    const result = isGameLiveOrRecentlyFinished(kickoff);

    expect(result).toBe(false);
  });

  it("returns false if kickoff is in 30 minutes", () => {
    const now = new Date();
    const kickoff = new Date();
    kickoff.setMinutes(now.getMinutes() + 30);

    const result = isGameLiveOrRecentlyFinished(kickoff);

    expect(result).toBe(false);
  });

  it("returns true if kickoff was 30 minutes ago", () => {
    const now = new Date();
    const kickoff = new Date();
    kickoff.setMinutes(now.getMinutes() - 30);

    const result = isGameLiveOrRecentlyFinished(kickoff);

    expect(result).toBe(true);
  });

  it("returns true if kickoff was 2 hours ago", () => {
    const now = new Date();
    const kickoff = new Date();
    kickoff.setHours(now.getHours() - 2);

    const result = isGameLiveOrRecentlyFinished(kickoff);

    expect(result).toBe(true);
  });

  it("returns false if kickoff was 3 hours ago", () => {
    const now = new Date();
    const kickoff = new Date();
    kickoff.setHours(now.getHours() - 3);

    const result = isGameLiveOrRecentlyFinished(kickoff);

    expect(result).toBe(false);
  });

  it("returns false if kickoff was 1 day ago", () => {
    const now = new Date();
    const kickoff = new Date();
    kickoff.setHours(now.getHours() - 24);

    const result = isGameLiveOrRecentlyFinished(kickoff);

    expect(result).toBe(false);
  });
});
