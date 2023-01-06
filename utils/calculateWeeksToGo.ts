const calculateWeeksToGo = (
  currentGameweek: number,
  gameweekEnd: number
): number | null => {
  if (gameweekEnd < currentGameweek) {
    return null;
  }

  return gameweekEnd - currentGameweek;
};

export default calculateWeeksToGo;
