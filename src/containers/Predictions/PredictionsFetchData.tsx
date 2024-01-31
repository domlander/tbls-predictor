import type Fixture from "src/types/Fixture";
import type TeamFixtures from "src/types/TeamFixtures";
import fetchPredictions from "src/actions/fetchPredictions";
import PredictionsTable from "src/components/PredictionsTable";

interface Props {
  fixtures: Fixture[];
  weekId: number;
  recentFixturesByTeam: TeamFixtures[];
}

const PredictionsFetchData = async ({
  fixtures,
  recentFixturesByTeam,
  weekId,
}: Props) => {
  const { predictions } = await fetchPredictions(weekId);

  return (
    <PredictionsTable
      fixtures={fixtures}
      recentFixturesByTeam={recentFixturesByTeam}
      predictions={predictions}
    />
  );
};

export default PredictionsFetchData;
