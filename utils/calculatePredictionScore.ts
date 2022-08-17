const calculatePredictionScore = (
  prediction: [number | null, number | null, boolean],
  actual: [number | null, number | null]
): number => {
  const homeGoalsPredicted = prediction[0] || 0;
  const awayGoalsPredicted = prediction[1] || 0;
  const bigBoyBonusMultiplier = prediction[2] ? 2 : 1;
  const homeGoalsActual = actual[0];
  const awayGoalsActual = actual[1];

  // The match hasn't finished yet
  if (homeGoalsActual === null || awayGoalsActual === null) {
    return 0;
  }

  if (
    homeGoalsPredicted === homeGoalsActual &&
    awayGoalsPredicted === awayGoalsActual
  ) {
    return 3 * bigBoyBonusMultiplier;
  }

  if (
    (homeGoalsPredicted > awayGoalsPredicted &&
      homeGoalsActual > awayGoalsActual) ||
    (homeGoalsPredicted < awayGoalsPredicted &&
      homeGoalsActual < awayGoalsActual) ||
    (homeGoalsPredicted === awayGoalsPredicted &&
      homeGoalsActual === awayGoalsActual)
  ) {
    return 1 * bigBoyBonusMultiplier;
  }

  return 0;
};

export default calculatePredictionScore;
