const calculateMatchResult = (
  homeGoals: number | null,
  awayGoals: number | null
): number | null => {
  if (homeGoals === null || awayGoals === null) {
    return null;
  }

  if (homeGoals > awayGoals) {
    return 3;
  }

  if (homeGoals < awayGoals) {
    return 0;
  }

  return 1;
};

export default calculateMatchResult;
