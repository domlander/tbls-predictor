import React from "react";
import { Story, Meta } from "@storybook/react";
import Chip, { correctChip, perfectChip, Props } from "./Chip";

// 👇 This default export determines where your story goes in the story list
export default {
  title: "Atoms/Chip",
  component: Chip,
} as Meta;

const Template: Story<Props> = (args) => <Chip {...args} />;

export const Perfect = Template.bind({});
Perfect.args = {
  chipType: perfectChip,
};

export const Correct = Template.bind({});
Correct.args = {
  chipType: correctChip,
};
