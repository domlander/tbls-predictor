const calculateWeeksUntilStart = (
  currentGameweek: number,
  gameweekStart: number
): number | null => {
  if (gameweekStart < currentGameweek) {
    return null;
  }

  return gameweekStart - currentGameweek;
};

export default calculateWeeksUntilStart;
