import React from "react";
import { Story, Meta } from "@storybook/react";
import Chip, { Props } from "./Chip";
import colours from "../../../styles/colours";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Atoms/Chip",
  component: Chip,
} as Meta;

const Template: Story<Props> = (args) => <Chip {...args} />;

export const Perfect = Template.bind({});
Perfect.args = {
  label: "PERFECT",
  colour: colours.grey100,
  backgroundColour: colours.gold300,
};

export const Correct = Template.bind({});
Correct.args = {
  label: "CORRECT",
  colour: colours.grey100,
  backgroundColour: colours.green300,
};
