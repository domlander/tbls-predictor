import calculateMatchResult from "./calculateMatchResult";

const WIN_TEXT = "Won";
const DRAW_TEXT = "Drew";
const LOSS_TEXT = "Lost";

export type Result = "Won" | "Drew" | "Lost";

const getMatchResultText = (
  teamGoals: number | null,
  oppoGoals: number | null
): Result => {
  if (calculateMatchResult(teamGoals, oppoGoals) === 3) return WIN_TEXT;
  if (calculateMatchResult(teamGoals, oppoGoals) === 1) return DRAW_TEXT;
  return LOSS_TEXT;
};

export default getMatchResultText;
