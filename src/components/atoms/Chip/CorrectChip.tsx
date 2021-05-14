import React from "react";
import colours from "../../../styles/colours";
import Chip from "./Chip";

const CorrectChip = () => (
  <Chip
    label="CORRECT"
    colour={colours.grey100}
    backgroundColour={colours.green300}
  />
);

export default CorrectChip;
