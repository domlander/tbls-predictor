const calculatePredictionScore = (
  prediction: [number | null, number | null],
  actual: [number, number]
): number => {
  const homeGoalsPredicted = prediction[0] || 0;
  const awayGoalsPredicted = prediction[1] || 0;
  const homeGoalsActual = actual[0];
  const awayGoalsActual = actual[1];

  if (
    homeGoalsPredicted === homeGoalsActual &&
    awayGoalsPredicted === awayGoalsActual
  )
    return 3;

  if (
    (homeGoalsPredicted > awayGoalsPredicted &&
      homeGoalsActual > awayGoalsActual) ||
    (homeGoalsPredicted < awayGoalsPredicted &&
      homeGoalsActual < awayGoalsActual) ||
    (homeGoalsPredicted === awayGoalsPredicted &&
      homeGoalsActual === awayGoalsActual)
  )
    return 1;

  return 0;
};

export default calculatePredictionScore;
