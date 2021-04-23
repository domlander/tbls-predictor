import React from "react";
import styled from "styled-components";

import { League } from "@prisma/client";
import HeaderBar from "@/components/molecules/HeaderBar";
import WeekNavigator from "@/components/molecules/WeekNavigator";

interface Props {
  leagues: Array<League>;
}

const PredictionsContainer = ({ leagues }: Props) => (
  <>
    <HeaderBar initial="D" handleClick={() => {}} />
    <WeekNavigator week={1} nextGameweekUrl="predictions/2" />
  </>
);

export default PredictionsContainer;
