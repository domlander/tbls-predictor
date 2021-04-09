const evaluatePrediction = (
  prediction: [number, number],
  actual: [number, number]
): number | null => {
  const homeGoalsPredicted = prediction[0];
  const awayGoalsPredicted = prediction[1];
  const homeGoalsActual = actual[0];
  const awayGoalsActual = actual[1];

  if (!Number.isInteger(homeGoalsActual) || !Number.isInteger(awayGoalsActual))
    return null;

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

export default evaluatePrediction;
