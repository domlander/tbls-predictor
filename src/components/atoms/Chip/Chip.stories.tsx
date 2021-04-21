import React from "react";
import { Story, Meta } from "@storybook/react";

import colours from "../../../styles/colours";
import Chip, { Props } from "./Chip";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Atoms/Chip",
  component: Chip,
} as Meta;

const Template: Story<Props> = (args) => <Chip {...args} />;

export const Perfect = Template.bind({});
Perfect.args = {
  backgroundColour: colours.gold300,
  label: "PERFECT",
  height: 12,
  width: 38,
};

export const Correct = Template.bind({});
Correct.args = {
  backgroundColour: colours.green300,
  label: "CORRECT",
  height: 12,
  width: 38,
};
