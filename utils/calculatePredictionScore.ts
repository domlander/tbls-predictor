const calculatePredictionScore = (
  prediction: [number | null, number | null, boolean],
  actual: [number, number]
): number => {
  const homeGoalsPredicted = prediction[0] || 0;
  const awayGoalsPredicted = prediction[1] || 0;
  const bigBoyBonusMultiplier = prediction[2] ? 2 : 1; // prediction is either 1 or 0, rather than true or false
  const homeGoalsActual = actual[0];
  const awayGoalsActual = actual[1];

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
