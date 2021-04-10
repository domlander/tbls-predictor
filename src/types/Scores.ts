type UserWeeklyScore = {
  id: number;
  username: string;
  score: number;
};

export type WeeklyScores = {
  week: string;
  users: UserWeeklyScore[];
};
