import React from "react";

import { League } from "@prisma/client";
import WeekNavigator from "@/components/molecules/WeekNavigator";

interface Props {
  leagues: Array<League>;
}

const PredictionsContainer = ({ leagues }: Props) => (
  <>
    <WeekNavigator week={1} nextGameweekUrl="predictions/2" />
  </>
);

export default PredictionsContainer;
